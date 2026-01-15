"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Grader {
  id: string;
  name: string | null;
  email: string;
  role: string;
  gradeCount: number;
  createdAt: string;
}

export default function ManageGradersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [graders, setGraders] = useState<Grader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      fetchGraders();
    }
  }, [status, router]);

  const fetchGraders = async () => {
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
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/invite-grader", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, name: inviteName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to invite grader");
      }

      setSuccess(data.message);
      setInviteEmail("");
      setInviteName("");
      fetchGraders(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to invite grader");
    } finally {
      setInviting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 mb-2 inline-block"
          >
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manage Graders
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Invite new graders and manage existing ones
          </p>
        </div>

        {/* Invite Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Invite New Grader
            </h2>
          </div>
          <form onSubmit={handleInvite} className="p-6">
            {error && (
              <div className="mb-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded text-sm">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="grader@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name (Optional)
                </label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={inviting}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {inviting ? "Sending Invitation..." : "Send Invitation"}
            </button>
          </form>
        </div>

        {/* Graders List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Current Graders ({graders.length})
            </h2>
          </div>

          {graders.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              No graders invited yet
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {graders.map((grader) => (
                <li key={grader.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {grader.name || "No name"}
                        {grader.role === "ADMIN" && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            Admin
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {grader.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {grader.gradeCount}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        grades submitted
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
