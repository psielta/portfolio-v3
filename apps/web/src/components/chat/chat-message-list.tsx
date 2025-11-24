'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import ChatMessage from './chat-message';
import TypingIndicator from './typing-indicator';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  isTyping?: boolean;
  typingUserName?: string;
}

export default function ChatMessageList({
  messages,
  currentUserId,
  isLoading = false,
  isTyping = false,
  typingUserName = 'Usuário',
}: ChatMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

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
    <ScrollArea className="flex-1 px-4 py-4">
      <div className="space-y-4" ref={scrollRef}>
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
    </ScrollArea>
  );
}
