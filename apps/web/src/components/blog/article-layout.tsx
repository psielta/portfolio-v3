'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/format-date';

interface ArticleLayoutProps {
  article: {
    title: string;
    description: string;
    author: string;
    publishedAt: string;
    readingTime?: string;
    tags?: string[];
  };
  children: React.ReactNode;
}

export function ArticleLayout({ article, children }: ArticleLayoutProps) {
  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
        {/* Background gradient effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent pointer-events-none"
        />

        <div className="relative mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
            aria-label="Breadcrumb"
          >
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-white/50 hover:text-white/80 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li className="text-white/30">/</li>
              <li>
                <Link
                  href="/blog"
                  className="text-white/50 hover:text-white/80 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li className="text-white/30">/</li>
              <li className="text-white/90">{article.title}</li>
            </ol>
          </motion.nav>

          {/* Article Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            {/* Title with gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-6 text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              {article.title}
            </motion.h1>

            {/* Description */}
            <p className="mb-6 text-lg text-white/70">
              {article.description}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
              {/* Author */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {article.author.charAt(0)}
                </div>
                <span>{article.author}</span>
              </div>

              <span className="text-white/30">•</span>

              {/* Date */}
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>

              {/* Reading time */}
              {article.readingTime && (
                <>
                  <span className="text-white/30">•</span>
                  <span>{article.readingTime}</span>
                </>
              )}
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 hover:text-white transition-all cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.header>

          {/* Divider with gradient */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />

          {/* Article content with prose styles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="prose prose-invert prose-lg max-w-none"
          >
            {children}
          </motion.div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <Link
                href="/blog"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                ← Voltar para o blog
              </Link>

              {/* Share buttons placeholder */}
              <div className="flex items-center gap-4">
                <span className="text-xs text-white/50">Compartilhar:</span>
                <button
                  className="text-white/50 hover:text-white transition-colors"
                  aria-label="Compartilhar no Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
                <button
                  className="text-white/50 hover:text-white transition-colors"
                  aria-label="Compartilhar no LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </button>
              </div>
            </div>
          </footer>
        </div>
      </motion.article>
  );
}