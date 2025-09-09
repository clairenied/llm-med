'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ManuscriptInfo from './ManuscriptInfo';
import VersionTracker from './VersionTracker';
import ReviewTracker from './ReviewTracker';

interface Author {
  id: string;
  name: string;
  email?: string;
  affiliation?: string;
}

interface Reviewer {
  id: string;
  name: string;
  code: string;
  email?: string;
  affiliation?: string;
}

interface Review {
  id: string;
  reviewer: Reviewer;
  reviewType: 'INTERNAL' | 'EXTERNAL';
  content: string;
  documentUrl?: string;
  documentType?: 'WORD' | 'PDF' | 'TEXT' | 'FREE_TEXT';
  createdAt: string;
}

interface ManuscriptVersion {
  id: string;
  versionNumber: number;
  manuscriptId: string;
  documentUrl?: string;
  documentType: 'WORD' | 'PDF' | 'TEXT' | 'FREE_TEXT';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  reviews: Review[];
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



interface ManuscriptRecordProps {
  manuscriptId: string;
}

export default function ManuscriptRecord({ manuscriptId }: ManuscriptRecordProps) {
  const [manuscript, setManuscript] = useState<Manuscript | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<ManuscriptVersion | null>(null);

  const fetchManuscript = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/manuscripts/${manuscriptId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Manuscript not found');
        }
        throw new Error('Failed to fetch manuscript');
      }
      const manuscriptData = await response.json();
      setManuscript(manuscriptData);
      setSelectedVersion(manuscriptData.versions[0] || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [manuscriptId]);

  useEffect(() => {
    if (manuscriptId) {
      fetchManuscript();
    }
  }, [manuscriptId, fetchManuscript]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Record</h2>
        </div>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading manuscript data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-500 dark:text-blue-400 mb-4 inline-block cursor-pointer"
        >
          ← Back to Manuscripts
        </Link>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Manuscript Record</h2>
          </div>
          <div className="p-8 text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-red-600 font-medium">Error loading manuscript data</p>
            <p className="text-gray-600 mt-2">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer mt-4"
            >
              Return to Manuscripts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!manuscript) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-500 dark:text-blue-400 mb-4 inline-block cursor-pointer"
        >
          ← Back to Manuscripts
        </Link>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Manuscript Record</h2>
          </div>
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-600">Manuscript not found</p>
            <p className="text-sm text-gray-500 mt-2">The requested manuscript could not be found</p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer mt-4"
            >
              Return to Manuscripts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Link
        href="/"
        className="text-blue-600 hover:text-blue-500 dark:text-blue-400 mb-4 inline-block cursor-pointer"
      >
        ← Back to Manuscripts
      </Link>
      <div className="bg-white rounded-lg shadow-lg">
        <div className="flex">
          {/* Left side - Version and Review tracking */}
          <div className="w-2/3 p-6">
            <VersionTracker 
              versions={manuscript.versions}
              selectedVersion={selectedVersion}
              onVersionSelect={setSelectedVersion}
              manuscriptId={manuscriptId}
              onVersionAdd={fetchManuscript}
            />
            
            {selectedVersion ? (
              <div className="mt-6">
                <ReviewTracker 
                  version={selectedVersion}
                  reviews={selectedVersion.reviews}
                  onRefresh={fetchManuscript}
                />
              </div>
            ) : manuscript.versions.length === 0 ? (
              <div className="mt-6">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7m5 5v3" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Reviews Available</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Add a version first to start collecting peer reviews.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
          
          {/* Right side - Title and Authors */}
          <div className="w-1/3 p-6 bg-gray-50 rounded-br-lg rounded-tr-lg">
            <ManuscriptInfo manuscript={manuscript} />
          </div>
        </div>
      </div>
    </div>
  );
}
