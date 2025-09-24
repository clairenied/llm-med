'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';


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
  createdAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

interface ManuscriptResponse {
  manuscripts: Manuscript[];
  pagination: PaginationInfo;
}

export default function ManuscriptList() {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchManuscripts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchQuery && { search: searchQuery })
      });
      
      const response = await fetch(`/api/manuscripts?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch manuscripts');
      }
      const data: ManuscriptResponse = await response.json();
      setManuscripts(data.manuscripts);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchManuscripts();
  }, [fetchManuscripts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
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
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Manuscripts</h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {pagination ? `${pagination.totalCount} total manuscript${pagination.totalCount !== 1 ? 's' : ''}` : `${manuscripts.length} manuscript${manuscripts.length !== 1 ? 's' : ''}`}
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  href="/manuscripts/upload"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>Upload Article</span>
                </Link>
                <Link
                  href="/manuscripts/new"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>Add Manuscript</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search manuscripts, authors, keywords..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            {pagination && (
              <div className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
            )}
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
                    <span className={`px-2 py-1 text-sm font-medium rounded-full ${getStatusColor(manuscript.status)}`}>
                      {manuscript.status.replace('_', ' ')}
                    </span>
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
                          className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex space-x-4">
                    <span>Created: {formatDate(manuscript.createdAt)}</span>
                    {manuscript.versions.length > 0 && (
                      <span>
                        Latest version: {formatDate(manuscript.versions[manuscript.versions.length - 1].createdAt)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/manuscripts/${manuscript.id}/edit`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteManuscript(manuscript.id)}
                      className="text-red-600 hover:text-red-800 text-xs cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t rounded-b-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount} results
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    pagination.hasPrevPage
                      ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 cursor-pointer'
                      : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                  }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first page, last page, current page, and pages around current
                      return (
                        page === 1 ||
                        page === pagination.totalPages ||
                        Math.abs(page - pagination.currentPage) <= 1
                      );
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there's a gap
                      const showEllipsis = index > 0 && page - array[index - 1] > 1;
                      
                      return (
                        <div key={page} className="flex items-center">
                          {showEllipsis && (
                            <span className="px-2 py-2 text-sm text-gray-500">...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                              page === pagination.currentPage
                                ? 'text-blue-600 bg-blue-50 border border-blue-300'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        </div>
                      );
                    })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    pagination.hasNextPage
                      ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 cursor-pointer'
                      : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
