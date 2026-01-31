"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Management */}
            <Link
              href="/admin/users"
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <span className="text-2xl">👥</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      User Management
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Manage users and send invitations
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Manage Graders */}
            <Link
              href="/admin/graders"
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-emerald-100 rounded-md flex items-center justify-center">
                      <span className="text-2xl">📝</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Manage Graders
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Invite graders and track progress
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
