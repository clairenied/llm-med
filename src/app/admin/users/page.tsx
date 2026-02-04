"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Grader {
  id: string;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  email: string;
  role: string;
  emailVerified: string | null;
  invitationStatus: "NOT_INVITED" | "INVITED";
  gradeCount: number;
  createdAt: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  type: string;
  isDefault: boolean;
}

interface InviteResult {
  email: string;
  success: boolean;
  message: string;
}

interface InviteRow {
  email: string;
  firstName: string;
  lastName: string;
}

const emptyRow = (): InviteRow => ({ email: "", firstName: "", lastName: "" });

export default function ManageGradersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [graders, setGraders] = useState<Grader[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [allTemplates, setAllTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Invite form state - now tabular
  const [inviteRows, setInviteRows] = useState<InviteRow[]>([emptyRow()]);
  const [inviteRole, setInviteRole] = useState("GRADER");
  const [inviteTemplateId, setInviteTemplateId] = useState("");
  const [inviteCcEmails, setInviteCcEmails] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteResults, setInviteResults] = useState<InviteResult[]>([]);

  // Send email state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sendTemplateId, setSendTemplateId] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResults, setSendResults] = useState<{ email: string; success: boolean; message: string }[]>([]);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [saving, setSaving] = useState(false);

  // Resend invite state
  const [resendingId, setResendingId] = useState<string | null>(null);

  // Gmail option
  const [useGmail, setUseGmail] = useState(false);

  // Filter state
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Filtered graders based on role and status filters
  const filteredGraders = graders.filter((g) => {
    if (roleFilter !== "ALL" && g.role !== roleFilter) return false;
    if (statusFilter !== "ALL") {
      if (statusFilter === "SIGNED_IN" && !g.emailVerified) return false;
      if (statusFilter === "INVITED" && (g.emailVerified || g.invitationStatus !== "INVITED")) return false;
      if (statusFilter === "NOT_INVITED" && (g.emailVerified || g.invitationStatus !== "NOT_INVITED")) return false;
    }
    return true;
  });

  const fetchGraders = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/invite-grader");
      if (response.status === 403) {
        setError("Admin access required");
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to fetch graders");
      }
      const data = await response.json();
      setGraders(data.graders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load graders");
    }
  }, []);

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/email-templates");
      if (response.ok) {
        const data = await response.json();
        setAllTemplates(data.templates);

        // Invitation templates
        const invitationTemplates = data.templates.filter(
          (t: EmailTemplate) => t.type === "INVITATION"
        );
        setTemplates(invitationTemplates);
        const defaultInvite = invitationTemplates.find((t: EmailTemplate) => t.isDefault);
        if (defaultInvite) {
          setInviteTemplateId(defaultInvite.id);
        } else if (invitationTemplates.length > 0) {
          setInviteTemplateId(invitationTemplates[0].id);
        }

        // Communication templates - set default
        const commTemplates = data.templates.filter(
          (t: EmailTemplate) => t.type === "COMMUNICATION"
        );
        const defaultComm = commTemplates.find((t: EmailTemplate) => t.isDefault);
        if (defaultComm) {
          setSendTemplateId(defaultComm.id);
        } else if (commTemplates.length > 0) {
          setSendTemplateId(commTemplates[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch templates:", err);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      Promise.all([fetchGraders(), fetchTemplates()]).finally(() => {
        setLoading(false);
      });
    }
  }, [status, router, fetchGraders, fetchTemplates]);

  // Invite row handlers
  const updateInviteRow = (index: number, field: keyof InviteRow, value: string) => {
    setInviteRows((prev) => {
      const newRows = [...prev];
      newRows[index] = { ...newRows[index], [field]: value };
      return newRows;
    });
  };

  const addInviteRow = () => {
    setInviteRows((prev) => [...prev, emptyRow()]);
  };

  const removeInviteRow = (index: number) => {
    if (inviteRows.length > 1) {
      setInviteRows((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const validInviteRows = inviteRows.filter((row) => row.email.includes("@"));

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validInviteRows.length === 0) return;

    setInviting(true);
    setError("");
    setSuccess("");
    setInviteResults([]);

    try {
      const response = await fetch("/api/admin/bulk-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invites: validInviteRows,
          role: inviteRole,
          templateId: inviteTemplateId || undefined,
          ccEmails: inviteCcEmails || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to invite users");
      }

      setSuccess(data.message);
      setInviteResults(data.results);
      setInviteRows([emptyRow()]);
      fetchGraders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to invite users");
    } finally {
      setInviting(false);
    }
  };

  // Send emails handler
  const handleSendEmails = async () => {
    if (selectedIds.size === 0 || !sendTemplateId) {
      setError("Please select recipients and a template");
      return;
    }

    if (!confirm(`Send email to ${selectedIds.size} recipient(s)?`)) {
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
          userIds: Array.from(selectedIds),
          templateId: sendTemplateId,
          useGmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send emails");
      }

      setSuccess(data.message);
      setSendResults(data.results);
      setSelectedIds(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send emails");
    } finally {
      setSending(false);
    }
  };

  const handleEdit = (grader: Grader) => {
    setEditingId(grader.id);
    // If firstName/lastName are empty, try to parse from name field
    if (!grader.firstName && !grader.lastName && grader.name) {
      const nameParts = grader.name.trim().split(/\s+/);
      if (nameParts.length >= 2) {
        setEditFirstName(nameParts[0]);
        setEditLastName(nameParts.slice(1).join(" "));
      } else {
        setEditFirstName(grader.name);
        setEditLastName("");
      }
    } else {
      setEditFirstName(grader.firstName || "");
      setEditLastName(grader.lastName || "");
    }
    setEditRole(grader.role);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFirstName("");
    setEditLastName("");
    setEditRole("");
  };

  const handleSaveEdit = async (graderId: string) => {
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/users/${graderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: editFirstName,
          lastName: editLastName,
          role: editRole,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update user");
      }

      setSuccess("User updated successfully");
      setEditingId(null);
      fetchGraders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (graderId: string, email: string, gradeCount: number) => {
    const gradeWarning = gradeCount > 0
      ? `\n\nWARNING: This will also delete ${gradeCount} grade${gradeCount !== 1 ? "s" : ""} submitted by this user!`
      : "";

    if (!confirm(`Are you sure you want to delete ${email}?${gradeWarning}`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${graderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete user");
      }

      setSuccess("User deleted successfully");
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(graderId);
        return newSet;
      });
      fetchGraders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  const handleResendInvite = async (userId: string, email: string) => {
    setResendingId(userId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/resend-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          templateId: inviteTemplateId || undefined,
          useGmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend invitation");
      }

      setSuccess(data.message || `Invitation sent to ${email}`);
      await fetchGraders(); // Refresh the list to show updated status
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend invitation");
    } finally {
      setResendingId(null);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredGraders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredGraders.map((g) => g.id)));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const communicationTemplates = allTemplates.filter((t) => t.type === "COMMUNICATION");

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
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Invite users, manage roles, and send communications
          </p>
        </div>

        {/* Global Messages */}
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

        {/* Two Column Layout for Invite and Send */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Invite Users */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Invite Users
              </h2>
            </div>
            <form onSubmit={handleInvite} className="p-6">
              {/* Invite Results */}
              {inviteResults.length > 0 && (
                <div className="mb-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Results:
                  </h4>
                  <ul className="text-sm space-y-1">
                    {inviteResults.map((result, idx) => (
                      <li
                        key={idx}
                        className={
                          result.success
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      >
                        {result.email}: {result.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tabular Invite Form */}
              <div className="mb-4">
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                          Email *
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                          First Name
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                          Last Name
                        </th>
                        <th className="px-2 py-2 w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {inviteRows.map((row, idx) => (
                        <tr key={idx}>
                          <td className="px-2 py-2">
                            <input
                              type="email"
                              value={row.email}
                              onChange={(e) => updateInviteRow(idx, "email", e.target.value)}
                              placeholder="user@example.com"
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.firstName}
                              onChange={(e) => updateInviteRow(idx, "firstName", e.target.value)}
                              placeholder="John"
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.lastName}
                              onChange={(e) => updateInviteRow(idx, "lastName", e.target.value)}
                              placeholder="Doe"
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                            />
                          </td>
                          <td className="px-2 py-2">
                            {inviteRows.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeInviteRow(idx)}
                                className="text-red-500 hover:text-red-700 text-lg"
                                title="Remove row"
                              >
                                ×
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  onClick={addInviteRow}
                  className="mt-2 text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  + Add another
                </button>
              </div>

              {/* Role and Template */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="GRADER">Grader</option>
                    <option value="REVIEWER">Reviewer</option>
                    <option value="AUTHOR">Author</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Template
                  </label>
                  <select
                    value={inviteTemplateId}
                    onChange={(e) => setInviteTemplateId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  >
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  CC Emails (optional, comma-separated)
                </label>
                <input
                  type="text"
                  value={inviteCcEmails}
                  onChange={(e) => setInviteCcEmails(e.target.value)}
                  placeholder="e.g. admin@example.com, team@example.com"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={inviting || validInviteRows.length === 0}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {inviting ? "Sending..." : `Invite ${validInviteRows.length || ""} User${validInviteRows.length !== 1 ? "s" : ""}`}
                </button>
                <Link
                  href="/admin/templates"
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  Manage Templates
                </Link>
              </div>
            </form>
          </div>

          {/* Send Other Emails */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Send Other Emails
              </h2>
            </div>
            <div className="p-6">
              {/* Send Results */}
              {sendResults.length > 0 && (
                <div className="mb-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Results:
                  </h4>
                  <ul className="text-sm space-y-1 max-h-24 overflow-y-auto">
                    {sendResults.map((result, idx) => (
                      <li
                        key={idx}
                        className={
                          result.success
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      >
                        {result.email}: {result.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Select users from the table below, then choose a template and send.
              </p>

              {session?.user?.email?.toLowerCase() === "craignied@gmail.com" && (
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <input
                    type="checkbox"
                    checked={useGmail}
                    onChange={(e) => setUseGmail(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Send from Gmail
                </label>
              )}

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Template
                  </label>
                  <Link
                    href="/admin/templates"
                    className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                  >
                    Edit Templates
                  </Link>
                </div>
                <select
                  value={sendTemplateId}
                  onChange={(e) => setSendTemplateId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  {communicationTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleSendEmails}
                  disabled={sending || selectedIds.size === 0 || !sendTemplateId}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {sending ? "Sending..." : `Send to ${selectedIds.size} Selected`}
                </button>
                {selectedIds.size > 0 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedIds.size} user{selectedIds.size !== 1 ? "s" : ""} selected
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Users ({filteredGraders.length}{filteredGraders.length !== graders.length ? ` of ${graders.length}` : ""})
              </h2>
              <div className="flex items-center gap-4">
                {filteredGraders.length > 0 && (
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                  >
                    {selectedIds.size === filteredGraders.length ? "Deselect All" : "Select All"}
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">Role:</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="ALL">All</option>
                  <option value="GRADER">Grader</option>
                  <option value="ADMIN">Admin</option>
                  <option value="REVIEWER">Reviewer</option>
                  <option value="AUTHOR">Author</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="ALL">All</option>
                  <option value="NOT_INVITED">Not Invited</option>
                  <option value="INVITED">Invited</option>
                  <option value="SIGNED_IN">Signed In</option>
                </select>
              </div>
            </div>
          </div>

          {graders.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              No users yet
            </div>
          ) : filteredGraders.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              No users match the current filters
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === filteredGraders.length && filteredGraders.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Grades
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredGraders.map((grader) => (
                    <tr
                      key={grader.id}
                      className={`${
                        selectedIds.has(grader.id)
                          ? "bg-emerald-50 dark:bg-emerald-900/20"
                          : ""
                      } hover:bg-gray-50 dark:hover:bg-gray-700/50`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(grader.id)}
                          onChange={() => handleSelectOne(grader.id)}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        {editingId === grader.id ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editFirstName}
                              onChange={(e) => setEditFirstName(e.target.value)}
                              placeholder="First"
                              className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:bg-gray-600 dark:text-white"
                            />
                            <input
                              type="text"
                              value={editLastName}
                              onChange={(e) => setEditLastName(e.target.value)}
                              placeholder="Last"
                              className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:bg-gray-600 dark:text-white"
                            />
                          </div>
                        ) : (
                          <span className="text-gray-900 dark:text-white">
                            {grader.firstName || grader.lastName
                              ? `${grader.firstName || ""} ${grader.lastName || ""}`.trim()
                              : grader.name || "—"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {grader.email}
                      </td>
                      <td className="px-4 py-3">
                        {editingId === grader.id ? (
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            disabled={grader.id === session?.user?.id}
                            className="w-28 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:bg-gray-600 dark:text-white disabled:opacity-50"
                          >
                            <option value="GRADER">Grader</option>
                            <option value="REVIEWER">Reviewer</option>
                            <option value="AUTHOR">Author</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              grader.role === "ADMIN"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                : grader.role === "GRADER"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                            }`}
                          >
                            {grader.role}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {grader.emailVerified ? (
                          <div>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Signed In
                            </span>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(grader.emailVerified).toLocaleDateString()}
                            </p>
                          </div>
                        ) : grader.invitationStatus === "INVITED" ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Invited
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                            Not Invited
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {grader.gradeCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {editingId === grader.id ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleSaveEdit(grader.id)}
                              disabled={saving}
                              className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 disabled:opacity-50"
                            >
                              {saving ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            {!grader.emailVerified && grader.invitationStatus === "NOT_INVITED" && (
                              <button
                                onClick={() => handleResendInvite(grader.id, grader.email)}
                                disabled={resendingId === grader.id}
                                className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 disabled:opacity-50"
                              >
                                {resendingId === grader.id ? "Sending..." : "Invite"}
                              </button>
                            )}
                            {!grader.emailVerified && grader.invitationStatus === "INVITED" && (
                              <button
                                onClick={() => handleResendInvite(grader.id, grader.email)}
                                disabled={resendingId === grader.id}
                                className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 disabled:opacity-50"
                              >
                                {resendingId === grader.id ? "Sending..." : "Resend"}
                              </button>
                            )}
                            <button
                              onClick={() => handleEdit(grader)}
                              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                            >
                              Edit
                            </button>
                            {grader.id !== session?.user?.id && (
                              <button
                                onClick={() => handleDelete(grader.id, grader.email, grader.gradeCount)}
                                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
