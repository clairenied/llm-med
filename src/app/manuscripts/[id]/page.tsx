import ManuscriptRecord from '@/components/ManuscriptRecord';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ManuscriptPage({ params }: PageProps) {
  return <ManuscriptRecord manuscriptId={params.id} />;
}
