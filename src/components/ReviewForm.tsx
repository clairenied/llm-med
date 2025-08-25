'use client';

import { useState, useEffect } from 'react';

interface Reviewer {
  id: string;
  name: string;
  code: string;
  email?: string;
  affiliation?: string;
}

interface ReviewFormProps {
  versionId: string;
  onSubmit: (data: ReviewFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ReviewFormData>;
}

interface ReviewFormData {
  reviewerId: string;
  reviewType: 'INTERNAL' | 'EXTERNAL';
  content: string;
  documentUrl?: string;
  documentType?: 'WORD' | 'PDF' | 'TEXT' | 'FREE_TEXT';
  isSharedExternally: boolean;
}

export default function ReviewForm({ versionId, onSubmit, onCancel, initialData }: ReviewFormProps) {
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ReviewFormData>({
    reviewerId: initialData?.reviewerId || '',
    reviewType: initialData?.reviewType || 'INTERNAL',
    content: initialData?.content || '',
    documentUrl: initialData?.documentUrl || '',
    documentType: initialData?.documentType || 'FREE_TEXT',
    isSharedExternally: initialData?.isSharedExternally || false,
  });

  useEffect(() => {
    async function fetchReviewers() {
      try {
        const response = await fetch('/api/reviewers');
        if (response.ok) {
          const data = await response.json();
          setReviewers(data);
        }
      } catch (error) {
        console.error('Error fetching reviewers:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviewers();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reviewers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 bg-gray-50 rounded-t-lg border-b">
          <h1 className="text-2xl font-semibold text-gray-900">
            {initialData ? 'Edit Review' : 'Add New Review'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Reviewer Selection */}
          <div>
            <label htmlFor="reviewerId" className="block text-sm font-medium text-gray-700 mb-2">
              Reviewer *
            </label>
            <select
              id="reviewerId"
              required
              value={formData.reviewerId}
              onChange={(e) => setFormData(prev => ({ ...prev, reviewerId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a reviewer</option>
              {reviewers.map((reviewer) => (
                <option key={reviewer.id} value={reviewer.id}>
                  {reviewer.name} (Reviewer {reviewer.code})
                  {reviewer.affiliation && ` - ${reviewer.affiliation}`}
                </option>
              ))}
            </select>
          </div>

          {/* Review Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review Type *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="INTERNAL"
                  checked={formData.reviewType === 'INTERNAL'}
                  onChange={(e) => setFormData(prev => ({ ...prev, reviewType: e.target.value as 'INTERNAL' | 'EXTERNAL' }))}
                  className="mr-2"
                />
                <span className="text-sm">Internal (Reviewer to Author)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="EXTERNAL"
                  checked={formData.reviewType === 'EXTERNAL'}
                  onChange={(e) => setFormData(prev => ({ ...prev, reviewType: e.target.value as 'INTERNAL' | 'EXTERNAL' }))}
                  className="mr-2"
                />
                <span className="text-sm">External (Reviewer to Editor)</span>
              </label>
            </div>
          </div>

          {/* Review Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Review Content *
            </label>
            <textarea
              id="content"
              required
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter the review content here..."
            />
          </div>

          {/* Document Type */}
          <div>
            <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-2">
              Document Type
            </label>
            <select
              id="documentType"
              value={formData.documentType}
              onChange={(e) => setFormData(prev => ({ ...prev, documentType: e.target.value as 'WORD' | 'PDF' | 'TEXT' | 'FREE_TEXT' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="FREE_TEXT">Free Text</option>
              <option value="WORD">Word Document</option>
              <option value="PDF">PDF Document</option>
              <option value="TEXT">Text File</option>
            </select>
          </div>

          {/* Document URL */}
          {formData.documentType !== 'FREE_TEXT' && (
            <div>
              <label htmlFor="documentUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Document URL
              </label>
              <input
                type="url"
                id="documentUrl"
                value={formData.documentUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, documentUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/document.pdf"
              />
            </div>
          )}

          {/* Sharing Options */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isSharedExternally}
                onChange={(e) => setFormData(prev => ({ ...prev, isSharedExternally: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Share this review externally (visible to authors and public)
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              If unchecked, this review will only be visible internally
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {initialData ? 'Update Review' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
