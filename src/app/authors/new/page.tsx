'use client';

import { useRouter } from 'next/navigation';
import AuthorForm from '@/components/AuthorForm';

interface AuthorFormData {
  name: string;
  email: string;
  affiliation: string;
  orcId: string;
}

export default function NewAuthorPage() {
  const router = useRouter();

  const handleSubmit = async (data: AuthorFormData) => {
    try {
      const response = await fetch('/api/authors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email || null,
          affiliation: data.affiliation || null,
          orcId: data.orcId || null,
        }),
      });

      if (response.ok) {
        const author = await response.json();
        router.push(`/authors/${author.id}`);
      } else {
        const errorData = await response.json();
        console.error('Failed to create author:', errorData);
        alert(errorData.error || 'Failed to create author');
      }
    } catch (error) {
      console.error('Error creating author:', error);
      alert('An error occurred while creating the author');
    }
  };

  const handleCancel = () => {
    router.push('/authors');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthorForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
