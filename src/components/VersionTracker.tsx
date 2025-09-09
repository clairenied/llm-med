interface Review {
  id: string;
  reviewer: {
    id: string;
    code: string;
    name: string;
  };
  reviewType: 'INTERNAL' | 'EXTERNAL';
  content: string;
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

interface VersionTrackerProps {
  versions: ManuscriptVersion[];
  selectedVersion: ManuscriptVersion | null;
  onVersionSelect: (version: ManuscriptVersion) => void;
  onVersionDelete?: (versionId: string) => void;
  manuscriptId: string;
  onVersionAdd?: () => void;
}

const documentTypeIcons = {
  WORD: '📄',
  PDF: '📕',
  TEXT: '📝',
  FREE_TEXT: '✏️',
};

const documentTypeColors = {
  WORD: 'bg-blue-100 text-blue-800',
  PDF: 'bg-red-100 text-red-800',
  TEXT: 'bg-green-100 text-green-800',
  FREE_TEXT: 'bg-purple-100 text-purple-800',
};

export default function VersionTracker({ versions, selectedVersion, onVersionSelect, onVersionDelete, manuscriptId, onVersionAdd }: VersionTrackerProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddFirstVersion = async () => {
    try {
      const nextVersionNumber = Math.max(...versions.map(v => v.versionNumber), 0) + 1;
      
      const response = await fetch('/api/versions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          manuscriptId,
          versionNumber: nextVersionNumber,
          documentType: 'PDF',
          notes: 'Initial version',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create version');
      }

      // Refresh the manuscript data
      if (onVersionAdd) {
        onVersionAdd();
      }
    } catch (error) {
      console.error('Error creating version:', error);
      alert('Failed to create version. Please try again.');
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Version History</h3>
      
      {versions.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Versions Yet</h4>
          <p className="text-gray-600 mb-4">
            This manuscript doesn&apos;t have any versions uploaded yet.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>• Upload a document to create the first version</p>
            <p>• Track changes and revisions over time</p>
            <p>• Manage peer reviews for each version</p>
          </div>
          <button 
            onClick={handleAddFirstVersion}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add First Version
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {versions.map((version) => (
          <div
            key={version.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedVersion?.id === version.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => onVersionSelect(version)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <h4 className="font-semibold text-gray-900">
                  Version {version.versionNumber}
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${documentTypeColors[version.documentType]}`}>
                  <span>{documentTypeIcons[version.documentType]}</span>
                  <span>{version.documentType}</span>
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {formatDate(version.createdAt)}
              </div>
            </div>
            
            {version.notes && (
              <p className="text-sm text-gray-600 mb-2">{version.notes}</p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {version.documentUrl && (
                  <a
                    href={version.documentUrl}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Download</span>
                  </a>
                )}
                {onVersionDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to delete this version? This will also delete all reviews for this version.')) {
                        onVersionDelete(version.id);
                      }
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {version.reviews.length} review{version.reviews.length !== 1 ? 's' : ''}
                </span>
                {version.reviews.length > 0 && (
                  <div className="flex -space-x-1">
                    {version.reviews.slice(0, 3).map((review, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 border-2 border-white"
                        title={`Reviewer ${review.reviewer.code}`}
                      >
                        {review.reviewer.code}
                      </div>
                    ))}
                    {version.reviews.length > 3 && (
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
                        +{version.reviews.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
