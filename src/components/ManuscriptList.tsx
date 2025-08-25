'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ManuscriptForm from './ManuscriptForm';

interface Author {
  id: string;
  name: string;
  email?: string;
  affiliation?: string;
}

interface ManuscriptVersion {
  id: string;
  versionNumber: number;
  createdAt: string;
}

interface Manuscript {
  id: string;
  title: string;
  abstract?: string;
  keywords: string[];
  status: 'DRAFT' | 'UNDER_REVIEW' | 'REVISED' | 'ACCEPTED' | 'REJECTED' | 'PUBLISHED';
  authors: Author[];
  versions: ManuscriptVersion[];
  pubmedUrl?: string;
  f1000Url?: string;
  createdAt: string;
}

export default function ManuscriptList() {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingManuscript, setEditingManuscript] = useState<Manuscript | null>(null);

  useEffect(() => {
    fetchManuscripts();
  }, []);

  const fetchManuscripts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/manuscripts');
      if (!response.ok) {
        throw new Error('Failed to fetch manuscripts');
      }
      const data = await response.json();
      setManuscripts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddManuscript = async (data: any) => {
    try {
      // First create authors if they don't exist
      const authorIds = [];
      for (const authorName of data.authorNames) {
        if (authorName.trim()) {
          try {
            const response = await fetch('/api/authors', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: authorName.trim() }),
            });
            if (response.ok) {
              const author = await response.json();
              authorIds.push(author.id);
            }
          } catch (error) {
            console.error('Error creating author:', error);
          }
        }
      }

      // Create the manuscript
      const response = await fetch('/api/manuscripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          abstract: data.abstract,
          keywords: data.keywords,
          authorIds,
          pubmedUrl: data.pubmedUrl,
          f1000Url: data.f1000Url,
        }),
      });

      if (response.ok) {
        setShowAddForm(false);
        fetchManuscripts(); // Refresh the list
      } else {
        throw new Error('Failed to create manuscript');
      }
    } catch (error) {
      console.error('Error creating manuscript:', error);
      alert('Error creating manuscript. Please try again.');
    }
  };

  const handleEditManuscript = async (data: any) => {
    if (!editingManuscript) return;

    try {
      const response = await fetch(`/api/manuscripts/${editingManuscript.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          abstract: data.abstract,
          keywords: data.keywords,
          pubmedUrl: data.pubmedUrl,
          f1000Url: data.f1000Url,
        }),
      });

      if (response.ok) {
        setEditingManuscript(null);
        fetchManuscripts(); // Refresh the list
      } else {
        throw new Error('Failed to update manuscript');
      }
    } catch (error) {
      console.error('Error updating manuscript:', error);
      alert('Error updating manuscript. Please try again.');
    }
  };

  const handleDeleteManuscript = async (manuscriptId: string) => {
    if (!confirm('Are you sure you want to delete this manuscript? This will also delete all versions and reviews.')) {
      return;
    }

    try {
      const response = await fetch(`/api/manuscripts/${manuscriptId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchManuscripts(); // Refresh the list
      } else {
        throw new Error('Failed to delete manuscript');
      }
    } catch (error) {
      console.error('Error deleting manuscript:', error);
      alert('Error deleting manuscript. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'ACCEPTED':
        return 'bg-blue-100 text-blue-800';
      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      case 'REVISED':
        return 'bg-purple-100 text-purple-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 bg-gray-50 rounded-t-lg">
            <h1 className="text-2xl font-semibold text-gray-900">Manuscripts</h1>
          </div>
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading manuscripts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 bg-gray-50 rounded-t-lg">
            <h1 className="text-2xl font-semibold text-gray-900">Manuscripts</h1>
          </div>
          <div className="p-8 text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-red-600 font-medium">Error loading manuscripts</p>
            <p className="text-gray-600 mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 bg-gray-50 rounded-t-lg border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Manuscripts</h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {manuscripts.length} manuscript{manuscripts.length !== 1 ? 's' : ''}
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>Add Manuscript</span>
              </button>
            </div>
          </div>
        </div>

        {manuscripts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-600">No manuscripts found</p>
            <p className="text-sm text-gray-500 mt-2">Try running the database seed to create sample data</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {manuscripts.map((manuscript) => (
              <div key={manuscript.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <Link 
                    href={`/manuscripts/${manuscript.id}`}
                    className="text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {manuscript.title}
                  </Link>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(manuscript.status)}`}>
                      {manuscript.status.replace('_', ' ')}
                    </span>
                    {manuscript.versions.length > 0 && (
                      <span className="text-xs text-gray-500">
                        {manuscript.versions.length} version{manuscript.versions.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Authors:</span>{' '}
                    {manuscript.authors.length > 0 
                      ? manuscript.authors.map(author => author.name).join(', ')
                      : 'No authors listed'
                    }
                  </p>
                </div>

                {manuscript.abstract && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 line-clamp-3">
                      <span className="font-medium">Abstract:</span> {manuscript.abstract}
                    </p>
                  </div>
                )}

                {manuscript.keywords.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {manuscript.keywords.map((keyword, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div className="flex space-x-4">
                    <span>Created: {formatDate(manuscript.createdAt)}</span>
                    {manuscript.versions.length > 0 && (
                      <span>
                        Latest version: {formatDate(manuscript.versions[manuscript.versions.length - 1].createdAt)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingManuscript(manuscript)}
                      className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteManuscript(manuscript.id)}
                      className="text-red-600 hover:text-red-800 text-xs"
                    >
                      Delete
                    </button>
                    {manuscript.pubmedUrl && (
                      <a 
                        href={manuscript.pubmedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        PubMed
                      </a>
                    )}
                    {manuscript.f1000Url && (
                      <a 
                        href={manuscript.f1000Url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        F1000Research
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Manuscript Form */}
      {(showAddForm || editingManuscript) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <ManuscriptForm
              onSubmit={editingManuscript ? handleEditManuscript : handleAddManuscript}
              onCancel={() => {
                setShowAddForm(false);
                setEditingManuscript(null);
              }}
              initialData={editingManuscript ? {
                title: editingManuscript.title,
                abstract: editingManuscript.abstract || '',
                keywords: editingManuscript.keywords,
                authorNames: editingManuscript.authors.map(a => a.name),
                pubmedUrl: editingManuscript.pubmedUrl || '',
                f1000Url: editingManuscript.f1000Url || '',
              } : undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
}
