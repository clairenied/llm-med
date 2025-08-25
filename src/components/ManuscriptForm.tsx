'use client';

import { useState } from 'react';

interface ManuscriptFormProps {
  onSubmit: (data: ManuscriptFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ManuscriptFormData>;
}

interface ManuscriptFormData {
  title: string;
  abstract: string;
  keywords: string[];
  pubmedUrl?: string;
  f1000Url?: string;
  authorNames: string[];
}

export default function ManuscriptForm({ onSubmit, onCancel, initialData }: ManuscriptFormProps) {
  const [formData, setFormData] = useState<ManuscriptFormData>({
    title: initialData?.title || '',
    abstract: initialData?.abstract || '',
    keywords: initialData?.keywords || [],
    pubmedUrl: initialData?.pubmedUrl || '',
    f1000Url: initialData?.f1000Url || '',
    authorNames: initialData?.authorNames || [''],
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 bg-gray-50 rounded-t-lg border-b">
          <h1 className="text-2xl font-semibold text-gray-900">
            {initialData ? 'Edit Manuscript' : 'Add New Manuscript'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter manuscript title"
            />
          </div>

          {/* Authors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Author ${index + 1} name`}
                  />
                  {formData.authorNames.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAuthor(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addAuthor}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Author
              </button>
            </div>
          </div>

          {/* Abstract */}
          <div>
            <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 mb-2">
              Abstract
            </label>
            <textarea
              id="abstract"
              rows={6}
              value={formData.abstract}
              onChange={(e) => setFormData(prev => ({ ...prev, abstract: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter manuscript abstract"
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keywords
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm flex items-center space-x-1"
                >
                  <span>{keyword}</span>
                  <button
                    type="button"
                    onClick={() => removeKeyword(index)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* External Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pubmedUrl" className="block text-sm font-medium text-gray-700 mb-2">
                PubMed URL
              </label>
              <input
                type="url"
                id="pubmedUrl"
                value={formData.pubmedUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, pubmedUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://pubmed.ncbi.nlm.nih.gov/..."
              />
            </div>
            <div>
              <label htmlFor="f1000Url" className="block text-sm font-medium text-gray-700 mb-2">
                F1000Research URL
              </label>
              <input
                type="url"
                id="f1000Url"
                value={formData.f1000Url}
                onChange={(e) => setFormData(prev => ({ ...prev, f1000Url: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://f1000research.com/articles/..."
              />
            </div>
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
              {initialData ? 'Update Manuscript' : 'Create Manuscript'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
