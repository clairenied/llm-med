interface ManuscriptVersion {
  id: string;
  versionNumber: number;
  documentUrl?: string;
  documentType: 'WORD' | 'PDF' | 'TEXT' | 'FREE_TEXT';
  notes?: string;
  createdAt: string;
  reviews: any[];
}

interface VersionTrackerProps {
  versions: ManuscriptVersion[];
  selectedVersion: ManuscriptVersion | null;
  onVersionSelect: (version: ManuscriptVersion) => void;
  onVersionDelete?: (versionId: string) => void;
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

export default function VersionTracker({ versions, selectedVersion, onVersionSelect, onVersionDelete }: VersionTrackerProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Version History</h3>
      
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
    </div>
  );
}
