'use client';

import { motion } from 'framer-motion';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Verify email with token
      authClient.verifyEmail({
        query: {
          token,
        },
      })
        .then(() => {
          setStatus('success');
          setMessage('Email verificado com sucesso! Você já pode fazer login.');
        })
        .catch((error) => {
          console.error('Erro na verificação:', error);
          setStatus('error');
          setMessage('Link de verificação inválido ou expirado.');
        });
    } else {
      // No token, just show info page
      setStatus('success');
      setMessage('Verifique seu email para continuar.');
    }
  }, [searchParams]);

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4">
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-900 via-purple-900 to-black" />
      <div className="fixed inset-0 -z-10 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

          <div className="relative text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 mb-6"
            >
              {status === 'loading' && (
                <Mail className="w-10 h-10 text-white animate-pulse" />
              )}
              {status === 'success' && (
                <CheckCircle2 className="w-10 h-10 text-white" />
              )}
              {status === 'error' && (
                <AlertCircle className="w-10 h-10 text-white" />
              )}
            </motion.div>

            <h1 className="text-2xl font-bold text-white mb-4">
              {status === 'loading' && 'Verificando...'}
              {status === 'success' && 'Email Verificado!'}
              {status === 'error' && 'Erro na Verificação'}
            </h1>

            <p className="text-white/70 mb-8">{message}</p>

            {status !== 'loading' && (
              <Link
                href={status === 'success' ? '/login' : '/signup'}
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 hover:from-blue-600 hover:via-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300"
              >
                {status === 'success' ? 'Fazer Login' : 'Tentar Novamente'}
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
