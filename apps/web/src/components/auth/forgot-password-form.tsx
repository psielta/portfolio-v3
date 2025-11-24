'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Loader2,
  Key,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { authClient } from '@/lib/auth-client';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// Schema de validação
const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'all',
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      // TODO: Habilitar forget password no better-auth
      // await authClient.forgetPassword({
      //   email: data.email,
      //   redirectTo: '/reset-password',
      // });

      setIsSuccess(true);
      toast.success('Email de recuperação enviado! (Funcionalidade em desenvolvimento)');
    } catch (error: any) {
      console.error('Erro ao solicitar reset:', error);
      toast.error(error?.message || 'Erro ao enviar email. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

          <div className="relative">
            {/* Header */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-center mb-8"
            >
              <div className="inline-block p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full mb-4">
                <Key className="w-8 h-8 text-yellow-400" />
              </div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Esqueceu a Senha?
              </h1>
              <p className="text-white/70">
                Sem problemas! Vamos te ajudar a recuperar
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="py-8 text-center"
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
                    Email enviado!
                  </h3>
                  <p className="text-white/70 mb-6">
                    Enviamos um link de recuperação para <br />
                    <strong>{getValues('email')}</strong>
                  </p>
                  <p className="text-white/60 text-sm">
                    Verifique sua caixa de entrada e spam. O link expira em 1 hora.
                  </p>

                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 mt-6 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para o login
                  </Link>
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
                  <p className="text-white/70 text-sm mb-6">
                    Digite seu email e enviaremos um link para redefinir sua senha
                  </p>

                  {/* Email Field */}
                  <div>
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <div className="relative mt-2">
                      <input
                        {...register('email')}
                        type="email"
                        className={`
                          w-full px-4 py-3 pl-12 bg-white/10 border rounded-xl
                          text-white placeholder-white/40
                          backdrop-blur-sm
                          focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent
                          transition-all duration-300
                          ${errors.email
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-white/20 hover:border-white/30'
                          }
                        `}
                        placeholder="seu@email.com"
                      />
                      <Mail className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                    </div>
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-400 text-sm mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.email.message}
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
                      bg-gradient-to-r from-yellow-500 via-orange-600 to-red-600
                      hover:from-yellow-600 hover:via-orange-700 hover:to-red-700
                      focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-black
                      transition-all duration-300 flex items-center justify-center gap-3
                      overflow-hidden group
                      ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5" />
                        Enviar Link de Recuperação
                      </>
                    )}
                  </motion.button>

                  {/* Back to Login */}
                  <div className="text-center">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 text-white/70 hover:text-white/90 text-sm transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Voltar para o login
                    </Link>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
