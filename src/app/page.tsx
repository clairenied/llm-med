import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ManuscriptList from '@/components/ManuscriptList';

export default async function Home() {
  const session = await auth();
  
  if (!session) {
    redirect('/auth/signin');
  }

  return <ManuscriptList />;
}
