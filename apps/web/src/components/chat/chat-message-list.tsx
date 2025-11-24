'use client';

import { useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import ChatMessage from './chat-message';
import TypingIndicator from './typing-indicator';

interface Message {
  id: string;
  content: string;
  senderId: string;
  sender: {
    id: string;
    name: string;
    image?: string | null;
  };
  status: 'SENT' | 'DELIVERED' | 'READ';
  createdAt: string | Date;
}

interface ChatMessageListProps {
  messages: Message[];
  currentUserId: string;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isTyping?: boolean;
  typingUserName?: string;
}

export default function ChatMessageList({
  messages,
  currentUserId,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  isTyping = false,
  typingUserName = 'Usuário',
}: ChatMessageListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const prevMessagesLength = useRef(messages.length);
  const prevScrollHeight = useRef(0);

  // Scroll to bottom on initial load and new messages (only when at bottom)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (isInitialMount.current && messages.length > 0) {
      // Initial load - scroll to bottom instantly
      container.scrollTop = container.scrollHeight;
      isInitialMount.current = false;
      prevMessagesLength.current = messages.length;
      return;
    }

    // Check if new messages were added at the end (not loaded from top)
    const newMessagesAdded = messages.length > prevMessagesLength.current;
    const wasAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    if (newMessagesAdded && wasAtBottom) {
      // New message received and user was at bottom - scroll to bottom
      container.scrollTop = container.scrollHeight;
    } else if (newMessagesAdded && prevScrollHeight.current > 0) {
      // Messages loaded at top - maintain scroll position
      const heightDiff = container.scrollHeight - prevScrollHeight.current;
      container.scrollTop += heightDiff;
    }

    prevMessagesLength.current = messages.length;
  }, [messages]);

  // Also scroll when typing indicator appears
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const wasAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    if (isTyping && wasAtBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [isTyping]);

  // Detect scroll to top for loading more messages
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || !hasMore || isLoadingMore || !onLoadMore) return;

    // When scrolled near the top (within 50px), load more
    if (container.scrollTop < 50) {
      prevScrollHeight.current = container.scrollHeight;
      onLoadMore();
    }
  }, [hasMore, isLoadingMore, onLoadMore]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center">
        <div>
          <p className="text-white/50 mb-2">Nenhuma mensagem ainda</p>
          <p className="text-white/30 text-sm">Comece a conversa!</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30"
    >
      <div className="space-y-4">
        {/* Loading more indicator at top */}
        {isLoadingMore && (
          <div className="flex justify-center py-2">
            <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
          </div>
        )}

        {/* Load more trigger area */}
        <div ref={topRef} className="h-1" />

        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwn={message.senderId === currentUserId}
            />
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && <TypingIndicator userName={typingUserName} />}

        {/* Anchor for auto-scroll */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
