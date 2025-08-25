'use client';

import { useRouter } from 'next/navigation';
import ManuscriptForm from '@/components/ManuscriptForm';

interface ManuscriptFormData {
  title: string;
  abstract: string;
  keywords: string[];
  authorNames: string[];
}

export default function NewManuscriptPage() {
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <ManuscriptForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
