'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ArticleFormData {
  title: string;
  abstract?: string;
  keywords: string[];
  authors: string[];
  content?: string;
  url?: string;
  uploadType: 'text' | 'pdf' | 'url';
}

export default function UploadArticlePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    abstract: '',
    keywords: [],
    authors: [],
    content: '',
    url: '',
    uploadType: 'text',
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (formData.authors.length === 0) {
      newErrors.authors = 'At least one author is required';
    }
    
    if (formData.uploadType === 'text' && !formData.content?.trim()) {
      newErrors.content = 'Article content is required for text upload';
    }
    
    if (formData.uploadType === 'pdf' && !selectedFile) {
      newErrors.file = 'PDF file is required for PDF upload';
    }
    
    if (formData.uploadType === 'url' && !formData.url?.trim()) {
      newErrors.url = 'URL is required for URL upload';
    } else if (formData.uploadType === 'url' && formData.url?.trim()) {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = 'Please enter a valid URL';
      }
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      try {
        setIsLoading(true);
        
        // Create FormData for file upload
        const submitData = new FormData();
        submitData.append('title', formData.title);
        submitData.append('abstract', formData.abstract || '');
        submitData.append('keywords', JSON.stringify(formData.keywords));
        submitData.append('authors', JSON.stringify(formData.authors));
        submitData.append('uploadType', formData.uploadType);
        
        if (formData.uploadType === 'text' && formData.content) {
          submitData.append('content', formData.content);
        }
        
        if (formData.uploadType === 'pdf' && selectedFile) {
          submitData.append('file', selectedFile);
        }
        
        if (formData.uploadType === 'url' && formData.url) {
          submitData.append('url', formData.url);
        }
        
        const response = await fetch('/api/manuscripts/upload', {
          method: 'POST',
          body: submitData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to upload article');
        }

        const result = await response.json();
        
        // Redirect to the new manuscript
        router.push(`/manuscripts/${result.id}`);
      } catch (error) {
        console.error('Error uploading article:', error);
        setErrors({ submit: error instanceof Error ? error.message : 'Failed to upload article. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (field: keyof ArticleFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      handleChange('keywords', [...formData.keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    handleChange('keywords', formData.keywords.filter(k => k !== keyword));
  };

  const addAuthor = () => {
    if (authorInput.trim() && !formData.authors.includes(authorInput.trim())) {
      handleChange('authors', [...formData.authors, authorInput.trim()]);
      setAuthorInput('');
    }
  };

  const removeAuthor = (author: string) => {
    handleChange('authors', formData.authors.filter(a => a !== author));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        if (errors.file) {
          setErrors(prev => ({ ...prev, file: '' }));
        }
      } else {
        setErrors(prev => ({ ...prev, file: 'Please select a PDF file' }));
        setSelectedFile(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/manuscripts" className="hover:text-blue-600">Manuscripts</Link>
            <span>/</span>
            <span className="text-gray-900">Upload Article</span>
          </div>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload New Article</h1>
          <p className="mt-2 text-gray-600">Upload your own research article from plain text or PDF file.</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Upload Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload Method *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="text"
                    checked={formData.uploadType === 'text'}
                    onChange={(e) => handleChange('uploadType', e.target.value as 'text' | 'pdf' | 'url')}
                    className="mr-2"
                  />
                  <span className="text-sm">Plain Text</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="pdf"
                    checked={formData.uploadType === 'pdf'}
                    onChange={(e) => handleChange('uploadType', e.target.value as 'text' | 'pdf' | 'url')}
                    className="mr-2"
                  />
                  <span className="text-sm">PDF File</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="url"
                    checked={formData.uploadType === 'url'}
                    onChange={(e) => handleChange('uploadType', e.target.value as 'text' | 'pdf' | 'url')}
                    className="mr-2"
                  />
                  <span className="text-sm">From URL</span>
                </label>
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Article Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter the article title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Abstract */}
            <div>
              <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 mb-2">
                Abstract
              </label>
              <textarea
                id="abstract"
                rows={4}
                value={formData.abstract}
                onChange={(e) => handleChange('abstract', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the article abstract (optional)"
              />
            </div>

            {/* Authors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Authors *
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAuthor())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter author name"
                />
                <button
                  type="button"
                  onClick={addAuthor}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.authors.map((author, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {author}
                    <button
                      type="button"
                      onClick={() => removeAuthor(author)}
                      className="ml-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              {errors.authors && (
                <p className="text-red-500 text-sm mt-1">{errors.authors}</p>
              )}
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter keyword"
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="ml-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Content Input (Text) */}
            {formData.uploadType === 'text' && (
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Article Content *
                </label>
                <textarea
                  id="content"
                  rows={12}
                  value={formData.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.content ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Paste or type your article content here..."
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                )}
              </div>
            )}

            {/* File Upload (PDF) */}
            {formData.uploadType === 'pdf' && (
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                  PDF File *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="file"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-lg font-medium text-gray-700">
                      {selectedFile ? selectedFile.name : 'Choose PDF file'}
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                      Click to browse or drag and drop
                    </span>
                  </label>
                </div>
                {errors.file && (
                  <p className="text-red-500 text-sm mt-1">{errors.file}</p>
                )}
              </div>
            )}

            {/* URL Input */}
            {formData.uploadType === 'url' && (
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  Article URL *
                </label>
                <div className="relative">
                  <input
                    type="url"
                    id="url"
                    value={formData.url || ''}
                    onChange={(e) => handleChange('url', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                    placeholder="https://example.com/article-title"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Enter the URL of an article to automatically fetch and parse its content
                </p>
                {errors.url && (
                  <p className="text-red-500 text-sm mt-1">{errors.url}</p>
                )}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Link
                href="/manuscripts"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? 'Uploading...' : 'Upload Article'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
