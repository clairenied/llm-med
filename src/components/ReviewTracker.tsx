import { useState } from "react";
import Link from "next/link";

interface Reviewer {
  id: string;
  name: string;
  email?: string;
  affiliation?: string;
}

interface Review {
  id: string;
  reviewer: Reviewer;
  reviewType: "INTERNAL" | "EXTERNAL";
  content: string;
  documentUrl?: string;
  documentType?: "WORD" | "PDF" | "TEXT" | "FREE_TEXT";
  createdAt: string;
}

interface ManuscriptVersion {
  id: string;
  versionNumber: number;
  manuscriptId: string;
  documentUrl?: string;
  documentType: "WORD" | "PDF" | "TEXT" | "FREE_TEXT";
  notes?: string;
  createdAt: string;
  reviews: Review[];
}

interface ReviewTrackerProps {
  version: ManuscriptVersion;
  reviews: Review[];
  onRefresh?: () => void;
}

const reviewTypeColors = {
  INTERNAL: "bg-blue-100 text-blue-800 border-blue-200",
  EXTERNAL: "bg-green-100 text-green-800 border-green-200",
};

const documentTypeIcons = {
  WORD: "📄",
  PDF: "📕",
  TEXT: "📝",
  FREE_TEXT: "✏️",
};

export default function ReviewTracker({
  version,
  reviews,
  onRefresh,
}: ReviewTrackerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this review? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      // Refresh the manuscript data
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Reviews for Version {version.versionNumber}
        </h3>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </span>
          <Link
            href={`/manuscripts/${version.manuscriptId}/versions/${version.id}/reviews/new`}
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Review
          </Link>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
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
                    {review.reviewer.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`border rounded-lg p-4 ${reviewTypeColors[review.reviewType]}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold text-gray-900">
                          {review.reviewer.name}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            review.reviewType === "INTERNAL"
                              ? "bg-blue-200 text-blue-800"
                              : "bg-green-200 text-green-800"
                          }`}
                        >
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
                            <span>
                              {documentTypeIcons[review.documentType]}
                            </span>
                            <span>Review Document</span>
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </a>
                        )}
                        <Link
                          href={`/manuscripts/${version.manuscriptId}/versions/${version.id}/reviews/${review.id}/edit`}
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          <span>Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-sm text-red-600 hover:text-red-800 flex items-center space-x-1"
                          disabled={isLoading}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          <span>Delete</span>
                        </button>
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
