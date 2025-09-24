'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Manuscript {
  id: string;
  title: string;
  abstract?: string;
  keywords: string[];
  status: 'DRAFT' | 'UNDER_REVIEW' | 'REVISED' | 'ACCEPTED' | 'REJECTED' | 'PUBLISHED';
  createdAt: string;
  authors: {
    id: string;
    name: string;
  }[];
  sources: {
    id: string;
    source: {
      name: string;
    };
    url: string;
  }[];
}

export default function DeleteArticlesPage() {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [selectedManuscripts, setSelectedManuscripts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'scraped'>('scraped');
  const { data: session, status } = useSession();
  const router = useRouter();

  const fetchManuscripts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/manuscripts?page=1&limit=1000`);
      if (!response.ok) {
        throw new Error('Failed to fetch manuscripts');
      }
      const data = await response.json();
      
      // Filter based on selection
      let filteredManuscripts = data.manuscripts;
      if (filter === 'scraped') {
        filteredManuscripts = data.manuscripts.filter((m: Manuscript) => 
          m.sources && m.sources.length > 0
        );
      }
      
      setManuscripts(filteredManuscripts);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch manuscripts');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    if (session.user.role !== 'ADMIN') {
      router.push('/auth/unauthorized');
      return;
    }
    fetchManuscripts();
  }, [session, status, router, filter, fetchManuscripts]);

  const handleSelectAll = () => {
    if (selectedManuscripts.size === manuscripts.length) {
      setSelectedManuscripts(new Set());
    } else {
      setSelectedManuscripts(new Set(manuscripts.map(m => m.id)));
    }
  };

  const handleSelectManuscript = (manuscriptId: string) => {
    const newSelected = new Set(selectedManuscripts);
    if (newSelected.has(manuscriptId)) {
      newSelected.delete(manuscriptId);
    } else {
      newSelected.add(manuscriptId);
    }
    setSelectedManuscripts(newSelected);
  };

  const deleteSelected = async () => {
    if (selectedManuscripts.size === 0) return;

    const confirmMessage = `Are you sure you want to delete ${selectedManuscripts.size} manuscript(s)? This action cannot be undone.`;
    if (!confirm(confirmMessage)) return;

    try {
      setDeleting(true);
      setError('');

      const response = await fetch('/api/admin/delete-manuscripts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          manuscriptIds: Array.from(selectedManuscripts)
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete manuscripts');
      }

      const result = await response.json();
      alert(`Successfully deleted ${result.deletedCount} manuscript(s)`);
      
      // Refresh the list
      setSelectedManuscripts(new Set());
      fetchManuscripts();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete manuscripts');
    } finally {
      setDeleting(false);
    }
  };

  const deleteAllScraped = async () => {
    const scrapedCount = manuscripts.filter(m => m.sources && m.sources.length > 0).length;
    
    if (scrapedCount === 0) {
      alert('No scraped articles found to delete.');
      return;
    }

    const confirmMessage = `This will permanently delete ALL ${scrapedCount} scraped articles. This cannot be undone. Are you sure?`;
    if (!confirm(confirmMessage)) return;

    try {
      setDeleting(true);
      setError('');

      const response = await fetch('/api/admin/delete-scraped', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete scraped articles');
      }

      const result = await response.json();
      alert(result.message || 'Scraped articles deleted successfully');
      
      // Refresh the list
      setSelectedManuscripts(new Set());
      fetchManuscripts();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete scraped articles');
    } finally {
      setDeleting(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 mb-2 inline-block cursor-pointer"
            >
              ← Back to Admin Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Delete Articles
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Select articles to delete or remove all scraped articles
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Filter and Actions */}
          <div className="mb-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Show:
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'scraped')}
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
                >
                  <option value="scraped">Scraped Articles Only</option>
                  <option value="all">All Articles</option>
                </select>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({manuscripts.length} articles)
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleSelectAll}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                >
                  {selectedManuscripts.size === manuscripts.length ? 'Deselect All' : 'Select All'}
                </button>
                
                {selectedManuscripts.size > 0 && (
                  <button
                    onClick={deleteSelected}
                    disabled={deleting}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {deleting ? 'Deleting...' : `Delete Selected (${selectedManuscripts.size})`}
                  </button>
                )}

                {filter === 'scraped' && (
                  <button
                    onClick={deleteAllScraped}
                    disabled={deleting || manuscripts.length === 0}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-700 hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {deleting ? 'Deleting...' : 'Delete All Scraped'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Articles List */}
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:p-6">
              {manuscripts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    {filter === 'scraped' ? 'No scraped articles found.' : 'No articles found.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {manuscripts.map((manuscript) => (
                    <div
                      key={manuscript.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedManuscripts.has(manuscript.id)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => handleSelectManuscript(manuscript.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedManuscripts.has(manuscript.id)}
                          onChange={() => handleSelectManuscript(manuscript.id)}
                          className="mt-1 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {manuscript.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                manuscript.status === 'PUBLISHED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                manuscript.status === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                              }`}>
                                {manuscript.status.replace('_', ' ')}
                              </span>
                              {manuscript.sources && manuscript.sources.length > 0 && (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  Scraped
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {manuscript.abstract && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {manuscript.abstract}
                            </p>
                          )}
                          
                          <div className="mt-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-4">
                              <span>
                                Authors: {manuscript.authors.map(a => a.name).join(', ') || 'None'}
                              </span>
                              {manuscript.sources && manuscript.sources.length > 0 && (
                                <span>
                                  Source: {manuscript.sources[0].source.name}
                                </span>
                              )}
                            </div>
                            <span>
                              {new Date(manuscript.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
