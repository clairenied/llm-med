import ManuscriptRecord from '@/components/ManuscriptRecord';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ManuscriptPage({ params }: PageProps) {
  await params; // Consume params to avoid unused variable warning
  return <ManuscriptRecord />;
}
