'use client';

import { useState } from 'react';

interface ImportedManuscript {
  title: string;
  abstract?: string;
  keywords: string[];
  authors: string[];
  pubmedUrl?: string;
  f1000Url?: string;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'REVISED' | 'ACCEPTED' | 'REJECTED' | 'PUBLISHED';
  selected: boolean;
}

export default function DataImport() {
  const [importData, setImportData] = useState('');
  const [parsedData, setParsedData] = useState<ImportedManuscript[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  const parseImportData = () => {
    try {
      // Try to parse as JSON first
      const data = JSON.parse(importData);
      const manuscripts: ImportedManuscript[] = Array.isArray(data) ? data : [data];
      
      // Validate and normalize the data
      const normalizedData = manuscripts.map((item, index) => ({
        title: item.title || `Imported Manuscript ${index + 1}`,
        abstract: item.abstract || '',
        keywords: Array.isArray(item.keywords) ? item.keywords : [],
        authors: Array.isArray(item.authors) ? item.authors : [],
        pubmedUrl: item.pubmedUrl || '',
        f1000Url: item.f1000Url || '',
        status: item.status || 'DRAFT' as const,
        selected: true,
      }));

      setParsedData(normalizedData);
    } catch (error) {
      // If JSON parsing fails, try to parse as CSV or plain text
      const lines = importData.split('\n').filter(line => line.trim());
      const manuscripts: ImportedManuscript[] = lines.map((line, index) => {
        const parts = line.split('\t'); // Tab-separated
        return {
          title: parts[0] || `Imported Manuscript ${index + 1}`,
          abstract: parts[1] || '',
          keywords: parts[2] ? parts[2].split(',').map(k => k.trim()) : [],
          authors: parts[3] ? parts[3].split(',').map(a => a.trim()) : [],
          pubmedUrl: parts[4] || '',
          f1000Url: parts[5] || '',
          status: (parts[6] as 'DRAFT' | 'UNDER_REVIEW' | 'REVISED' | 'ACCEPTED' | 'REJECTED' | 'PUBLISHED') || 'DRAFT' as const,
          selected: true,
        };
      });

      setParsedData(manuscripts);
    }
  };

  const toggleSelection = (index: number) => {
    setParsedData(prev => prev.map((item, i) => 
      i === index ? { ...item, selected: !item.selected } : item
    ));
  };

  const selectAll = () => {
    setParsedData(prev => prev.map(item => ({ ...item, selected: true })));
  };

  const selectNone = () => {
    setParsedData(prev => prev.map(item => ({ ...item, selected: false })));
  };

  const importSelected = async () => {
    setImporting(true);
    const selectedManuscripts = parsedData.filter(item => item.selected);
    
    try {
      for (const manuscript of selectedManuscripts) {
        // First create authors if they don't exist
        const authorIds = [];
        for (const authorName of manuscript.authors) {
          if (authorName.trim()) {
            try {
              const response = await fetch('/api/authors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: authorName.trim() }),
              });
              if (response.ok) {
                const author = await response.json();
                authorIds.push(author.id);
              }
            } catch (error) {
              console.error('Error creating author:', error);
            }
          }
        }

        // Create the manuscript
        await fetch('/api/manuscripts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: manuscript.title,
            abstract: manuscript.abstract,
            keywords: manuscript.keywords,
            authorIds,
            pubmedUrl: manuscript.pubmedUrl,
            f1000Url: manuscript.f1000Url,
          }),
        });
      }

      // Clear the form after successful import
      setImportData('');
      setParsedData([]);
      alert(`Successfully imported ${selectedManuscripts.length} manuscripts!`);
    } catch (error) {
      console.error('Error importing manuscripts:', error);
      alert('Error importing manuscripts. Please check the console for details.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 bg-gray-50 rounded-t-lg border-b">
          <h1 className="text-2xl font-semibold text-gray-900">Data Import</h1>
          <p className="text-sm text-gray-600 mt-2">
            Import manuscript data from scraped databases or manual entry. Review and select which items to import.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Import Data Input */}
          <div>
            <label htmlFor="importData" className="block text-sm font-medium text-gray-700 mb-2">
              Import Data
            </label>
            <textarea
              id="importData"
              rows={8}
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Paste your data here. Supports:

JSON format:
[{"title": "Paper Title", "abstract": "Abstract text", "keywords": ["keyword1", "keyword2"], "authors": ["Author 1", "Author 2"], "pubmedUrl": "https://...", "f1000Url": "https://..."}]

Tab-separated format:
Title	Abstract	Keywords	Authors	PubMed URL	F1000 URL	Status
Paper 1	Abstract 1	keyword1,keyword2	Author 1,Author 2	https://...	https://...	PUBLISHED`}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                Supports JSON or tab-separated values. Each manuscript should include title, abstract, keywords, and authors.
              </p>
              <button
                onClick={parseImportData}
                disabled={!importData.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Parse Data
              </button>
            </div>
          </div>

          {/* Parsed Data Preview */}
          {parsedData.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Parsed Data ({parsedData.length} manuscripts)
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={selectAll}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    Select All
                  </button>
                  <button
                    onClick={selectNone}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    Select None
                  </button>
                  <button
                    onClick={importSelected}
                    disabled={!parsedData.some(item => item.selected) || importing}
                    className="px-4 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {importing ? 'Importing...' : `Import Selected (${parsedData.filter(item => item.selected).length})`}
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {parsedData.map((manuscript, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 ${
                      manuscript.selected ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={manuscript.selected}
                        onChange={() => toggleSelection(index)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{manuscript.title}</h4>
                        
                        {manuscript.authors.length > 0 && (
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Authors:</span> {manuscript.authors.join(', ')}
                          </p>
                        )}
                        
                        {manuscript.abstract && (
                          <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                            <span className="font-medium">Abstract:</span> {manuscript.abstract}
                          </p>
                        )}
                        
                        {manuscript.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {manuscript.keywords.map((keyword, i) => (
                              <span key={i} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className={`px-2 py-1 rounded ${
                            manuscript.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                            manuscript.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {manuscript.status}
                          </span>
                          {manuscript.pubmedUrl && <span>PubMed</span>}
                          {manuscript.f1000Url && <span>F1000Research</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
