'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Camera,
  Shield
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { authClient } from '@/lib/auth-client';
import type { Session } from '@portfolio/auth';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const profileSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome muito longo'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileContentProps {
  session: Session;
}

export default function ProfileContent({ session }: ProfileContentProps) {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'all',
    defaultValues: {
      name: session.user?.name || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await authClient.updateUser({
        name: data.name,
      });

      setIsSuccess(true);
      toast.success('Perfil atualizado com sucesso!');

      setTimeout(() => {
        setIsSuccess(false);
        router.refresh();
      }, 2000);
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error(error?.message || 'Erro ao atualizar perfil');
    }
  };

  const avatarLetter = session.user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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
              <User className="w-12 h-12 text-blue-400" />
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Meu Perfil
          </h1>
          <p className="text-white/70 text-lg">
            Gerencie suas informações pessoais
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Avatar & Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />

              <div className="relative text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 flex items-center justify-center text-white text-5xl font-bold">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      avatarLetter
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                  {session.user?.name}
                </h2>
                <p className="text-white/60">{session.user?.email}</p>
              </div>
            </div>

            {/* Account Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Informações da Conta
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-white/50">Membro desde</p>
                  <p className="text-white">
                    {new Date(session.user?.createdAt || Date.now()).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-white/50">Última atualização</p>
                  <p className="text-white">
                    {new Date(session.user?.updatedAt || Date.now()).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Edit Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

              <div className="relative">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Editar Perfil
                </h2>

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
                        Perfil Atualizado!
                      </h3>
                      <p className="text-white/70">
                        Suas alterações foram salvas com sucesso.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      {/* Name Field */}
                      <div>
                        <Label htmlFor="name" className="text-white">
                          Nome completo
                        </Label>
                        <div className="relative mt-2">
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
                            placeholder="Seu nome completo"
                          />
                          <User className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                        </div>
                        <AnimatePresence>
                          {errors.name && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-red-400 text-sm mt-1 flex items-center gap-1"
                            >
                              <AlertCircle className="w-4 h-4" />
                              {errors.name.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Email Field (Read Only) */}
                      <div>
                        <Label htmlFor="email" className="text-white">
                          Email
                        </Label>
                        <div className="relative mt-2">
                          <input
                            type="email"
                            value={session.user?.email || ''}
                            disabled
                            className="w-full px-4 py-3 pl-12 bg-white/5 border border-white/10 rounded-xl text-white/50 cursor-not-allowed"
                          />
                          <Mail className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                        </div>
                        <p className="text-white/50 text-xs mt-1">
                          O email não pode ser alterado
                        </p>
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={isSubmitting || !isDirty}
                        whileHover={!isSubmitting && isDirty ? { scale: 1.02 } : {}}
                        whileTap={!isSubmitting && isDirty ? { scale: 0.98 } : {}}
                        className={`
                          w-full py-4 px-6 rounded-xl font-semibold text-white
                          bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600
                          hover:from-blue-600 hover:via-purple-700 hover:to-pink-700
                          focus:outline-none focus:ring-2 focus:ring-purple-500
                          transition-all duration-300 flex items-center justify-center gap-3
                          ${isSubmitting || !isDirty ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            Salvar Alterações
                          </>
                        )}
                      </motion.button>
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
