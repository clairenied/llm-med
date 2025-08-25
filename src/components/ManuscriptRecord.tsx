'use client';

import { useState, useEffect } from 'react';
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
  isSharedExternally: boolean;
  createdAt: string;
}

interface ManuscriptVersion {
  id: string;
  versionNumber: number;
  documentUrl?: string;
  documentType: 'WORD' | 'PDF' | 'TEXT' | 'FREE_TEXT';
  notes?: string;
  createdAt: string;
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



export default function ManuscriptRecord() {
  const [manuscript, setManuscript] = useState<Manuscript | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<ManuscriptVersion | null>(null);

  useEffect(() => {
    async function fetchManuscripts() {
      try {
        const response = await fetch('/api/manuscripts');
        if (!response.ok) {
          throw new Error('Failed to fetch manuscripts');
        }
        const manuscripts = await response.json();
        if (manuscripts.length > 0) {
          const firstManuscript = manuscripts[0];
          setManuscript(firstManuscript);
          setSelectedVersion(firstManuscript.versions[0] || null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchManuscripts();
  }, []);

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
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Record</h2>
        </div>
        <div className="p-8 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">Error loading manuscript data</p>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!manuscript) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Record</h2>
        </div>
        <div className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-gray-600">No manuscripts found</p>
          <p className="text-sm text-gray-500 mt-2">Try running the database seed to create sample data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="flex">
          {/* Left side - Version and Review tracking */}
          <div className="w-2/3 p-6">
            <VersionTracker 
              versions={manuscript.versions}
              selectedVersion={selectedVersion}
              onVersionSelect={setSelectedVersion}
            />
            
            {selectedVersion && (
              <div className="mt-6">
                <ReviewTracker 
                  version={selectedVersion}
                  reviews={selectedVersion.reviews}
                />
              </div>
            )}
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
