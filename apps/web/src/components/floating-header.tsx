'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github, Linkedin, Mail, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function FloatingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Projetos', href: '/projects' },
    { label: 'Sobre', href: '/about' },
    { label: 'Contato', href: '/contact' },
  ];

  return (
    <>
      {/* Header principal */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 bg-transparent"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand - Lado Esquerdo */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Link href="/wizard?from=home" className="group flex items-center gap-2">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {'<'}Portfolio {'/>'}
                  </span>
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </Link>
            </motion.div>

            {/* Nome - Desktop */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="hidden md:flex items-center gap-3"
            >
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative px-6 py-2 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
                  <span className="text-xl font-semibold text-white">
                    Mateus Salgueiro
                  </span>
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                    animate={{
                      opacity: [0, 1, 0],
                      scaleX: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Navigation - Desktop */}
            <motion.nav
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="hidden md:flex items-center gap-6"
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <Link
                    href={item.href as any}
                    className="relative text-white/80 hover:text-white transition-colors group"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                  </Link>
                </motion.div>
              ))}

              {/* Social Links */}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
                <motion.a
                  href="https://github.com/psielta"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/mateus-salgueiro-525717205/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="mailto:psielta@gmail.com"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </motion.a>
              </div>
            </motion.nav>

            {/* Mobile Menu Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white p-2"
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </motion.button>
          </div>

          {/* Nome - Mobile */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="md:hidden mt-3 flex justify-center"
          >
            <div className="relative px-4 py-1.5 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
              <span className="text-sm font-semibold text-white">
                Mateus Salgueiro
              </span>
            </div>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/95 backdrop-blur-lg border-t border-white/10"
          >
            <nav className="container mx-auto px-4 py-6 space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href as any}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-white/80 hover:text-white transition-colors py-2"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="mailto:contato@mateussalgueiro.com"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </motion.header>

      {/* Citação de Isaac Newton */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 max-w-2xl"
      >
        <motion.div
          className="relative px-6 py-4 bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10"
          whileHover={{ scale: 1.02 }}
        >
          {/* Brilho de fundo */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <div className="relative">
            <p className="text-white/90 text-sm md:text-base italic text-center leading-relaxed">
              "Se vi mais longe foi por estar sobre os ombros de gigantes"
            </p>
            <motion.p
              className="text-white/50 text-xs text-right mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              — Isaac Newton
            </motion.p>
          </div>

          {/* Linha decorativa animada */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"
            animate={{
              opacity: [0, 1, 0],
              scaleX: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      </motion.div>

      {/* CTA Flutuante - ao lado do drawer */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-8 right-32 z-50 hidden md:block"
      >
        <Link href="/projects">
          <motion.div
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Ver Projetos</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />

            {/* Efeito de pulso */}
            <motion.div
              className="absolute inset-0 rounded-full bg-white"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          </motion.div>
        </Link>
      </motion.div>
    </>
  );
}
