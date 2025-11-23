'use client';

import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  Loader2,
  LogIn,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authClient } from '@/lib/auth-client';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// Schema de validação com Yup
const signInSchema = Yup.object({
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  password: Yup.string()
    .required('Senha é obrigatória'),
});

interface SignInFormProps {
  onSwitchToSignUp?: () => void;
}

export default function SignInForm({ onSwitchToSignUp }: SignInFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
        },
        {
          onSuccess: () => {
            toast.success('Login realizado com sucesso!');
            router.push('/');
            router.refresh();
          },
          onError: (ctx) => {
            console.error('Erro no login:', ctx.error);
            toast.error(ctx.error.message || 'Email ou senha incorretos');
            setSubmitting(false);
          },
        }
      );
    } catch (error) {
      console.error('Erro no login:', error);
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
                <LogIn className="w-8 h-8 text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Bem-vindo de Volta
              </h1>
              <p className="text-white/70">
                Entre com suas credenciais
              </p>
            </motion.div>

            <Formik
              initialValues={{
                email: '',
                password: '',
              }}
              validationSchema={signInSchema}
              onSubmit={handleSubmit}
              validateOnChange={true}
              validateOnBlur={true}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-5">
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-white">
                        Senha
                      </Label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        Esqueceu a senha?
                      </Link>
                    </div>
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
                        placeholder="Digite sua senha"
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
                        Entrando...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        Entrar
                      </>
                    )}
                  </motion.button>

                  {/* Switch to Sign Up */}
                  {onSwitchToSignUp && (
                    <div className="text-center text-white/70 text-sm">
                      Não tem uma conta?{' '}
                      <button
                        type="button"
                        onClick={onSwitchToSignUp}
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                      >
                        Criar conta
                      </button>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
