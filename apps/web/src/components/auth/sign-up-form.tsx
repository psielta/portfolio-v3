'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  User,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  UserPlus
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authClient } from '@/lib/auth-client';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// Schema de validação com Yup
const signUpSchema = Yup.object({
  name: Yup.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome muito longo')
    .required('Nome é obrigatório'),
  email: Yup.string()
    .email('Email inválido')
    .max(100, 'Email muito longo')
    .required('Email é obrigatório'),
  password: Yup.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(100, 'Senha muito longa')
    .matches(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .matches(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .matches(/[0-9]/, 'Senha deve conter pelo menos um número')
    .required('Senha é obrigatória'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'As senhas não coincidem')
    .required('Confirmação de senha é obrigatória'),
});

interface SignUpFormProps {
  onSwitchToSignIn?: () => void;
}

export default function SignUpForm({ onSwitchToSignIn }: SignUpFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      await authClient.signUp.email(
        {
          email: values.email,
          password: values.password,
          name: values.name,
        },
        {
          onSuccess: () => {
            setIsSuccess(true);
            toast.success('Conta criada com sucesso! Bem-vindo!');

            // Redirect after 2 seconds
            setTimeout(() => {
              router.push('/');
              router.refresh();
            }, 2000);
          },
          onError: (ctx) => {
            console.error('Erro ao criar conta:', ctx.error);
            toast.error(ctx.error.message || 'Erro ao criar conta. Tente novamente.');
            setSubmitting(false);
          },
        }
      );
    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast.error('Erro inesperado. Tente novamente.');
      setSubmitting(false);
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
              <div className="inline-block p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full mb-4">
                <UserPlus className="w-8 h-8 text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Criar Conta
              </h1>
              <p className="text-white/70">
                Junte-se a nós e comece sua jornada
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="py-12 text-center"
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
                    Conta criada com sucesso!
                  </h3>
                  <p className="text-white/70">
                    Redirecionando para a página inicial...
                  </p>
                </motion.div>
              ) : (
                <Formik
                  initialValues={{
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                  }}
                  validationSchema={signUpSchema}
                  onSubmit={handleSubmit}
                  validateOnChange={true}
                  validateOnBlur={true}
                >
                  {({ isSubmitting, errors, touched }) => (
                    <Form className="space-y-5">
                      {/* Name Field */}
                      <div>
                        <Label htmlFor="name" className="text-white">
                          Nome completo
                        </Label>
                        <div className="relative mt-2">
                          <Field
                            name="name"
                            type="text"
                            className={`
                              w-full px-4 py-3 pl-12 bg-white/10 border rounded-xl
                              text-white placeholder-white/40
                              backdrop-blur-sm
                              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                              transition-all duration-300
                              ${errors.name && touched.name
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-white/20 hover:border-white/30'
                              }
                            `}
                            placeholder="Digite seu nome"
                          />
                          <User className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                        </div>
                        <ErrorMessage name="name">
                          {(msg) => (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-red-400 text-sm mt-1 flex items-center gap-1"
                            >
                              <AlertCircle className="w-4 h-4" />
                              {msg}
                            </motion.p>
                          )}
                        </ErrorMessage>
                      </div>

                      {/* Email Field */}
                      <div>
                        <Label htmlFor="email" className="text-white">
                          Email
                        </Label>
                        <div className="relative mt-2">
                          <Field
                            name="email"
                            type="email"
                            className={`
                              w-full px-4 py-3 pl-12 bg-white/10 border rounded-xl
                              text-white placeholder-white/40
                              backdrop-blur-sm
                              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                              transition-all duration-300
                              ${errors.email && touched.email
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-white/20 hover:border-white/30'
                              }
                            `}
                            placeholder="seu@email.com"
                          />
                          <Mail className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                        </div>
                        <ErrorMessage name="email">
                          {(msg) => (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-red-400 text-sm mt-1 flex items-center gap-1"
                            >
                              <AlertCircle className="w-4 h-4" />
                              {msg}
                            </motion.p>
                          )}
                        </ErrorMessage>
                      </div>

                      {/* Password Field */}
                      <div>
                        <Label htmlFor="password" className="text-white">
                          Senha
                        </Label>
                        <div className="relative mt-2">
                          <Field
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            className={`
                              w-full px-4 py-3 pl-12 pr-12 bg-white/10 border rounded-xl
                              text-white placeholder-white/40
                              backdrop-blur-sm
                              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                              transition-all duration-300
                              ${errors.password && touched.password
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-white/20 hover:border-white/30'
                              }
                            `}
                            placeholder="Mínimo 8 caracteres"
                          />
                          <Lock className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        <ErrorMessage name="password">
                          {(msg) => (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-red-400 text-sm mt-1 flex items-center gap-1"
                            >
                              <AlertCircle className="w-4 h-4" />
                              {msg}
                            </motion.p>
                          )}
                        </ErrorMessage>
                      </div>

                      {/* Confirm Password Field */}
                      <div>
                        <Label htmlFor="confirmPassword" className="text-white">
                          Confirmar Senha
                        </Label>
                        <div className="relative mt-2">
                          <Field
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            className={`
                              w-full px-4 py-3 pl-12 pr-12 bg-white/10 border rounded-xl
                              text-white placeholder-white/40
                              backdrop-blur-sm
                              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                              transition-all duration-300
                              ${errors.confirmPassword && touched.confirmPassword
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-white/20 hover:border-white/30'
                              }
                            `}
                            placeholder="Digite a senha novamente"
                          />
                          <Lock className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        <ErrorMessage name="confirmPassword">
                          {(msg) => (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-red-400 text-sm mt-1 flex items-center gap-1"
                            >
                              <AlertCircle className="w-4 h-4" />
                              {msg}
                            </motion.p>
                          )}
                        </ErrorMessage>
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
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Criando conta...
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-5 h-5" />
                            Criar Conta
                          </>
                        )}
                      </motion.button>

                      {/* Switch to Sign In */}
                      {onSwitchToSignIn && (
                        <div className="text-center text-white/70 text-sm">
                          Já tem uma conta?{' '}
                          <button
                            type="button"
                            onClick={onSwitchToSignIn}
                            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                          >
                            Fazer login
                          </button>
                        </div>
                      )}
                    </Form>
                  )}
                </Formik>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
