import { useState } from "react";
import Link from "next/link";

interface Review {
  id: string;
  reviewer: {
    id: string;
    code: string;
    name: string;
  };
  reviewType: "INTERNAL" | "EXTERNAL";
  content: string;
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
  updatedAt: string;
  reviews: Review[];
}

interface VersionTrackerProps {
  versions: ManuscriptVersion[];
  selectedVersion: ManuscriptVersion | null;
  onVersionSelect: (version: ManuscriptVersion) => void;
  manuscriptId: string;
  onVersionAdd?: () => void;
}

const documentTypeIcons = {
  WORD: "📄",
  PDF: "📕",
  TEXT: "📝",
  FREE_TEXT: "✏️",
};

const documentTypeColors = {
  WORD: "bg-blue-100 text-blue-800",
  PDF: "bg-red-100 text-red-800",
  TEXT: "bg-green-100 text-green-800",
  FREE_TEXT: "bg-purple-100 text-purple-800",
};

export default function VersionTracker({
  versions,
  selectedVersion,
  onVersionSelect,
  manuscriptId,
  onVersionAdd,
}: VersionTrackerProps) {
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

  const handleDeleteVersion = async (versionId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this version? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/versions/${versionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete version");
      }

      // Refresh the manuscript data
      if (onVersionAdd) {
        onVersionAdd();
      }
    } catch (error) {
      console.error("Error deleting version:", error);
      alert("Failed to delete version. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Version History
      </h3>

      {versions.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {versions.length} version{versions.length !== 1 ? "s" : ""}
            </span>
            <Link
              href={`/manuscripts/${manuscriptId}/versions/new`}
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
              Add Version
            </Link>
          </div>

          {versions.map((version) => (
            <div
              key={version.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedVersion?.id === version.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => onVersionSelect(version)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <h4 className="font-semibold text-gray-900">
                    Version {version.versionNumber}
                  </h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${documentTypeColors[version.documentType]}`}
                  >
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
                      <span>Download</span>
                    </a>
                  )}
                  <Link
                    href={`/manuscripts/${manuscriptId}/versions/${version.id}/edit`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    title="Edit version"
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteVersion(version.id);
                    }}
                    className="text-sm text-red-600 hover:text-red-800 flex items-center space-x-1"
                    title="Delete version"
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

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {version.reviews.length} review
                    {version.reviews.length !== 1 ? "s" : ""}
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
