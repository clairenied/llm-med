"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
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
  }, [session, status, router]);

  if (status === "loading") {
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage users and system data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Management */}
            <Link
              href="/admin/users"
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-emerald-100 rounded-md flex items-center justify-center">
                      <span className="text-2xl">👥</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      User Management
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Invite users, manage roles, and send communications
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Import Data */}
            <Link
              href="/import"
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <span className="text-2xl">📥</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Import Data
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Upload manuscripts and data
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Grading Mode Toggle */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              AI Review Grading
            </h2>
            <div className="space-y-4">
              <GradingModeToggle />
              <AiReviewGeneration />
            </div>
          </div>

          {/* Data Management */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Data Management
            </h2>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    if (
                      confirm(
                        "This will scrape new articles from F1000Research. Continue?",
                      )
                    ) {
                      fetch("/api/admin/scrape", { method: "POST" })
                        .then((res) => res.json())
                        .then((data) =>
                          alert(data.message || "Scraping completed"),
                        )
                        .catch((err) =>
                          alert("Scraping failed: " + err.message),
                        );
                    }
                  }}
                  className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-bold rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors cursor-pointer"
                >
                  Scrape New Articles
                </button>
                <Link
                  href="/admin/delete-articles"
                  className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-bold rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Delete Articles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AiReviewGeneration() {
  const [status, setStatus] = useState<{
    totalManuscripts: number;
    manuscriptsWithAiReview: number;
    remaining: number;
  } | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch("/api/admin/generate-ai-reviews")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => {});
  }, []);

  const triggerGeneration = async () => {
    if (!confirm("Generate AI reviews for all manuscripts without one? This will call DeepSeek for each paper.")) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/generate-ai-reviews", { method: "POST" });
      const data = await res.json();
      alert(data.message || "Generation queued");
    } catch {
      alert("Failed to trigger generation");
    } finally {
      setGenerating(false);
    }
  };

  const refreshStatus = () => {
    fetch("/api/admin/generate-ai-reviews")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => {});
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            AI Review Generation Status
          </p>
          {status ? (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold text-green-600 dark:text-green-400">{status.manuscriptsWithAiReview}</span>
              {" / "}
              <span className="font-semibold">{status.totalManuscripts}</span>
              {" papers have AI reviews"}
              {status.remaining > 0 && (
                <span className="text-yellow-600 dark:text-yellow-400 ml-2">
                  ({status.remaining} remaining)
                </span>
              )}
            </p>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={refreshStatus}
            className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer"
          >
            Refresh
          </button>
          <button
            onClick={triggerGeneration}
            disabled={generating || (status?.remaining === 0)}
            className="px-5 py-2.5 rounded-md text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            {generating ? "Queuing..." : "Generate AI Reviews"}
          </button>
        </div>
      </div>
    </div>
  );
}

function GradingModeToggle() {
  const [mode, setMode] = useState<"HUMAN" | "AI" | null>(null);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings?key=GRADING_MODE")
      .then((r) => r.json())
      .then((data) => setMode(data.setting?.value || "HUMAN"))
      .catch(() => setMode("HUMAN"));
  }, []);

  const toggle = async () => {
    const newMode = mode === "HUMAN" ? "AI" : "HUMAN";
    const confirmMsg =
      newMode === "AI"
        ? "Switch to AI mode? Graders will only see AI-generated reviews."
        : "Switch back to Human mode? Graders will see the original peer reviews.";
    if (!confirm(confirmMsg)) return;

    setSwitching(true);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "GRADING_MODE", value: newMode }),
      });
      setMode(newMode);
    } catch {
      alert("Failed to update grading mode");
    } finally {
      setSwitching(false);
    }
  };

  if (mode === null) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Controls what graders see in their queue
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {mode === "HUMAN" ? (
              <>Human Reviews <span className="text-sm font-normal text-gray-500">(original peer reviews)</span></>
            ) : (
              <>AI Reviews <span className="text-sm font-normal text-gray-500">(DeepSeek-generated reviews)</span></>
            )}
          </p>
        </div>
        <button
          onClick={toggle}
          disabled={switching}
          className={`px-5 py-2.5 rounded-md text-sm font-bold transition-colors cursor-pointer disabled:opacity-50 ${
            mode === "HUMAN"
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          {switching
            ? "Switching..."
            : mode === "HUMAN"
              ? "Switch to AI Mode"
              : "Switch to Human Mode"}
        </button>
      </div>
    </div>
  );
}
