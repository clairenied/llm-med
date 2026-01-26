"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Reviewer {
  id: string;
  name: string;
  email?: string;
  affiliation?: string;
}

interface ReviewFormData {
  reviewerId: string;
  reviewType: "INTERNAL" | "EXTERNAL";
  content: string;
  documentUrl?: string;
  documentType?: "WORD" | "PDF" | "TEXT" | "FREE_TEXT";
}

const reviewTypes = [
  { value: "INTERNAL", label: "Internal Review" },
  { value: "EXTERNAL", label: "External Review" },
] as const;

const documentTypes = [
  { value: "PDF", label: "PDF Document" },
  { value: "WORD", label: "Word Document" },
  { value: "TEXT", label: "Text File" },
  { value: "FREE_TEXT", label: "Free Text" },
] as const;

export default function NewReviewPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const manuscriptId = params.id as string;
  const versionId = params.versionId as string;

  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [loadingReviewers, setLoadingReviewers] = useState(true);
  const [formData, setFormData] = useState<ReviewFormData>({
    reviewerId: "",
    reviewType: "EXTERNAL",
    content: "",
    documentUrl: "",
    documentType: "PDF",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch reviewers on mount
  useEffect(() => {
    async function fetchReviewers() {
      try {
        const response = await fetch("/api/reviewers");
        if (response.ok) {
          const data = await response.json();
          setReviewers(data);
        }
      } catch (error) {
        console.error("Error fetching reviewers:", error);
      } finally {
        setLoadingReviewers(false);
      }
    }

    fetchReviewers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!session?.user?.id) {
      newErrors.session = "You must be logged in to create a review";
    }
    if (!formData.reviewerId) {
      newErrors.reviewerId = "Please select a reviewer";
    }
    if (!formData.content.trim()) {
      newErrors.content = "Review content is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setIsLoading(true);

        const response = await fetch("/api/reviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            versionId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create review");
        }

        // Redirect back to manuscript page
        router.push(`/manuscripts/${manuscriptId}`);
      } catch (error) {
        console.error("Error creating review:", error);
        setErrors({ submit: "Failed to create review. Please try again." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (
    field: keyof ReviewFormData,
    value: string | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value || "" }));
    // Clear error when user makes a selection or starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/manuscripts" className="hover:text-blue-600">
              Manuscripts
            </Link>
            <span>/</span>
            <Link
              href={`/manuscripts/${manuscriptId}`}
              className="hover:text-blue-600"
            >
              Manuscript
            </Link>
            <span>/</span>
            <span className="text-gray-900">New Review</span>
          </div>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Review
          </h1>
          <p className="mt-2 text-gray-600">
            Add your review for this manuscript version.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800 text-sm">{errors.submit}</p>
              </div>
            )}

            {errors.session && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800 text-sm">{errors.session}</p>
              </div>
            )}

            {/* Reviewer Selection */}
            <div>
              <label
                htmlFor="reviewerId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Reviewer *
              </label>
              {loadingReviewers ? (
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-500">
                  Loading reviewers...
                </div>
              ) : (
                <select
                  id="reviewerId"
                  value={formData.reviewerId}
                  onChange={(e) => handleChange("reviewerId", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.reviewerId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a reviewer</option>
                  {reviewers.map((reviewer) => (
                    <option key={reviewer.id} value={reviewer.id}>
                      {reviewer.name}
                      {reviewer.affiliation && ` - ${reviewer.affiliation}`}
                    </option>
                  ))}
                </select>
              )}
              {errors.reviewerId && (
                <p className="text-red-500 text-sm mt-1">{errors.reviewerId}</p>
              )}
            </div>

            {/* Review Type */}
            <div>
              <label
                htmlFor="reviewType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Review Type *
              </label>
              <select
                id="reviewType"
                value={formData.reviewType}
                onChange={(e) =>
                  handleChange(
                    "reviewType",
                    e.target.value as ReviewFormData["reviewType"],
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {reviewTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Review Content */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Review Content *
              </label>
              <textarea
                id="content"
                rows={8}
                value={formData.content}
                onChange={(e) => handleChange("content", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.content ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your detailed review comments..."
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content}</p>
              )}
            </div>

            {/* Document URL */}
            <div>
              <label
                htmlFor="documentUrl"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Review Document URL
              </label>
              <input
                type="url"
                id="documentUrl"
                value={formData.documentUrl}
                onChange={(e) => handleChange("documentUrl", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/review-document.pdf"
              />
            </div>

            {/* Document Type */}
            {formData.documentUrl && (
              <div>
                <label
                  htmlFor="documentType"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Document Type
                </label>
                <select
                  id="documentType"
                  value={formData.documentType}
                  onChange={(e) =>
                    handleChange(
                      "documentType",
                      e.target.value as ReviewFormData["documentType"],
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Link
                href={`/manuscripts/${manuscriptId}`}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating..." : "Create Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
