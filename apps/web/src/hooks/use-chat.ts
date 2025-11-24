import { useEffect, useState, useCallback } from 'react';
import { useSession } from '@/lib/auth-client';
import { subscribeToChannel } from '@/lib/ably-client';
import type * as Ably from 'ably';

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  sender: {
    id: string;
    name: string;
    image?: string | null;
  };
  createdAt: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
}

export function useChat(conversationId: string | null) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!conversationId || !session?.user) return;

    const channelName = `chat:${conversationId}`;

    // Subscribe to new messages
    const unsubscribeMessages = subscribeToChannel(
      channelName,
      'message',
      (message: Ably.Message) => {
        const newMessage: ChatMessage = message.data;
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((msg) => msg.id === newMessage.id)) {
            return prev;
          }
          return [...prev, newMessage];
        });
      }
    );

    // Subscribe to read receipts
    const unsubscribeReadReceipts = subscribeToChannel(
      channelName,
      'read-receipt',
      (message: Ably.Message) => {
        const { readBy } = message.data as { readBy: string };
        // Update messages sent by the current user to READ status
        // (because the other user read them)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId !== readBy ? { ...msg, status: 'READ' as const } : msg
          )
        );
      }
    );

    setIsConnected(true);

    return () => {
      unsubscribeMessages();
      unsubscribeReadReceipts();
      setIsConnected(false);
    };
  }, [conversationId, session]);

  const addOptimisticMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const removeOptimisticMessage = useCallback((tempId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
  }, []);

  const updateMessageId = useCallback((tempId: string, realId: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === tempId ? { ...msg, id: realId } : msg))
    );
  }, []);

  return {
    messages,
    setMessages,
    isConnected,
    addOptimisticMessage,
    removeOptimisticMessage,
    updateMessageId,
  };
}
