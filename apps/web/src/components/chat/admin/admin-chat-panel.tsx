'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Calendar, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import { trpc, queryClient } from '@/utils/trpc';
import { toast } from 'sonner';
import { useChat } from '@/hooks/use-chat';
import { useTypingIndicator } from '@/hooks/use-typing-indicator';
import { usePresence } from '@/hooks/use-presence';
import { publishMessage } from '@/lib/ably-client';
import ChatMessageList from '../chat-message-list';
import ChatInput from '../chat-input';

interface AdminChatPanelProps {
  conversationId: string;
  adminId: string;
}

export default function AdminChatPanel({ conversationId, adminId }: AdminChatPanelProps) {
  // Get conversation details (for user info only)
  const { data: conversation, isLoading: isLoadingConversation } = useQuery({
    queryKey: ['chat.getConversationById', conversationId],
    queryFn: () => trpc.chat.getConversationById.query({ conversationId }),
  });

  // Paginated messages query
  const {
    data: paginatedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingMessages,
  } = useInfiniteQuery({
    queryKey: ['chat.getMessages', conversationId],
    queryFn: ({ pageParam }) =>
      trpc.chat.getMessages.query({
        conversationId,
        cursor: pageParam,
        limit: 20,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!conversationId,
    initialPageParam: undefined as string | undefined,
  });

  // Real-time hooks
  const { messages, setMessages, addOptimisticMessage, updateMessageId } = useChat(conversationId);
  const { isOtherUserTyping, sendTypingIndicator } = useTypingIndicator(conversationId, adminId);
  const { isUserOnline } = usePresence(
    `presence:${conversationId}`,
    adminId
  );

  // Load paginated messages when data arrives
  useEffect(() => {
    if (paginatedData?.pages) {
      const allMessages = paginatedData.pages.flatMap((page) => page.messages);
      setMessages(allMessages as any);
    }
  }, [paginatedData, setMessages]);

  // Load more messages callback
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (input: { conversationId: string; content: string }) =>
      trpc.chat.sendMessage.mutate(input),
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao enviar mensagem');
    },
  });

  // Mark as read when conversation is opened and broadcast read receipt
  useEffect(() => {
    if (conversationId && adminId) {
      trpc.chat.markAsRead
        .mutate({ conversationId })
        .then(() => {
          // Broadcast read receipt so user sees the status update
          publishMessage(`chat:${conversationId}`, 'read-receipt', {
            readBy: adminId,
            conversationId,
            readAt: new Date().toISOString(),
          }).catch(console.error);
        })
        .catch(console.error);
    }
  }, [conversationId, adminId]);

  const handleSend = async (content: string) => {
    if (!conversation) return;

    // Optimistic message
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
      content,
      senderId: adminId,
      sender: {
        id: adminId,
        name: 'Você',
        image: null,
      },
      status: 'SENT' as const,
      createdAt: new Date().toISOString(),
    };

    addOptimisticMessage(optimisticMessage as any);

    try {
      // Send via tRPC
      const savedMessage = await sendMessageMutation.mutateAsync({
        conversationId,
        content,
      });

      // Update with real ID
      updateMessageId(tempId, savedMessage.id);

      // Broadcast via Ably
      await publishMessage(`chat:${conversationId}`, 'message', {
        id: savedMessage.id,
        content,
        senderId: adminId,
        sender: {
          id: adminId,
          name: 'Mateus Salgueiro',
          image: null,
        },
        createdAt: savedMessage.createdAt,
        status: 'SENT',
      });

      // Stop typing
      sendTypingIndicator(false);

      // Invalidate conversations list
      queryClient.invalidateQueries({
        queryKey: [['chat', 'getAllConversations']],
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    }
  };

  const handleTyping = (isTyping: boolean) => {
    sendTypingIndicator(isTyping);
  };

  const isLoading = isLoadingConversation || isLoadingMessages;

  if (isLoading && !conversation) {
    return (
      <div className="h-full flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <p className="text-white/50">Conversa não encontrada</p>
      </div>
    );
  }

  const user = conversation.user;
  const userOnline = isUserOnline(user.id);
  const avatarLetter = user.name.charAt(0).toUpperCase();

  return (
    <div className="h-full bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 flex flex-col overflow-hidden">
      {/* Header with user info */}
      <div className="p-4 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                avatarLetter
              )}
            </div>
            {userOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-white">{user.name}</h3>
            <div className="flex items-center gap-3 text-xs text-white/50">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {user.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(conversation.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ChatMessageList
        messages={messages}
        currentUserId={adminId}
        isTyping={isOtherUserTyping}
        typingUserName={user.name}
        hasMore={hasNextPage}
        isLoadingMore={isFetchingNextPage}
        onLoadMore={handleLoadMore}
      />

      {/* Input */}
      <ChatInput onSend={handleSend} onTyping={handleTyping} />
    </div>
  );
}
