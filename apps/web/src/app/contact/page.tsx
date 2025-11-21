'use client';

import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Send, MapPin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Entre em Contato
          </h1>
          <p className="text-white/70 text-lg">
            Vamos conversar sobre projetos, oportunidades ou colaborações
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Informações de contato */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Informações</h2>

              <div className="space-y-4">
                <a
                  href="mailto:psielta@gmail.com"
                  className="flex items-start gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all group"
                >
                  <div className="p-2 bg-pink-500/10 rounded-lg">
                    <Mail className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Email</p>
                    <p className="text-white group-hover:text-pink-400 transition-colors">
                      psielta@gmail.com
                    </p>
                  </div>
                </a>

                <a
                  href="https://github.com/psielta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all group"
                >
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Github className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">GitHub</p>
                    <p className="text-white group-hover:text-purple-400 transition-colors">
                      @psielta
                    </p>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/in/mateus-salgueiro-525717205/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all group"
                >
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Linkedin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">LinkedIn</p>
                    <p className="text-white group-hover:text-blue-400 transition-colors">
                      Mateus Salgueiro
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Mensagem rápida */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Envie uma mensagem</h2>

              <p className="text-white/70 text-center py-12">
                Formulário de contato em desenvolvimento.
                <br />
                <span className="text-sm">Por enquanto, use os links de contato ao lado.</span>
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-blue-500/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Disponível para
              </h3>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Desenvolvimento de projetos
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Consultoria técnica
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Colaborações em código aberto
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Oportunidades profissionais
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
