import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@portfolio/auth';
import AdminChatContent from './chat-content';

export default async function AdminChatPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Protect route - only admin can access
  if (!session?.user) {
    redirect('/login');
  }

  if (!session.user.isAdmin) {
    redirect('/');
  }

  return <AdminChatContent session={session} />;
}
