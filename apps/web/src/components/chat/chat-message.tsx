'use client';

import { motion } from 'framer-motion';
import { Check, CheckCheck } from 'lucide-react';

interface ChatMessageProps {
  message: {
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
  };
  isOwn: boolean;
}

export default function ChatMessage({ message, isOwn }: ChatMessageProps) {
  const formatTime = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const avatarLetter = message.sender.name.charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      {!isOwn && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xs">
          {message.sender.image ? (
            <img
              src={message.sender.image}
              alt={message.sender.name}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            avatarLetter
          )}
        </div>
      )}

      {/* Message Bubble */}
      <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && (
          <span className="text-xs text-white/50 mb-1 px-1">{message.sender.name}</span>
        )}

        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwn
              ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white rounded-br-sm'
              : 'bg-white/10 backdrop-blur-sm border border-white/10 text-white rounded-bl-sm'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>

        {/* Timestamp and Status */}
        <div className={`flex items-center gap-1 mt-1 px-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs text-white/40">{formatTime(message.createdAt)}</span>
          {isOwn && (
            <div className="text-white/40">
              {message.status === 'READ' ? (
                <CheckCheck className="w-3 h-3 text-blue-400" />
              ) : message.status === 'DELIVERED' ? (
                <CheckCheck className="w-3 h-3" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
