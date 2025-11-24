import { useEffect, useState, useCallback, useRef } from 'react';
import { publishMessage, subscribeToChannel } from '@/lib/ably-client';
import type * as Ably from 'ably';

export function useTypingIndicator(conversationId: string | null, userId: string | null) {
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!conversationId || !userId) return;

    const channelName = `typing:${conversationId}`;

    const unsubscribe = subscribeToChannel(
      channelName,
      'typing',
      (message: Ably.Message) => {
        const { userId: typingUserId, isTyping } = message.data;

        // Ignore own typing events
        if (typingUserId === userId) return;

        setIsOtherUserTyping(isTyping);

        // Auto-hide after 3 seconds
        if (isTyping) {
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          typingTimeoutRef.current = setTimeout(() => {
            setIsOtherUserTyping(false);
          }, 3000);
        }
      }
    );

    return () => {
      unsubscribe();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversationId, userId]);

  const sendTypingIndicator = useCallback(
    (isTyping: boolean) => {
      if (!conversationId || !userId) return;

      const channelName = `typing:${conversationId}`;
      publishMessage(channelName, 'typing', {
        userId,
        isTyping,
      }).catch((error) => {
        console.error('Error sending typing indicator:', error);
      });
    },
    [conversationId, userId]
  );

  return {
    isOtherUserTyping,
    sendTypingIndicator,
  };
}
