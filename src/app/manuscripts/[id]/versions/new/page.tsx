"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface VersionFormData {
  documentUrl?: string;
  documentType: "WORD" | "PDF" | "TEXT" | "FREE_TEXT";
  notes?: string;
}

const documentTypes = [
  { value: "PDF", label: "PDF Document" },
  { value: "WORD", label: "Word Document" },
  { value: "TEXT", label: "Text File" },
  { value: "FREE_TEXT", label: "Free Text" },
] as const;

export default function NewVersionPage() {
  const router = useRouter();
  const params = useParams();
  const manuscriptId = params.id as string;

  const [formData, setFormData] = useState<VersionFormData>({
    documentUrl: "",
    documentType: "PDF",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setIsLoading(true);

        // Get the next version number
        const manuscriptResponse = await fetch(
          `/api/manuscripts/${manuscriptId}`,
        );
        if (!manuscriptResponse.ok) {
          throw new Error("Failed to fetch manuscript");
        }
        const manuscript = await manuscriptResponse.json();
        const nextVersionNumber =
          Math.max(
            ...manuscript.versions.map(
              (v: { versionNumber: number }) => v.versionNumber,
            ),
            0,
          ) + 1;

        const response = await fetch("/api/versions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            manuscriptId,
            versionNumber: nextVersionNumber,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create version");
        }

        // Redirect back to manuscript page
        router.push(`/manuscripts/${manuscriptId}`);
      } catch (error) {
        console.error("Error creating version:", error);
        setErrors({ submit: "Failed to create version. Please try again." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (field: keyof VersionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
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
            <span className="text-gray-900">New Version</span>
          </div>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Version
          </h1>
          <p className="mt-2 text-gray-600">
            Add a new version to track changes and revisions.
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

            {/* Document Type */}
            <div>
              <label
                htmlFor="documentType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Document Type *
              </label>
              <select
                id="documentType"
                value={formData.documentType}
                onChange={(e) =>
                  handleChange(
                    "documentType",
                    e.target.value as VersionFormData["documentType"],
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

            {/* Document URL */}
            <div>
              <label
                htmlFor="documentUrl"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Document URL
              </label>
              <input
                type="url"
                id="documentUrl"
                value={formData.documentUrl}
                onChange={(e) => handleChange("documentUrl", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/document.pdf"
              />
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Notes
              </label>
              <textarea
                id="notes"
                rows={4}
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Version notes or changes..."
              />
            </div>

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
                {isLoading ? "Creating..." : "Create Version"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
