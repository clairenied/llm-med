import ManuscriptRecord from '@/components/ManuscriptRecord';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ManuscriptPage({ params }: PageProps) {
  const session = await auth();
  
  if (!session) {
    redirect('/auth/signin');
  }

  const { id } = await params;
  return <ManuscriptRecord manuscriptId={id} />;
}
