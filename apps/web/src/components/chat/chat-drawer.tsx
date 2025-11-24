'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Circle, Loader2, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { trpc, queryClient } from '@/utils/trpc';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useChat } from '@/hooks/use-chat';
import { useTypingIndicator } from '@/hooks/use-typing-indicator';
import { usePresence } from '@/hooks/use-presence';
import { publishMessage } from '@/lib/ably-client';
import ChatMessageList from './chat-message-list';
import ChatInput from './chat-input';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatDrawer({ isOpen, onClose }: ChatDrawerProps) {
  const { data: session } = useSession();
  const [conversationId, setConversationId] = useState<string | null>(null);

  // Get or create conversation (only if logged in)
  const { data: conversation, isLoading: isLoadingConversation } = useQuery({
    queryKey: ['chat.getOrCreateConversation'],
    queryFn: () => trpc.chat.getOrCreateConversation.query(),
    enabled: !!session?.user && isOpen,
  });

  useEffect(() => {
    if (conversation) {
      setConversationId(conversation.id);
    }
  }, [conversation]);

  // Real-time hooks
  const { messages, setMessages, addOptimisticMessage, updateMessageId } = useChat(conversationId);
  const { isOtherUserTyping, sendTypingIndicator } = useTypingIndicator(
    conversationId,
    session?.user?.id || null
  );
  const { isUserOnline } = usePresence(
    conversationId ? `presence:${conversationId}` : null,
    session?.user?.id || null
  );

  // Load messages from DB when conversation is ready
  useEffect(() => {
    if (conversation?.messages) {
      setMessages(conversation.messages as any);
    }
  }, [conversation, setMessages]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (input: { conversationId: string; content: string }) =>
      trpc.chat.sendMessage.mutate(input),
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao enviar mensagem');
    },
  });

  // Mark as read when drawer opens
  useEffect(() => {
    if (isOpen && conversationId) {
      trpc.chat.markAsRead.mutate({ conversationId }).catch(console.error);
    }
  }, [isOpen, conversationId]);

  const handleSend = async (content: string) => {
    if (!conversationId || !session?.user) return;

    // Optimistic message
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
      content,
      senderId: session.user.id,
      sender: {
        id: session.user.id,
        name: session.user.name || 'Você',
        image: session.user.image,
      },
      status: 'SENT' as const,
      createdAt: new Date().toISOString(),
    };

    addOptimisticMessage(optimisticMessage as any);

    try {
      // Send via tRPC (persists to DB)
      const savedMessage = await sendMessageMutation.mutateAsync({
        conversationId,
        content,
      });

      // Update with real ID
      updateMessageId(tempId, savedMessage.id);

      // Broadcast via Ably for real-time (with timeout to avoid hanging)
      try {
        await Promise.race([
          publishMessage(`chat:${conversationId}`, 'message', {
            id: savedMessage.id,
            content,
            senderId: session.user.id,
            sender: {
              id: session.user.id,
              name: session.user.name || 'Você',
              image: session.user.image,
            },
            createdAt: savedMessage.createdAt,
            status: 'SENT',
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Ably publish timeout')), 3000)
          )
        ]);
      } catch (ablyError) {
        console.warn('Ably publish failed (non-critical):', ablyError);
        // Continue anyway - message is saved in DB
      }

      // Stop typing indicator
      sendTypingIndicator(false);
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      throw error; // Re-throw to show error in UI
    }
  };

  const handleTyping = (isTyping: boolean) => {
    sendTypingIndicator(isTyping);
  };

  // Check if admin is online (assuming admin has a known ID)
  const adminOnline = false; // You can implement this based on presence

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[400px] bg-gradient-to-br from-gray-900 via-gray-900 to-black border-l border-white/10 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                    M
                  </div>
                  {adminOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-white">Mateus Salgueiro</h3>
                  <p className="text-xs text-white/50">
                    {adminOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            {!session?.user ? (
              // Not logged in - Show login prompt
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-sm">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="inline-block p-6 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full mb-6"
                  >
                    <LogIn className="w-12 h-12 text-purple-400" />
                  </motion.div>

                  <h3 className="text-xl font-semibold text-white mb-3">
                    Faça login para conversar
                  </h3>
                  <p className="text-white/60 mb-6">
                    Entre na sua conta para iniciar uma conversa comigo!
                  </p>

                  <div className="space-y-3">
                    <Link
                      href="/login"
                      onClick={onClose}
                      className="block w-full py-3 px-6 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 hover:from-blue-600 hover:via-purple-700 hover:to-pink-700 rounded-xl font-semibold text-white transition-all"
                    >
                      Fazer Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={onClose}
                      className="block w-full py-3 px-6 bg-white/10 hover:bg-white/20 rounded-xl font-semibold text-white transition-all border border-white/20"
                    >
                      Criar Conta
                    </Link>
                  </div>
                </div>
              </div>
            ) : isLoadingConversation ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              </div>
            ) : (
              <>
                <ChatMessageList
                  messages={messages}
                  currentUserId={session.user.id}
                  isTyping={isOtherUserTyping}
                  typingUserName="Mateus"
                />
                <ChatInput
                  onSend={handleSend}
                  onTyping={handleTyping}
                  disabled={!conversationId}
                />
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
