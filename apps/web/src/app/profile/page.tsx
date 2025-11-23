import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@portfolio/auth';
import ProfileContent from './profile-content';

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  return <ProfileContent session={session} />;
}
