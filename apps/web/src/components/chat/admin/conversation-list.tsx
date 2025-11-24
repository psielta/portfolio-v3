'use client';

import { motion } from 'framer-motion';
import { Loader2, MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/utils/trpc';

interface ConversationListProps {
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

export default function ConversationList({
  activeConversationId,
  onSelectConversation,
}: ConversationListProps) {
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['chat.getAllConversations'],
    queryFn: () => trpc.chat.getAllConversations.query(),
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
        <div>
          <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/50">Nenhuma conversa ainda</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h2 className="font-semibold text-white">
          Conversas ({conversations.length})
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
        <div className="p-2 space-y-2">
          {conversations.map((conversation) => {
            const isActive = activeConversationId === conversation.id;
            const unreadCount = conversation._count?.messages || 0;
            const lastMessage = conversation.messages[0];
            const avatarLetter = conversation.user.name.charAt(0).toUpperCase();

            return (
              <motion.button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-3 rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 border border-purple-500/30'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                      {conversation.user.image ? (
                        <img
                          src={conversation.user.image}
                          alt={conversation.user.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        avatarLetter
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-white truncate">
                        {conversation.user.name}
                      </span>
                      {lastMessage && (
                        <span className="text-xs text-white/40">
                          {new Date(lastMessage.createdAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>
                    {lastMessage ? (
                      <p className="text-sm text-white/60 truncate">
                        {lastMessage.sender.name === 'Você' ? 'Você: ' : ''}
                        {lastMessage.content}
                      </p>
                    ) : (
                      <p className="text-sm text-white/40 italic">Nova conversa</p>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
