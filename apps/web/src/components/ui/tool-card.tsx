'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Star } from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  href?: string;
  recommended?: boolean;
  index?: number;
}

export function ToolCard({
  title,
  description,
  icon,
  href,
  recommended = false,
  index = 0,
}: ToolCardProps) {
  const CardWrapper = href ? 'a' : 'div';
  const cardProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      {recommended && (
        <motion.div
          className="absolute -top-2 -right-2 z-10"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Recomendado
          </div>
        </motion.div>
      )}

      <CardWrapper
        {...cardProps}
        className={`
          block h-full p-6 bg-white/5 backdrop-blur-sm rounded-xl
          border border-white/10 hover:bg-white/10 transition-all
          group relative overflow-hidden
          ${href ? 'cursor-pointer' : ''}
        `}
      >
        <div className="relative z-10">
          {icon && (
            <div className="mb-4 p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg inline-block">
              <div className="text-blue-400">{icon}</div>
            </div>
          )}

          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            {title}
            {href && (
              <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
            )}
          </h3>

          <p className="text-white/70 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Efeito de gradiente animado no hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 0% 100%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </CardWrapper>
    </motion.div>
  );
}