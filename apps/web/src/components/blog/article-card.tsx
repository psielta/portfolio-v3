'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { formatDate } from '@/lib/format-date';

interface ArticleCardProps {
  article: {
    slug: string;
    title: string;
    description: string;
    publishedAt: string;
    author: string;
    readingTime?: string;
    tags?: string[];
  };
  commentCount?: number;
}

export function ArticleCard({ article, commentCount }: ArticleCardProps) {
  return (
    <motion.article
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: 'spring' as const, damping: 20, stiffness: 100 }}
      className="relative group"
    >
      {/* Card com efeito de glow */}
      <Link
        href={`/blog/${article.slug}`}
        className="block relative overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-6 transition-all duration-300 hover:border-blue-500/50 hover:bg-black/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
      >
        {/* Efeito de gradient no hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

        <div className="relative z-10 flex flex-col gap-3">
          {/* Header com data e tempo de leitura */}
          <div className="flex items-center gap-4 text-xs text-white/50">
            <time dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
            {article.readingTime && (
              <>
                <span className="text-white/30">•</span>
                <span>{article.readingTime}</span>
              </>
            )}
            {commentCount !== undefined && commentCount > 0 && (
              <>
                <span className="text-white/30">•</span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {commentCount}
                </span>
              </>
            )}
          </div>

          {/* Título */}
          <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
            {article.title}
          </h2>

          {/* Descrição */}
          <p className="text-sm text-white/70 line-clamp-3">
            {article.description}
          </p>

          {/* Footer com tags e CTA */}
          <div className="flex items-center justify-between mt-2">
            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {article.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-full bg-white/10 text-white/60 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* CTA */}
            <span className="text-sm text-blue-400 group-hover:text-blue-300 transition-colors ml-auto">
              Ler artigo →
            </span>
          </div>
        </div>

        {/* Linha animada no bottom */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"
        />
      </Link>
    </motion.article>
  );
}