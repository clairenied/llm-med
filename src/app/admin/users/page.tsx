"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "REVIEWER" | "AUTHOR";
  createdAt: string;
  updatedAt: string;
}

interface Invitation {
  id: string;
  email: string;
  role: "ADMIN" | "REVIEWER" | "AUTHOR";
  status: "PENDING" | "ACCEPTED" | "EXPIRED";
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
}

export default function AdminUserManagementPage() {
  const [activeTab, setActiveTab] = useState<"users" | "invitations">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteFormData, setInviteFormData] = useState({
    email: "",
    role: "AUTHOR" as "ADMIN" | "REVIEWER" | "AUTHOR",
  });
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState<string | null>(null);
  const [editingInvitation, setEditingInvitation] = useState<string | null>(
    null,
  );
  const [editFormData, setEditFormData] = useState({
    email: "",
    role: "AUTHOR" as "ADMIN" | "REVIEWER" | "AUTHOR",
  });
  const [showPasswordReset, setShowPasswordReset] = useState<string | null>(
    null,
  );
  const [newPassword, setNewPassword] = useState("");
  const [resettingPassword, setResettingPassword] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    if (session.user.role !== "ADMIN") {
      router.push("/auth/unauthorized");
      return;
    }
    fetchData();
  }, [session, status, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchUsers(), fetchInvitations()]);
    } catch (error) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchInvitations = async () => {
    try {
      const response = await fetch("/api/admin/invitations");
      if (!response.ok) {
        throw new Error("Failed to fetch invitations");
      }
      const data = await response.json();
      setInvitations(data.invitations);
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      fetchUsers();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update user role",
      );
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      fetchUsers();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete user",
      );
    }
  };

  const sendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inviteFormData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send invitation");
      }

      setInviteFormData({ email: "", role: "AUTHOR" });
      setShowInviteForm(false);
      fetchInvitations();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to send invitation",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resendInvitation = async (invitationId: string) => {
    setResending(invitationId);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/invitations/${invitationId}/resend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to resend invitation");
      }

      fetchInvitations();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to resend invitation",
      );
    } finally {
      setResending(null);
    }
  };

  const deleteInvitation = async (invitationId: string) => {
    if (!confirm("Are you sure you want to delete this invitation?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/invitations/${invitationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete invitation");
      }

      fetchInvitations();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete invitation",
      );
    }
  };

  const startEditInvitation = (invitation: Invitation) => {
    setEditingInvitation(invitation.id);
    setEditFormData({
      email: invitation.email,
      role: invitation.role,
    });
  };

  const cancelEdit = () => {
    setEditingInvitation(null);
    setEditFormData({ email: "", role: "AUTHOR" });
  };

  const updateInvitation = async (invitationId: string) => {
    try {
      const response = await fetch(`/api/admin/invitations/${invitationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update invitation");
      }

      setEditingInvitation(null);
      setEditFormData({ email: "", role: "AUTHOR" });
      await fetchInvitations();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const resetPassword = async (userId: string) => {
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setResettingPassword(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/users/${userId}/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to reset password");
      }

      const result = await response.json();
      alert(`Password reset successfully for ${result.user.email}`);
      setShowPasswordReset(null);
      setNewPassword("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setResettingPassword(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <Link
                  href="/admin"
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400 mb-2 inline-block cursor-pointer"
                >
                  ← Back to Admin Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  User Management
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Manage users and send invitations
                </p>
              </div>
              <button
                onClick={() => setShowInviteForm(!showInviteForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
              >
                {showInviteForm ? "Cancel" : "Create Invitation"}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Tabs */}
          <div className="mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("users")}
                className={`py-2 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                  activeTab === "users"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Active Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab("invitations")}
                className={`py-2 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                  activeTab === "invitations"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Pending Invitations (
                {
                  invitations.filter(
                    (inv) =>
                      !inv.usedAt && new Date(inv.expiresAt) >= new Date(),
                  ).length
                }
                )
              </button>
            </nav>
          </div>

          {/* Invitation Form */}
          {showInviteForm && (
            <div className="mb-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Create New Invitation
              </h3>
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 <strong>No email will be sent.</strong> After creating the
                  invitation, copy the signup link and share it manually via
                  email, Slack, or any messaging app.
                </p>
              </div>
              <form onSubmit={sendInvitation} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={inviteFormData.email}
                    onChange={(e) =>
                      setInviteFormData({
                        ...inviteFormData,
                        email: e.target.value,
                      })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    value={inviteFormData.role}
                    onChange={(e) =>
                      setInviteFormData({
                        ...inviteFormData,
                        role: e.target.value as "AUTHOR" | "REVIEWER" | "ADMIN",
                      })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-pointer"
                  >
                    <option value="AUTHOR">Author</option>
                    <option value="REVIEWER">Reviewer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {submitting ? "Creating..." : "Create Invitation"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInviteForm(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Password Reset Modal */}
          {showPasswordReset && (
            <div className="mb-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6 border-2 border-blue-200 dark:border-blue-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Reset Password
              </h3>
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-md">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ <strong>Warning:</strong> This will immediately change the
                  user&apos;s password. They will need to use the new password
                  to sign in.
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    New Password (minimum 6 characters)
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter new password"
                    minLength={6}
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => resetPassword(showPasswordReset)}
                    disabled={resettingPassword || newPassword.length < 6}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {resettingPassword ? "Resetting..." : "Reset Password"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordReset(null);
                      setNewPassword("");
                      setError("");
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Content based on active tab */}
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:p-6">
              {activeTab === "users" ? (
                <>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                    Active Users ({users.length})
                  </h3>

                  {users.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">
                      No users found.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Created
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {users.map((user) => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user.name || "No name"}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    <a
                                      href={`mailto:${user.email}`}
                                      className="hover:text-blue-600 cursor-pointer underline"
                                    >
                                      {user.email}
                                    </a>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {user.id === session.user.id ? (
                                  <div className="flex items-center space-x-2">
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                      {user.role}
                                    </span>
                                    <span className="text-gray-400 dark:text-gray-500 text-xs italic">
                                      (You)
                                    </span>
                                  </div>
                                ) : (
                                  <select
                                    value={user.role}
                                    onChange={(e) =>
                                      updateUserRole(user.id, e.target.value)
                                    }
                                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
                                  >
                                    <option value="AUTHOR">Author</option>
                                    <option value="REVIEWER">Reviewer</option>
                                    <option value="ADMIN">Admin</option>
                                  </select>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {user.id === session.user.id ? (
                                  <span className="text-gray-400 dark:text-gray-500 text-sm italic">
                                    You
                                  </span>
                                ) : (
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() =>
                                        setShowPasswordReset(user.id)
                                      }
                                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                                    >
                                      Reset Password
                                    </button>
                                    <button
                                      onClick={() => deleteUser(user.id)}
                                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                    All Invitations ({invitations.length})
                  </h3>

                  {/* Invitation Statistics */}
                  {invitations.length > 0 && (
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {invitations.length}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Total Invitations
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-yellow-600">
                          {
                            invitations.filter(
                              (inv) =>
                                !inv.usedAt &&
                                new Date(inv.expiresAt) >= new Date(),
                            ).length
                          }
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Pending
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-green-600">
                          {invitations.filter((inv) => inv.usedAt).length}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Accepted
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-red-600">
                          {
                            invitations.filter(
                              (inv) =>
                                !inv.usedAt &&
                                new Date(inv.expiresAt) < new Date(),
                            ).length
                          }
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Expired
                        </div>
                      </div>
                    </div>
                  )}

                  {invitations.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">
                      No invitations found.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Signup Link
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Created
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {invitations.map((invitation) => (
                            <tr key={invitation.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {editingInvitation === invitation.id ? (
                                  <input
                                    type="email"
                                    value={editFormData.email}
                                    onChange={(e) =>
                                      setEditFormData({
                                        ...editFormData,
                                        email: e.target.value,
                                      })
                                    }
                                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                  />
                                ) : (
                                  <a
                                    href={`mailto:${invitation.email}`}
                                    className="hover:text-blue-600 cursor-pointer underline"
                                  >
                                    {invitation.email}
                                  </a>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {editingInvitation === invitation.id ? (
                                  <select
                                    value={editFormData.role}
                                    onChange={(e) =>
                                      setEditFormData({
                                        ...editFormData,
                                        role: e.target.value as
                                          | "ADMIN"
                                          | "REVIEWER"
                                          | "AUTHOR",
                                      })
                                    }
                                    className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                  >
                                    <option value="AUTHOR">AUTHOR</option>
                                    <option value="REVIEWER">REVIEWER</option>
                                    <option value="ADMIN">ADMIN</option>
                                  </select>
                                ) : (
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                    {invitation.role}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    invitation.usedAt
                                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                      : new Date(invitation.expiresAt) <
                                          new Date()
                                        ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                                        : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                                  }`}
                                >
                                  {invitation.usedAt
                                    ? "USED"
                                    : new Date(invitation.expiresAt) <
                                        new Date()
                                      ? "EXPIRED"
                                      : "PENDING"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {!invitation.usedAt &&
                                new Date(invitation.expiresAt) >= new Date() ? (
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="text"
                                      value={`${typeof window !== "undefined" ? window.location.origin : "http://localhost:3010"}/auth/signup?invitation=${invitation.id}`}
                                      readOnly
                                      className="text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 w-64 font-mono"
                                    />
                                    <button
                                      onClick={() => {
                                        const link = `${typeof window !== "undefined" ? window.location.origin : "http://localhost:3010"}/auth/signup?invitation=${invitation.id}`;
                                        navigator.clipboard.writeText(link);
                                        alert(
                                          "Invitation link copied! Share it via email, Slack, or any messaging app.",
                                        );
                                      }}
                                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 cursor-pointer"
                                      title="Copy signup link"
                                    >
                                      Copy
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-xs">
                                    N/A
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {new Date(
                                  invitation.createdAt,
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  {editingInvitation === invitation.id ? (
                                    <>
                                      <button
                                        onClick={() =>
                                          updateInvitation(invitation.id)
                                        }
                                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 cursor-pointer"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={cancelEdit}
                                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      {!invitation.usedAt && (
                                        <>
                                          <button
                                            onClick={() =>
                                              startEditInvitation(invitation)
                                            }
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                                          >
                                            Edit
                                          </button>
                                          <button
                                            onClick={() =>
                                              resendInvitation(invitation.id)
                                            }
                                            disabled={
                                              resending === invitation.id
                                            }
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                          >
                                            {resending === invitation.id
                                              ? "Resending..."
                                              : "Resend"}
                                          </button>
                                        </>
                                      )}
                                      <button
                                        onClick={() =>
                                          deleteInvitation(invitation.id)
                                        }
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                                      >
                                        Delete
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
