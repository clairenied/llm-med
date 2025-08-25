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

interface ReviewTrackerProps {
  version: ManuscriptVersion;
  reviews: Review[];
  onReviewEdit?: (review: Review) => void;
  onReviewDelete?: (reviewId: string) => void;
}

const reviewTypeColors = {
  INTERNAL: 'bg-blue-100 text-blue-800 border-blue-200',
  EXTERNAL: 'bg-green-100 text-green-800 border-green-200',
};

const documentTypeIcons = {
  WORD: '📄',
  PDF: '📕',
  TEXT: '📝',
  FREE_TEXT: '✏️',
};

export default function ReviewTracker({ version, reviews, onReviewEdit, onReviewDelete }: ReviewTrackerProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sortedReviews = [...reviews].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Reviews for Version {version.versionNumber}
        </h3>
        <span className="text-sm text-gray-500">
          {reviews.length} review{reviews.length !== 1 ? 's' : ''}
        </span>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p>No reviews yet for this version</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedReviews.map((review, index) => (
            <div key={review.id} className="relative">
              {/* Timeline connector */}
              {index < sortedReviews.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200 -z-10"></div>
              )}
              
              <div className="flex space-x-4">
                {/* Reviewer Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold text-gray-700">
                    {review.reviewer.code}
                  </div>
                </div>
                
                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <div className={`border rounded-lg p-4 ${reviewTypeColors[review.reviewType]}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold text-gray-900">
                          {review.reviewer.name}
                        </h4>
                        <span className="text-sm font-medium">
                          Reviewer {review.reviewer.code}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          review.reviewType === 'INTERNAL' 
                            ? 'bg-blue-200 text-blue-800' 
                            : 'bg-green-200 text-green-800'
                        }`}>
                          {review.reviewType}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(review.createdAt)}
                      </div>
                    </div>
                    
                    {review.reviewer.affiliation && (
                      <p className="text-sm text-gray-600 mb-3">
                        {review.reviewer.affiliation}
                      </p>
                    )}
                    
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-800 leading-relaxed">
                        {review.content}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        {review.documentUrl && review.documentType && (
                          <a
                            href={review.documentUrl}
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                          >
                            <span>{documentTypeIcons[review.documentType]}</span>
                            <span>Review Document</span>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </a>
                        )}
                        {onReviewEdit && (
                          <button
                            onClick={() => onReviewEdit(review)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                        )}
                        {onReviewDelete && (
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this review?')) {
                                onReviewDelete(review.id);
                              }
                            }}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {review.isSharedExternally ? (
                          <span className="text-xs text-green-600 flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Shared Externally</span>
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500 flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            <span>Internal Only</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
