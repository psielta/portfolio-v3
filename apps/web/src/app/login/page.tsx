'use client';

import SignInForm from '@/components/auth/sign-in-form';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (session) {
    return null;
  }

  return (
    <div className="relative">
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-900 via-purple-900 to-black" />
      <div className="fixed inset-0 -z-10 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <SignInForm
        onSwitchToSignUp={() => {
          window.location.href = '/signup';
        }}
      />

      {/* Footer Link */}
      <div className="text-center pb-8">
        <Link
          href="/"
          className="text-white/60 hover:text-white/90 text-sm transition-colors"
        >
          ← Voltar para o início
        </Link>
      </div>
    </div>
  );
}
