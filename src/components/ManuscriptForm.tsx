'use client';

import { useState } from 'react';
import FileUpload from './FileUpload';

interface ManuscriptFormProps {
  onSubmit: (data: ManuscriptFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ManuscriptFormData>;
}

interface ManuscriptFormData {
  title: string;
  abstract: string;
  keywords: string[];
  authorNames: string[];
  documentFile?: File;
}

export default function ManuscriptForm({ onSubmit, onCancel, initialData }: ManuscriptFormProps) {
  const [formData, setFormData] = useState<ManuscriptFormData>({
    title: initialData?.title || '',
    abstract: initialData?.abstract || '',
    keywords: initialData?.keywords || [],
    authorNames: initialData?.authorNames || [''],
    documentFile: initialData?.documentFile,
  });

  const [keywordInput, setKeywordInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const addAuthor = () => {
    setFormData(prev => ({
      ...prev,
      authorNames: [...prev.authorNames, '']
    }));
  };

  const updateAuthor = (index: number, name: string) => {
    setFormData(prev => ({
      ...prev,
      authorNames: prev.authorNames.map((author, i) => i === index ? name : author)
    }));
  };

  const removeAuthor = (index: number) => {
    if (formData.authorNames.length > 1) {
      setFormData(prev => ({
        ...prev,
        authorNames: prev.authorNames.filter((_, i) => i !== index)
      }));
    }
  };

  const handleFileSelect = (file: File) => {
    setFormData(prev => ({ ...prev, documentFile: file }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-t-lg border-b dark:border-gray-600">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {initialData ? 'Edit Manuscript' : 'Add New Manuscript'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter manuscript title"
            />
          </div>

          {/* Authors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Authors *
            </label>
            <div className="space-y-2">
              {formData.authorNames.map((author, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => updateAuthor(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Author ${index + 1} name`}
                  />
                  {formData.authorNames.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAuthor(index)}
                      className="px-3 py-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addAuthor}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                + Add Author
              </button>
            </div>
          </div>

          {/* Abstract */}
          <div>
            <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Abstract
            </label>
            <textarea
              id="abstract"
              rows={6}
              value={formData.abstract}
              onChange={(e) => setFormData(prev => ({ ...prev, abstract: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter manuscript abstract"
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Keywords
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add keyword"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm flex items-center space-x-1"
                >
                  <span>{keyword}</span>
                  <button
                    type="button"
                    onClick={() => removeKeyword(index)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Document Upload
            </label>
            <FileUpload
              onFileSelect={handleFileSelect}
              acceptedTypes=".pdf,.doc,.docx,.txt"
              maxSize={25}
              label={formData.documentFile ? `Selected: ${formData.documentFile.name}` : "Upload Manuscript Document"}
            />
            {formData.documentFile && (
              <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700 dark:text-green-300">
                    📄 {formData.documentFile.name} ({(formData.documentFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, documentFile: undefined }))}
                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>



          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t dark:border-gray-600">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {initialData ? 'Update Manuscript' : 'Create Manuscript'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
