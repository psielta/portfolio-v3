'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArticleCard } from '@/components/blog/article-card';
import type { Article } from '@/lib/blog';

interface BlogContentProps {
  articles: Article[];
  featuredArticles: Article[];
  tags: string[];
}

export function BlogContent({ articles, featuredArticles, tags }: BlogContentProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Função para resetar o filtro
  const handleResetFilter = () => {
    setSelectedTag(null);
  };

  // Função para selecionar uma tag
  const handleSelectTag = (tag: string) => {
    setSelectedTag(prevTag => prevTag === tag ? null : tag);
  };

  // Filtrar artigos por tag
  const filteredArticles = selectedTag
    ? articles.filter(article => article.tags?.includes(selectedTag))
    : articles;

  const filteredFeatured = selectedTag
    ? featuredArticles.filter(article => article.tags?.includes(selectedTag))
    : featuredArticles;

  // Animação stagger para os cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100
      }
    }
  };

  return (
    <div className="relative">
      {/* Background gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent pointer-events-none"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="mb-4 text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Blog
          </h1>
          <p className="text-lg text-white/70 max-w-3xl">
            Compartilhando conhecimento sobre desenvolvimento web, arquitetura de software,
            tecnologias modernas e experiências na jornada como desenvolvedor.
          </p>
        </motion.header>

        {/* Featured Articles Section */}
        {filteredFeatured.length > 0 && (
          <motion.section
            key={`featured-${selectedTag || 'all'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="mb-6 text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-yellow-400">★</span>
              Em Destaque
              {selectedTag && (
                <span className="text-sm text-white/60">
                  ({filteredFeatured.length} em #{selectedTag})
                </span>
              )}
            </h2>
            <motion.div
              key={`featured-grid-${selectedTag || 'all'}`}
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid gap-6 md:grid-cols-2"
            >
              {filteredFeatured.map((article) => (
                <motion.div
                  key={article.slug}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileInView="visible"
                  viewport={{ once: false }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* Tags Section */}
        {tags.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="mb-4 text-xl font-semibold text-white">Explorar por tópico</h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.05, delayChildren: 0.5 }}
              className="flex flex-wrap gap-2"
            >
              {/* Botão para mostrar todos */}
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResetFilter}
                className={`px-4 py-2 text-sm rounded-full border transition-all ${
                  selectedTag === null
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent'
                    : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20 hover:text-white hover:border-blue-500/50'
                }`}
              >
                Todos
              </motion.button>

              {/* Botões de tags */}
              {tags.map((tag, index) => (
                <motion.button
                  key={tag}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectTag(tag)}
                  className={`px-4 py-2 text-sm rounded-full border transition-all ${
                    selectedTag === tag
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent'
                      : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20 hover:text-white hover:border-blue-500/50'
                  }`}
                >
                  #{tag}
                </motion.button>
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* All Articles */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="mb-6 text-2xl font-bold text-white">
            {selectedTag ? (
              <>
                Artigos em <span className="text-blue-400">#{selectedTag}</span>
                <span className="text-sm text-white/60 ml-2">
                  ({filteredArticles.length} {filteredArticles.length === 1 ? 'artigo' : 'artigos'})
                </span>
              </>
            ) : (
              featuredArticles.length > 0 ? 'Todos os Artigos' : 'Artigos'
            )}
          </h2>

          {filteredArticles.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <p className="text-white/50 mb-4">
                {selectedTag
                  ? `Nenhum artigo encontrado com a tag "${selectedTag}".`
                  : 'Nenhum artigo publicado ainda.'
                }
              </p>
              {selectedTag ? (
                <button
                  onClick={handleResetFilter}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Ver todos os artigos →
                </button>
              ) : (
                <p className="text-white/30 text-sm">Em breve compartilharei conteúdo por aqui!</p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={`grid-${selectedTag || 'all'}`}
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredArticles.map((article) => (
                <motion.div
                  key={article.slug}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileInView="visible"
                  viewport={{ once: false }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.section>

        {/* Newsletter CTA */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
          className="mt-16 p-8 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10"
        >
          <div className="text-center">
            <h3 className="mb-2 text-2xl font-bold text-white">
              Fique por dentro
            </h3>
            <p className="mb-6 text-white/70">
              Acompanhe os novos artigos e atualizações do blog.
            </p>
            <div className="flex justify-center gap-4">
              <motion.a
                href="https://github.com/psielta"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all border border-white/20"
              >
                GitHub
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/mateus-salgueiro-525717205/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all"
              >
                LinkedIn
              </motion.a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}