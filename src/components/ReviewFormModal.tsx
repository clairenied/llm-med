'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface Review {
  id: string;
  reviewer: {
    id: string;
    code: string;
    name: string;
  };
  reviewType: 'INTERNAL' | 'EXTERNAL';
  content: string;
  documentUrl?: string;
  documentType?: 'WORD' | 'PDF' | 'TEXT' | 'FREE_TEXT';
  isSharedExternally: boolean;
  createdAt: string;
}


interface ReviewFormProps {
  review?: Review;
  versionId: string;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface ReviewFormData {
  reviewType: 'INTERNAL' | 'EXTERNAL';
  content: string;
  documentUrl?: string;
  documentType?: 'WORD' | 'PDF' | 'TEXT' | 'FREE_TEXT';
  isSharedExternally: boolean;
}

const reviewTypes = [
  { value: 'INTERNAL', label: 'Internal Review' },
  { value: 'EXTERNAL', label: 'External Review' },
] as const;

const documentTypes = [
  { value: 'PDF', label: 'PDF Document' },
  { value: 'WORD', label: 'Word Document' },
  { value: 'TEXT', label: 'Text File' },
  { value: 'FREE_TEXT', label: 'Free Text' },
] as const;

export default function ReviewFormModal({ review, onSubmit, onCancel, isLoading }: ReviewFormProps) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<ReviewFormData>({
    reviewType: review?.reviewType || 'EXTERNAL',
    content: review?.content || '',
    documentUrl: review?.documentUrl || '',
    documentType: review?.documentType || 'PDF',
    isSharedExternally: review?.isSharedExternally || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!session?.user?.id) {
      newErrors.session = 'You must be logged in to create a review';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Review content is required';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // The parent component will handle adding the reviewerId
      await onSubmit(formData);
    }
  };

  const handleChange = (field: keyof ReviewFormData, value: string | boolean | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {review ? 'Edit Review' : 'Create New Review'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Current Reviewer Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reviewer
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-700">
              {session?.user?.name || session?.user?.email || 'Current User'}
            </div>
          </div>

          {errors.session && (
            <p className="text-red-500 text-sm">{errors.session}</p>
          )}

          {/* Review Type */}
          <div>
            <label htmlFor="reviewType" className="block text-sm font-medium text-gray-700 mb-1">
              Review Type *
            </label>
            <select
              id="reviewType"
              value={formData.reviewType}
              onChange={(e) => handleChange('reviewType', e.target.value as ReviewFormData['reviewType'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {reviewTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Review Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Review Content *
            </label>
            <textarea
              id="content"
              rows={6}
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your review comments..."
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
          </div>

          {/* Document URL */}
          <div>
            <label htmlFor="documentUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Review Document URL
            </label>
            <input
              type="url"
              id="documentUrl"
              value={formData.documentUrl}
              onChange={(e) => handleChange('documentUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/review-document.pdf"
            />
          </div>

          {/* Document Type */}
          {formData.documentUrl && (
            <div>
              <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
                Document Type
              </label>
              <select
                id="documentType"
                value={formData.documentType}
                onChange={(e) => handleChange('documentType', e.target.value as ReviewFormData['documentType'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Share Externally */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isSharedExternally"
              checked={formData.isSharedExternally}
              onChange={(e) => handleChange('isSharedExternally', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isSharedExternally" className="ml-2 block text-sm text-gray-700">
              Share this review externally (visible to authors and public)
            </label>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : review ? 'Update Review' : 'Create Review'}
          </button>
        </div>
      </div>
    </div>
  );
}
