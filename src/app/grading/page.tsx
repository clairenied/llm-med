"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ReviewToGrade {
  id: string;
  manuscriptTitle: string;
  reviewerName: string;
  gradeCount: number;
  hasUserGraded: boolean;
  createdAt: string;
}

interface GradingStats {
  totalReviews: number;
  reviewsWithNoGrades: number;
  reviewsWithOneGrade: number;
  reviewsComplete: number;
  userGradedCount: number;
}

export default function GradingQueuePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewToGrade[]>([]);
  const [stats, setStats] = useState<GradingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      fetchReviews();
    }
  }, [status, router]);

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/grading/queue");
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      setReviews(data.reviews);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews");
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Review Grading
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Grade peer reviews to help train the AI reviewer. Each review needs 2 graders.
            </p>
          </div>
          <Link
            href="/grading/progress"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-md transition-colors"
          >
            View Progress Report
          </Link>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <StatCard label="Total Reviews" value={stats.totalReviews} />
            <StatCard label="Need 2 Graders" value={stats.reviewsWithNoGrades} color="red" />
            <StatCard label="Need 1 Grader" value={stats.reviewsWithOneGrade} color="yellow" />
            <StatCard label="Complete" value={stats.reviewsComplete} color="green" />
            <StatCard label="Your Grades" value={stats.userGradedCount} color="blue" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Reviews List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Reviews Needing Grades
            </h2>
          </div>

          {reviews.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              No reviews available for grading at this time.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {reviews.map((review) => (
                <li key={review.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {review.manuscriptTitle}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Reviewed by: {review.reviewerName}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <GradeStatus count={review.gradeCount} />
                      {!review.hasUserGraded && (
                        <Link
                          href={`/grading/${review.id}`}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors"
                        >
                          Grade
                        </Link>
                      )}
                      {review.hasUserGraded && (
                        <span className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-md">
                          Graded
                        </span>
                      )}
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

function StatCard({ label, value, color = "gray" }: { label: string; value: number; color?: string }) {
  const colorClasses = {
    gray: "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white",
    red: "bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100",
    yellow: "bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100",
    green: "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100",
    blue: "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100",
  };

  return (
    <div className={`rounded-lg p-4 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm opacity-80">{label}</p>
    </div>
  );
}

function GradeStatus({ count }: { count: number }) {
  if (count >= 2) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        Complete ({count}/2)
      </span>
    );
  }
  if (count === 1) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
        {count}/2 grades
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
      Needs grading
    </span>
  );
}
