'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/utils/trpc';
import ChatDrawer from './chat-drawer';

export default function ChatWidget() {
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  // Get unread count only if logged in
  const { data: unreadCount } = useQuery({
    queryKey: ['chat.getUnreadCount'],
    queryFn: () => trpc.chat.getUnreadCount.query(),
    enabled: !!session?.user && !session.user.isAdmin,
  });

  // Don't show widget if admin or still loading
  if (isPending || session?.user?.isAdmin) {
    return null;
  }

  const hasUnread = (unreadCount || 0) > 0;

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="fixed bottom-6 right-6 z-40"
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative p-4 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 hover:from-blue-600 hover:via-purple-700 hover:to-pink-700 rounded-full shadow-lg text-white transition-all"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="message"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unread Badge */}
          <AnimatePresence>
            {hasUnread && !isOpen && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-red-500 rounded-full flex items-center justify-center"
              >
                <span className="text-xs font-bold text-white">
                  {unreadCount! > 99 ? '99+' : unreadCount}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulse animation when unread */}
          {hasUnread && !isOpen && (
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600"
            />
          )}
        </motion.button>
      </motion.div>

      {/* Chat Drawer */}
      <ChatDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
