'use client';

import { motion } from 'framer-motion';
import { Circle, CheckCircle2 } from 'lucide-react';

interface TimelineItem {
  date: string;
  title: string;
  company?: string;
  description: string;
  icon?: React.ReactNode;
  current?: boolean;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {/* Linha vertical conectora */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 opacity-30" />

      <div className="space-y-8">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
            className="relative flex gap-6"
          >
            {/* Ícone/Marcador */}
            <div className="relative z-10">
              <motion.div
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`
                  w-16 h-16 rounded-full flex items-center justify-center
                  ${item.current
                    ? 'bg-gradient-to-r from-green-400 to-emerald-600'
                    : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20'
                  }
                  border-2 ${item.current ? 'border-green-400/50' : 'border-white/20'}
                  backdrop-blur-sm
                `}
              >
                {item.icon ? (
                  <div className="text-white">{item.icon}</div>
                ) : item.current ? (
                  <Circle className="w-6 h-6 text-white fill-current" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-white" />
                )}
              </motion.div>

              {item.current && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(34, 197, 94, 0.7)',
                      '0 0 0 20px rgba(34, 197, 94, 0)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              )}
            </div>

            {/* Conteúdo */}
            <motion.div
              whileHover={{ x: 5 }}
              className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {item.title}
                  </h3>
                  {item.company && (
                    <p className="text-purple-400 font-medium mt-1">
                      {item.company}
                    </p>
                  )}
                </div>
                <span className={`
                  px-3 py-1 rounded-full text-xs font-medium
                  ${item.current
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }
                `}>
                  {item.date}
                </span>
              </div>

              <p className="text-white/70 text-sm leading-relaxed">
                {item.description}
              </p>

              {item.current && (
                <div className="mt-3 inline-flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-green-400"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-green-400 text-xs font-medium">
                    Posição atual
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}