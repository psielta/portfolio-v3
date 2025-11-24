'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import type { Session } from '@portfolio/auth';
import ConversationList from '@/components/chat/admin/conversation-list';
import AdminChatPanel from '@/components/chat/admin/admin-chat-panel';

interface AdminChatContentProps {
  session: Session;
}

export default function AdminChatContent({ session }: AdminChatContentProps) {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Admin Chat Dashboard
            </h1>
          </div>
          <p className="text-white/60">
            Gerencie conversas com visitantes do portfolio
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Left: Conversation List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <ConversationList
              activeConversationId={activeConversationId}
              onSelectConversation={setActiveConversationId}
            />
          </motion.div>

          {/* Right: Active Chat */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            {activeConversationId ? (
              <AdminChatPanel
                conversationId={activeConversationId}
                adminId={session.user.id}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/50">Selecione uma conversa</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
