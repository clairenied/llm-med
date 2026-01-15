"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface OverallStats {
  totalReviews: number;
  reviewsWithNoGrades: number;
  reviewsWithOneGrade: number;
  reviewsComplete: number;
  totalGradesNeeded: number;
  totalGradesSubmitted: number;
  progressPercent: number;
}

interface GraderStat {
  id: string;
  name: string;
  email: string;
  gradeCount: number;
}

interface RecentActivity {
  id: string;
  graderName: string;
  manuscriptTitle: string;
  createdAt: string;
}

export default function ProgressReportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [overall, setOverall] = useState<OverallStats | null>(null);
  const [graderStats, setGraderStats] = useState<GraderStat[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      fetchProgress();
    }
  }, [status, router]);

  const fetchProgress = async () => {
    try {
      const response = await fetch("/api/grading/progress");
      if (!response.ok) {
        throw new Error("Failed to fetch progress");
      }
      const data = await response.json();
      setOverall(data.overall);
      setGraderStats(data.graderStats);
      setRecentActivity(data.recentActivity);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load progress");
    } finally {
      setLoading(false);
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/grading"
              className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 mb-2 inline-block"
            >
              ← Back to Grading Queue
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Grading Progress Report
            </h1>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {overall && (
          <>
            {/* Overall Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Overall Progress
                </h2>
              </div>
              <div className="p-6">
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {overall.totalGradesSubmitted} of {overall.totalGradesNeeded} grades submitted
                    </span>
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {overall.progressPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div
                      className="bg-emerald-600 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${overall.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatBox
                    label="Total Reviews"
                    value={overall.totalReviews}
                    subtitle="in database"
                  />
                  <StatBox
                    label="Need 2 Graders"
                    value={overall.reviewsWithNoGrades}
                    subtitle="0 grades yet"
                    color="red"
                  />
                  <StatBox
                    label="Need 1 Grader"
                    value={overall.reviewsWithOneGrade}
                    subtitle="1 grade done"
                    color="yellow"
                  />
                  <StatBox
                    label="Complete"
                    value={overall.reviewsComplete}
                    subtitle="2+ grades"
                    color="green"
                  />
                </div>
              </div>
            </div>

            {/* Grader Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Grader Leaderboard
                  </h2>
                </div>
                <div className="p-6">
                  {graderStats.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No grades submitted yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {graderStats.map((grader, index) => (
                        <div
                          key={grader.id}
                          className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                index === 0
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : index === 1
                                  ? "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                                  : index === 2
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                              }`}
                            >
                              {index + 1}
                            </span>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {grader.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {grader.email}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                              {grader.gradeCount}
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">grades</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Activity
                  </h2>
                </div>
                <div className="p-6">
                  {recentActivity.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No recent activity
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                        >
                          <p className="text-sm text-gray-900 dark:text-white">
                            <span className="font-medium">{activity.graderName}</span> graded
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {activity.manuscriptTitle}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {formatRelativeTime(activity.createdAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  subtitle,
  color = "gray",
}: {
  label: string;
  value: number;
  subtitle: string;
  color?: "gray" | "red" | "yellow" | "green";
}) {
  const colorClasses = {
    gray: "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600",
    red: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800",
    yellow: "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800",
    green: "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800",
  };

  const valueColors = {
    gray: "text-gray-900 dark:text-white",
    red: "text-red-700 dark:text-red-300",
    yellow: "text-yellow-700 dark:text-yellow-300",
    green: "text-green-700 dark:text-green-300",
  };

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      <p className={`text-3xl font-bold ${valueColors[color]}`}>{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
    </div>
  );
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
