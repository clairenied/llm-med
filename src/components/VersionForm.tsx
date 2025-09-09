'use client';

import { useState } from 'react';

interface ManuscriptVersion {
  id: string;
  versionNumber: number;
  documentUrl?: string;
  documentType: 'WORD' | 'PDF' | 'TEXT' | 'FREE_TEXT';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface VersionFormProps {
  version?: ManuscriptVersion;
  manuscriptId: string;
  onSubmit: (data: VersionFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface VersionFormData {
  versionNumber: number;
  documentUrl?: string;
  documentType: 'WORD' | 'PDF' | 'TEXT' | 'FREE_TEXT';
  notes?: string;
}

const documentTypes = [
  { value: 'PDF', label: 'PDF Document' },
  { value: 'WORD', label: 'Word Document' },
  { value: 'TEXT', label: 'Text File' },
  { value: 'FREE_TEXT', label: 'Free Text' },
] as const;

export default function VersionForm({ version, onSubmit, onCancel, isLoading }: VersionFormProps) {
  const [formData, setFormData] = useState<VersionFormData>({
    versionNumber: version?.versionNumber || 1,
    documentUrl: version?.documentUrl || '',
    documentType: version?.documentType || 'PDF',
    notes: version?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.versionNumber || formData.versionNumber < 1) {
      newErrors.versionNumber = 'Version number must be at least 1';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      await onSubmit(formData);
    }
  };

  const handleChange = (field: keyof VersionFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {version ? 'Edit Version' : 'Create New Version'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Version Number */}
          <div>
            <label htmlFor="versionNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Version Number *
            </label>
            <input
              type="number"
              id="versionNumber"
              min="1"
              value={formData.versionNumber}
              onChange={(e) => handleChange('versionNumber', parseInt(e.target.value) || 1)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.versionNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={!!version} // Don't allow editing version number for existing versions
            />
            {errors.versionNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.versionNumber}</p>
            )}
          </div>

          {/* Document Type */}
          <div>
            <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
              Document Type *
            </label>
            <select
              id="documentType"
              value={formData.documentType}
              onChange={(e) => handleChange('documentType', e.target.value as VersionFormData['documentType'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {documentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Document URL */}
          <div>
            <label htmlFor="documentUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Document URL
            </label>
            <input
              type="url"
              id="documentUrl"
              value={formData.documentUrl}
              onChange={(e) => handleChange('documentUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/document.pdf"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Version notes or changes..."
            />
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
            {isLoading ? 'Saving...' : version ? 'Update Version' : 'Create Version'}
          </button>
        </div>
      </div>
    </div>
  );
}
