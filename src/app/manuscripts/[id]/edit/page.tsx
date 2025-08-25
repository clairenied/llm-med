'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ManuscriptForm from '@/components/ManuscriptForm';

interface Author {
  id: string;
  name: string;
  email?: string;
  affiliation?: string;
}

interface Manuscript {
  id: string;
  title: string;
  abstract?: string;
  keywords: string[];
  status: 'DRAFT' | 'UNDER_REVIEW' | 'REVISED' | 'ACCEPTED' | 'REJECTED' | 'PUBLISHED';
  authors: Author[];
  createdAt: string;
}

interface ManuscriptFormData {
  title: string;
  abstract: string;
  keywords: string[];
  authorNames: string[];
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditManuscriptPage({ params }: PageProps) {
  const router = useRouter();
  const [manuscript, setManuscript] = useState<Manuscript | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchManuscript() {
      try {
        const { id } = await params;
        const response = await fetch(`/api/manuscripts/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch manuscript');
        }
        const manuscriptData = await response.json();
        setManuscript(manuscriptData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchManuscript();
  }, [params]);

  const handleSubmit = async (data: ManuscriptFormData) => {
    if (!manuscript) return;

    try {
      const response = await fetch(`/api/manuscripts/${manuscript.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          abstract: data.abstract,
          keywords: data.keywords,
        }),
      });

      if (response.ok) {
        router.push(`/manuscripts/${manuscript.id}`);
      } else {
        console.error('Failed to update manuscript');
      }
    } catch (error) {
      console.error('Error updating manuscript:', error);
    }
  };

  const handleCancel = () => {
    if (manuscript) {
      router.push(`/manuscripts/${manuscript.id}`);
    } else {
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !manuscript) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error || 'Manuscript not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Manuscripts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ManuscriptForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={{
          title: manuscript.title,
          abstract: manuscript.abstract || '',
          keywords: manuscript.keywords,
          authorNames: manuscript.authors.map(a => a.name),
        }}
      />
    </div>
  );
}
