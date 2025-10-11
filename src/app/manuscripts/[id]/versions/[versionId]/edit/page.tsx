"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Version {
  id: string;
  versionNumber: number;
  documentUrl?: string;
  documentType: "WORD" | "PDF" | "TEXT" | "FREE_TEXT";
  notes?: string;
}

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

export default function EditVersionPage() {
  const router = useRouter();
  const params = useParams();
  const manuscriptId = params.id as string;
  const versionId = params.versionId as string;

  const [version, setVersion] = useState<Version | null>(null);
  const [formData, setFormData] = useState<VersionFormData>({
    documentUrl: "",
    documentType: "PDF",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVersion, setIsLoadingVersion] = useState(true);

  const fetchVersion = useCallback(async () => {
    try {
      const response = await fetch(`/api/manuscripts/${manuscriptId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch manuscript");
      }
      const manuscript = await response.json();
      const foundVersion = manuscript.versions.find(
        (v: Version) => v.id === versionId,
      );

      if (!foundVersion) {
        throw new Error("Version not found");
      }

      setVersion(foundVersion);
      setFormData({
        documentUrl: foundVersion.documentUrl || "",
        documentType: foundVersion.documentType,
        notes: foundVersion.notes || "",
      });
    } catch (error) {
      console.error("Error fetching version:", error);
      setErrors({ fetch: "Failed to load version data" });
    } finally {
      setIsLoadingVersion(false);
    }
  }, [versionId, manuscriptId]);

  useEffect(() => {
    fetchVersion();
  }, [fetchVersion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setIsLoading(true);

        const response = await fetch(`/api/versions/${versionId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to update version");
        }

        // Redirect back to manuscript page
        router.push(`/manuscripts/${manuscriptId}`);
      } catch (error) {
        console.error("Error updating version:", error);
        setErrors({ submit: "Failed to update version. Please try again." });
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

  if (isLoadingVersion) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (errors.fetch) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{errors.fetch}</p>
            <Link
              href={`/manuscripts/${manuscriptId}`}
              className="text-red-600 hover:text-red-800 underline"
            >
              Go back to manuscript
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <span className="text-gray-900">
              Edit Version {version?.versionNumber}
            </span>
          </div>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Version {version?.versionNumber}
          </h1>
          <p className="mt-2 text-gray-600">
            Update version details and documentation.
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
                {isLoading ? "Updating..." : "Update Version"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
