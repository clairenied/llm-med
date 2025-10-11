"use client";

import { useState } from "react";

interface AuthorFormProps {
  onSubmit: (data: AuthorFormData) => void;
  onCancel: () => void;
  initialData?: Partial<AuthorFormData>;
}

interface AuthorFormData {
  name: string;
  email: string;
  affiliation: string;
  orcId: string;
}

export default function AuthorForm({
  onSubmit,
  onCancel,
  initialData,
}: AuthorFormProps) {
  const [formData, setFormData] = useState<AuthorFormData>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    affiliation: initialData?.affiliation || "",
    orcId: initialData?.orcId || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-t-lg border-b dark:border-gray-600">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {initialData ? "Edit Author" : "Add New Author"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter author name"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>

          {/* Affiliation */}
          <div>
            <label
              htmlFor="affiliation"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Affiliation
            </label>
            <input
              type="text"
              id="affiliation"
              value={formData.affiliation}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  affiliation: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter institution or organization"
            />
          </div>

          {/* ORCID */}
          <div>
            <label
              htmlFor="orcId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              ORCID
            </label>
            <input
              type="text"
              id="orcId"
              value={formData.orcId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, orcId: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0000-0000-0000-0000"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Open Researcher and Contributor ID (optional)
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t dark:border-gray-600">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
            >
              {initialData ? "Update Author" : "Create Author"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
