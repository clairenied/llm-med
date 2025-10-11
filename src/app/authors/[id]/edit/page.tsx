"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthorForm from "@/components/AuthorForm";

interface Author {
  id: string;
  name: string;
  email?: string;
  affiliation?: string;
  orcId?: string;
}

interface AuthorFormData {
  name: string;
  email: string;
  affiliation: string;
  orcId: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditAuthorPage({ params }: PageProps) {
  const router = useRouter();
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authorId, setAuthorId] = useState<string | null>(null);

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params;
      setAuthorId(resolvedParams.id);
    }
    loadParams();
  }, [params]);

  useEffect(() => {
    async function fetchAuthor() {
      if (!authorId) return;

      try {
        const response = await fetch(`/api/authors/${authorId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch author");
        }
        const authorData = await response.json();
        setAuthor(authorData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchAuthor();
  }, [authorId]);

  const handleSubmit = async (data: AuthorFormData) => {
    if (!author) return;

    try {
      const response = await fetch(`/api/authors/${author.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email || null,
          affiliation: data.affiliation || null,
          orcId: data.orcId || null,
        }),
      });

      if (response.ok) {
        router.push(`/authors/${author.id}`);
      } else {
        console.error("Failed to update author");
      }
    } catch (error) {
      console.error("Error updating author:", error);
    }
  };

  const handleCancel = () => {
    if (author) {
      router.push(`/authors/${author.id}`);
    } else {
      router.push("/authors");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error || "Author not found"}</p>
          <button
            onClick={() => router.push("/authors")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Authors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthorForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={{
          name: author.name,
          email: author.email || "",
          affiliation: author.affiliation || "",
          orcId: author.orcId || "",
        }}
      />
    </div>
  );
}
