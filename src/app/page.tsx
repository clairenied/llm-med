import { auth } from '@/lib/auth';
import ManuscriptList from '@/components/ManuscriptList';
import LandingPage from '@/components/LandingPage';

export default async function Home() {
  const session = await auth();
  
  if (!session) {
    return <LandingPage />;
  }

  return <ManuscriptList />;
}
