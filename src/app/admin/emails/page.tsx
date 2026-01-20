"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AVAILABLE_PLACEHOLDERS, processTemplate } from "@/lib/email-templates";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: "INVITATION" | "COMMUNICATION";
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  email: string;
  role: string;
}

function EmailManagementContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Template editing state
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [isNewTemplate, setIsNewTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateSubject, setTemplateSubject] = useState("");
  const [templateBody, setTemplateBody] = useState("");
  const [templateType, setTemplateType] = useState<"INVITATION" | "COMMUNICATION">("COMMUNICATION");
  const [templateIsDefault, setTemplateIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);

  // Preview state
  const [showPreview, setShowPreview] = useState(false);

  // Send email state
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [sending, setSending] = useState(false);
  const [sendResults, setSendResults] = useState<{ email: string; success: boolean; message: string }[]>([]);

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/email-templates");
      if (response.status === 403) {
        setError("Admin access required");
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }
      const data = await response.json();
      setTemplates(data.templates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load templates");
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/invite-grader");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.graders);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      Promise.all([fetchTemplates(), fetchUsers()]).finally(() => {
        setLoading(false);
      });
    }
  }, [status, router, fetchTemplates, fetchUsers]);

  // Handle pre-selected users from URL params
  useEffect(() => {
    const selected = searchParams.get("selected");
    if (selected) {
      const ids = selected.split(",").filter(Boolean);
      setSelectedUserIds(new Set(ids));
    }
  }, [searchParams]);

  const handleNewTemplate = () => {
    setEditingTemplate(null);
    setIsNewTemplate(true);
    setTemplateName("");
    setTemplateSubject("");
    setTemplateBody("");
    setTemplateType("COMMUNICATION");
    setTemplateIsDefault(false);
    setShowPreview(false);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setIsNewTemplate(false);
    setTemplateName(template.name);
    setTemplateSubject(template.subject);
    setTemplateBody(template.body);
    setTemplateType(template.type);
    setTemplateIsDefault(template.isDefault);
    setShowPreview(false);
  };

  const handleCancelEdit = () => {
    setEditingTemplate(null);
    setIsNewTemplate(false);
    setShowPreview(false);
  };

  const handleSaveTemplate = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const url = isNewTemplate
        ? "/api/admin/email-templates"
        : `/api/admin/email-templates/${editingTemplate?.id}`;
      const method = isNewTemplate ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: templateName,
          subject: templateSubject,
          body: templateBody,
          type: templateType,
          isDefault: templateIsDefault,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save template");
      }

      setSuccess(isNewTemplate ? "Template created successfully" : "Template updated successfully");
      setEditingTemplate(null);
      setIsNewTemplate(false);
      fetchTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save template");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string, templateName: string) => {
    if (!confirm(`Are you sure you want to delete "${templateName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/email-templates/${templateId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete template");
      }

      setSuccess("Template deleted successfully");
      fetchTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete template");
    }
  };

  const handleSelectAllUsers = () => {
    const filteredUsers = roleFilter === "ALL" ? users : users.filter((u) => u.role === roleFilter);
    if (selectedUserIds.size === filteredUsers.length) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(filteredUsers.map((u) => u.id)));
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleSendEmails = async () => {
    if (selectedUserIds.size === 0 || !selectedTemplateId) {
      setError("Please select recipients and a template");
      return;
    }

    if (!confirm(`Send email to ${selectedUserIds.size} recipients?`)) {
      return;
    }

    setSending(true);
    setError("");
    setSuccess("");
    setSendResults([]);

    try {
      const response = await fetch("/api/admin/bulk-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIds: Array.from(selectedUserIds),
          templateId: selectedTemplateId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send emails");
      }

      setSuccess(data.message);
      setSendResults(data.results);
      setSelectedUserIds(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send emails");
    } finally {
      setSending(false);
    }
  };

  const filteredUsers = roleFilter === "ALL" ? users : users.filter((u) => u.role === roleFilter);

  const insertPlaceholder = (placeholder: string) => {
    setTemplateBody((prev) => prev + placeholder);
  };

  const previewSubject = processTemplate(templateSubject, {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    signInUrl: "https://example.com/auth/signin",
  });

  const previewBody = processTemplate(templateBody, {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    signInUrl: "https://example.com/auth/signin",
  });

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 mb-2 inline-block"
          >
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Email Communications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage email templates and send communications to users
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded text-sm">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Templates */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Email Templates
                </h2>
                <button
                  onClick={handleNewTemplate}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors"
                >
                  + New Template
                </button>
              </div>

              {/* Template List */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${
                      editingTemplate?.id === template.id ? "bg-emerald-50 dark:bg-emerald-900/20" : ""
                    }`}
                    onClick={() => handleEditTemplate(template)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {template.name}
                          {template.isDefault && (
                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {template.subject}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          template.type === "INVITATION"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                        }`}
                      >
                        {template.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Template Editor */}
            {(editingTemplate || isNewTemplate) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow mt-6">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {isNewTemplate ? "New Template" : "Edit Template"}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      {showPreview ? "Edit" : "Preview"}
                    </button>
                    {!isNewTemplate && editingTemplate && (
                      <button
                        onClick={() => handleDeleteTemplate(editingTemplate.id, editingTemplate.name)}
                        className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {showPreview ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Subject Preview:
                        </label>
                        <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded">
                          {previewSubject}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Body Preview:
                        </label>
                        <div
                          className="bg-white border border-gray-200 dark:border-gray-600 rounded p-4 max-h-96 overflow-y-auto"
                          dangerouslySetInnerHTML={{ __html: previewBody }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Name *
                          </label>
                          <input
                            type="text"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Template name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Type *
                          </label>
                          <select
                            value={templateType}
                            onChange={(e) => setTemplateType(e.target.value as "INVITATION" | "COMMUNICATION")}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                          >
                            <option value="INVITATION">Invitation</option>
                            <option value="COMMUNICATION">Communication</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Subject *
                        </label>
                        <input
                          type="text"
                          value={templateSubject}
                          onChange={(e) => setTemplateSubject(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Email subject line"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Body (HTML) *
                        </label>
                        <textarea
                          value={templateBody}
                          onChange={(e) => setTemplateBody(e.target.value)}
                          rows={10}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                          placeholder="<html>...</html>"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Insert Placeholder:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {AVAILABLE_PLACEHOLDERS.map((p) => (
                            <button
                              key={p.key}
                              type="button"
                              onClick={() => insertPlaceholder(p.key)}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                              title={p.description}
                            >
                              {p.key}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isDefault"
                          checked={templateIsDefault}
                          onChange={(e) => setTemplateIsDefault(e.target.checked)}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <label htmlFor="isDefault" className="text-sm text-gray-700 dark:text-gray-300">
                          Set as default template for this type
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-6">
                    <button
                      onClick={handleSaveTemplate}
                      disabled={saving || !templateName || !templateSubject || !templateBody}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {saving ? "Saving..." : "Save Template"}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Send Emails */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Send Emails
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {/* Template Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Template *
                  </label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Choose a template...</option>
                    {templates
                      .filter((t) => t.type === "COMMUNICATION")
                      .map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                          {template.isDefault ? " (Default)" : ""}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Role Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Filter by Role
                  </label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="GRADER">Graders</option>
                    <option value="ADMIN">Admins</option>
                    <option value="REVIEWER">Reviewers</option>
                    <option value="AUTHOR">Authors</option>
                  </select>
                </div>

                {/* User Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Select Recipients ({selectedUserIds.size} of {filteredUsers.length})
                    </label>
                    <button
                      type="button"
                      onClick={handleSelectAllUsers}
                      className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                    >
                      {selectedUserIds.size === filteredUsers.length ? "Deselect All" : "Select All"}
                    </button>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-600 rounded-md max-h-64 overflow-y-auto">
                    {filteredUsers.length === 0 ? (
                      <p className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                        No users found
                      </p>
                    ) : (
                      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredUsers.map((user) => (
                          <li
                            key={user.id}
                            className={`px-4 py-2 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${
                              selectedUserIds.has(user.id) ? "bg-emerald-50 dark:bg-emerald-900/20" : ""
                            }`}
                            onClick={() => handleSelectUser(user.id)}
                          >
                            <input
                              type="checkbox"
                              checked={selectedUserIds.has(user.id)}
                              onChange={() => {}}
                              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 dark:text-white truncate">
                                {user.firstName || user.lastName
                                  ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                                  : user.name || user.email}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user.email}
                              </p>
                            </div>
                            <span
                              className={`text-xs px-2 py-0.5 rounded ${
                                user.role === "ADMIN"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                  : user.role === "GRADER"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                              }`}
                            >
                              {user.role}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Send Results */}
                {sendResults.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Send Results:
                    </h4>
                    <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                      {sendResults.map((result, idx) => (
                        <li
                          key={idx}
                          className={`${
                            result.success
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {result.email}: {result.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Send Button */}
                <button
                  onClick={handleSendEmails}
                  disabled={sending || selectedUserIds.size === 0 || !selectedTemplateId}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {sending
                    ? "Sending..."
                    : `Send Email to ${selectedUserIds.size} Recipient${selectedUserIds.size !== 1 ? "s" : ""}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmailManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      }
    >
      <EmailManagementContent />
    </Suspense>
  );
}
