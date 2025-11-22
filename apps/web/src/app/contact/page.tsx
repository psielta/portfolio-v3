'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Github,
  Linkedin,
  Send,
  MapPin,
  Globe,
  Clock,
  MessageSquare,
  User,
  AtSign,
  Rocket,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Loader2,
  PenTool,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Schema de validação
const contactSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome muito longo'),
  email: z
    .string()
    .email('Email inválido')
    .max(100, 'Email muito longo'),
  subject: z
    .string()
    .min(5, 'Assunto deve ter pelo menos 5 caracteres')
    .max(200, 'Assunto muito longo'),
  message: z
    .string()
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
    .max(5000, 'Mensagem muito longa'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange',
  });

  const messageLength = watch('message')?.length || 0;

  const onSubmit = async (data: ContactFormData) => {
    setSendError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao enviar mensagem');
      }

      setIsSuccess(true);
      reset();

      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Erro ao enviar:', error);
      setSendError(
        error instanceof Error
          ? error.message
          : 'Erro ao enviar mensagem. Tente novamente.'
      );
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header com animação */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block mb-4"
          >
            <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full">
              <Mail className="w-12 h-12 text-blue-400" />
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Entre em Contato
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Tem um projeto em mente? Vamos conversar e transformar suas ideias em realidade
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Contact Info (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Contact Cards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Contato Rápido
              </h3>

              <div className="space-y-3">
                <Link
                  href="mailto:psielta@gmail.com"
                  className="group relative block overflow-hidden rounded-xl bg-gradient-to-r from-pink-500/10 to-rose-500/10 p-4 hover:from-pink-500/20 hover:to-rose-500/20 transition-all duration-300 border border-pink-500/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-500/20 rounded-lg group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5 text-pink-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white/60 text-xs uppercase tracking-wider">Email</p>
                      <p className="text-white font-medium">psielta@gmail.com</p>
                    </div>
                    <Send className="w-4 h-4 text-white/30 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>

                <Link
                  href="https://github.com/psielta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block overflow-hidden rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-4 hover:from-purple-500/20 hover:to-indigo-500/20 transition-all duration-300 border border-purple-500/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg group-hover:scale-110 transition-transform">
                      <Github className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white/60 text-xs uppercase tracking-wider">GitHub</p>
                      <p className="text-white font-medium">@psielta</p>
                    </div>
                    <Globe className="w-4 h-4 text-white/30 group-hover:text-purple-400 group-hover:rotate-12 transition-all" />
                  </div>
                </Link>

                <Link
                  href="https://www.linkedin.com/in/mateus-salgueiro-525717205/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block overflow-hidden rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-300 border border-blue-500/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
                      <Linkedin className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white/60 text-xs uppercase tracking-wider">LinkedIn</p>
                      <p className="text-white font-medium">Mateus Salgueiro</p>
                    </div>
                    <User className="w-4 h-4 text-white/30 group-hover:text-blue-400 group-hover:scale-110 transition-all" />
                  </div>
                </Link>
              </div>
            </motion.div>

            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 p-6"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
              <div className="relative">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-400" />
                  Localização
                </h3>
                <p className="text-white/80 font-medium mb-1">
                  São Sebastião do Paraíso - MG
                </p>
                <p className="text-white/60 text-sm mb-3">
                  Brasil 🇧🇷
                </p>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>GMT-3 (Brasília)</span>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-white/70 text-sm">
                    Disponível para projetos remotos globalmente
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Status Atual
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-400 animate-ping" />
                  </div>
                  <span className="text-white/80">Disponível para novos projetos</span>
                </div>
                <div className="text-white/60 text-sm space-y-1">
                  <p>✓ Desenvolvimento Full-Stack</p>
                  <p>✓ Consultoria Técnica</p>
                  <p>✓ Arquitetura de Software</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Contact Form (3 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

              <div className="relative">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <PenTool className="w-7 h-7 text-purple-400" />
                  Envie sua mensagem
                </h2>

                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="py-20 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-600 mb-6"
                      >
                        <CheckCircle2 className="w-10 h-10 text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Mensagem enviada com sucesso!
                      </h3>
                      <p className="text-white/70">
                        Obrigado por entrar em contato. Você receberá uma confirmação por email.
                      </p>
                      <motion.div
                        className="mt-6"
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Rocket className="w-8 h-8 text-purple-400 mx-auto" />
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-5"
                    >
                      {/* Error Alert */}
                      <AnimatePresence>
                        {sendError && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
                          >
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-red-400 font-medium">Erro ao enviar mensagem</p>
                              <p className="text-red-400/70 text-sm mt-1">{sendError}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Name Field */}
                      <div>
                        <label htmlFor="name" className="block text-white font-medium mb-2">
                          Nome completo
                        </label>
                        <div className="relative">
                          <input
                            {...register('name')}
                            type="text"
                            className={`
                              w-full px-4 py-3 pl-12 bg-white/10 border rounded-xl
                              text-white placeholder-white/40
                              backdrop-blur-sm
                              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                              transition-all duration-300
                              ${errors.name
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-white/20 hover:border-white/30'
                              }
                            `}
                            placeholder="Digite seu nome"
                          />
                          <User className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                        </div>
                        <AnimatePresence>
                          {errors.name && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-red-400 text-sm mt-1"
                            >
                              {errors.name.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Email Field */}
                      <div>
                        <label htmlFor="email" className="block text-white font-medium mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <input
                            {...register('email')}
                            type="email"
                            className={`
                              w-full px-4 py-3 pl-12 bg-white/10 border rounded-xl
                              text-white placeholder-white/40
                              backdrop-blur-sm
                              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                              transition-all duration-300
                              ${errors.email
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-white/20 hover:border-white/30'
                              }
                            `}
                            placeholder="seu@email.com"
                          />
                          <AtSign className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                        </div>
                        <AnimatePresence>
                          {errors.email && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-red-400 text-sm mt-1"
                            >
                              {errors.email.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Subject Field */}
                      <div>
                        <label htmlFor="subject" className="block text-white font-medium mb-2">
                          Assunto
                        </label>
                        <div className="relative">
                          <input
                            {...register('subject')}
                            type="text"
                            className={`
                              w-full px-4 py-3 pl-12 bg-white/10 border rounded-xl
                              text-white placeholder-white/40
                              backdrop-blur-sm
                              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                              transition-all duration-300
                              ${errors.subject
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-white/20 hover:border-white/30'
                              }
                            `}
                            placeholder="Sobre o que você quer conversar?"
                          />
                          <MessageSquare className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                        </div>
                        <AnimatePresence>
                          {errors.subject && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-red-400 text-sm mt-1"
                            >
                              {errors.subject.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Message Field */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label htmlFor="message" className="block text-white font-medium">
                            Mensagem
                          </label>
                          <span className={`text-sm ${messageLength > 4900 ? 'text-red-400' : 'text-white/40'}`}>
                            {messageLength}/5000
                          </span>
                        </div>
                        <div className="relative">
                          <textarea
                            {...register('message')}
                            rows={6}
                            className={`
                              w-full px-4 py-3 bg-white/10 border rounded-xl
                              text-white placeholder-white/40
                              backdrop-blur-sm resize-none
                              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                              transition-all duration-300
                              ${errors.message
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-white/20 hover:border-white/30'
                              }
                            `}
                            placeholder="Digite sua mensagem detalhada aqui..."
                          />
                          <div className="absolute bottom-2 right-2 opacity-10">
                            <PenTool className="w-20 h-20 text-white" />
                          </div>
                        </div>
                        <AnimatePresence>
                          {errors.message && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-red-400 text-sm mt-1"
                            >
                              {errors.message.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                        className={`
                          relative w-full py-4 px-6 rounded-xl font-semibold text-white
                          bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600
                          hover:from-blue-600 hover:via-purple-700 hover:to-pink-700
                          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black
                          transition-all duration-300 flex items-center justify-center gap-3
                          overflow-hidden group
                          ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
                        `}
                      >
                        {/* Animated background */}
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />

                        <span className="relative flex items-center gap-3">
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                              Enviar Mensagem
                            </>
                          )}
                        </span>
                      </motion.button>

                      <p className="text-center text-white/50 text-sm">
                        Ao enviar, você receberá uma confirmação por email
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}