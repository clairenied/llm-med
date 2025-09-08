'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import ManuscriptForm from '@/components/ManuscriptForm';

interface ManuscriptFormData {
  title: string;
  abstract: string;
  keywords: string[];
  authorNames: string[];
}

export default function NewManuscriptPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  const handleSubmit = async (data: ManuscriptFormData) => {
    try {
      // Create authors first
      const authorIds = [];
      for (const authorName of data.authorNames.filter(name => name.trim())) {
        const authorResponse = await fetch('/api/authors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: authorName.trim() }),
        });
        
        if (authorResponse.ok) {
          const author = await authorResponse.json();
          authorIds.push(author.id);
        }
      }

      // Create manuscript
      const response = await fetch('/api/manuscripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          abstract: data.abstract,
          keywords: data.keywords,
          authorIds,
        }),
      });

      if (response.ok) {
        const manuscript = await response.json();
        router.push(`/manuscripts/${manuscript.id}`);
      } else {
        console.error('Failed to create manuscript');
      }
    } catch (error) {
      console.error('Error creating manuscript:', error);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ManuscriptForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
