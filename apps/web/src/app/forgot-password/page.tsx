'use client';

import ForgotPasswordForm from '@/components/auth/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <div className="relative">
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-900 via-purple-900 to-black" />
      <div className="fixed inset-0 -z-10 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <ForgotPasswordForm />
    </div>
  );
}
