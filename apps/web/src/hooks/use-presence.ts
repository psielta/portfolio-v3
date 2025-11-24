import { useEffect, useState } from 'react';
import { enterPresence, leavePresence, subscribeToPresence } from '@/lib/ably-client';
import type * as Ably from 'ably';

export function usePresence(channelName: string | null, userId: string | null) {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!channelName || !userId) return;

    // Enter presence when component mounts
    enterPresence(channelName, { userId });

    // Subscribe to presence updates
    const unsubscribe = subscribeToPresence(
      channelName,
      (presenceMessage: Ably.PresenceMessage) => {
        const presenceUserId = presenceMessage.clientId;

        if (presenceMessage.action === 'enter' || presenceMessage.action === 'present') {
          setOnlineUsers((prev) => new Set(prev).add(presenceUserId));
        } else if (presenceMessage.action === 'leave') {
          setOnlineUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(presenceUserId);
            return newSet;
          });
        }
      }
    );

    return () => {
      leavePresence(channelName);
      unsubscribe();
    };
  }, [channelName, userId]);

  const isUserOnline = (checkUserId: string) => {
    return onlineUsers.has(checkUserId);
  };

  return {
    onlineUsers,
    isUserOnline,
  };
}
