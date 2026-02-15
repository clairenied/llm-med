"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ReviewData {
  id: string;
  reviewerName: string;
  reviewType: string;
  gradeCount: number;
  hasUserGraded: boolean;
  createdAt: string;
}

interface VersionData {
  versionNumber: number;
  reviews: ReviewData[];
}

interface ManuscriptGroup {
  manuscriptId: string;
  manuscriptTitle: string;
  externalUrl: string | null;
  versions: VersionData[];
  totalReviews: number;
  ungradedByUser: number;
  hasAiSummary: boolean;
}

interface GradingStats {
  totalReviews: number;
  reviewsWithNoGrades: number;
  reviewsWithOneGrade: number;
  reviewsComplete: number;
  userGradedCount: number;
  manuscriptsToGrade: number;
}

interface PaginationData {
  page: number;
  limit: number;
  totalManuscripts: number;
  totalPages: number;
}

const PAGE_SIZE_OPTIONS = [20, 50, 100];

export default function GradingQueuePage() {
  const { status } = useSession();
  const router = useRouter();
  const [manuscripts, setManuscripts] = useState<ManuscriptGroup[]>([]);
  const [stats, setStats] = useState<GradingStats | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedManuscripts, setExpandedManuscripts] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      fetchReviews();
    }
  }, [status, router, page, limit]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/grading/queue?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      setManuscripts(data.manuscripts);
      setStats(data.stats);
      setPagination(data.pagination);
      // Auto-expand first manuscript
      if (data.manuscripts.length > 0) {
        setExpandedManuscripts(new Set([data.manuscripts[0].manuscriptId]));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setExpandedManuscripts(new Set());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    setExpandedManuscripts(new Set());
  };

  const toggleManuscript = (manuscriptId: string) => {
    setExpandedManuscripts((prev) => {
      const next = new Set(prev);
      if (next.has(manuscriptId)) {
        next.delete(manuscriptId);
      } else {
        next.add(manuscriptId);
      }
      return next;
    });
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
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-md transition-colors text-center flex-shrink-0"
          >
            View Progress Report
          </Link>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
            <StatCard label="Total Reviews" value={stats.totalReviews} />
            <StatCard label="Need 2 Graders" value={stats.reviewsWithNoGrades} color="red" />
            <StatCard label="Need 1 Grader" value={stats.reviewsWithOneGrade} color="yellow" />
            <StatCard label="Complete" value={stats.reviewsComplete} color="green" />
            <StatCard label="Your Grades" value={stats.userGradedCount} color="blue" />
            <StatCard label="Papers to Review" value={stats.manuscriptsToGrade} color="purple" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">How to Grade</h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>Papers are grouped with their reviews organized by version (v1, v2, etc.)</li>
            <li>Grade reviews in version order to understand how the manuscript evolved</li>
            <li>Click a paper to expand and see all reviews for all versions</li>
            <li>Use &quot;View Manuscript&quot; to read the full paper content</li>
          </ul>
        </div>

        {/* Pagination Controls - Top */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Show:</span>
              <select
                value={limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size} per page
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {((page - 1) * limit) + 1}-{Math.min(page * limit, pagination.totalManuscripts)} of {pagination.totalManuscripts} papers
            </div>
          </div>
        )}

        {/* Manuscripts List */}
        <div className="space-y-4">
          {manuscripts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              No reviews available for grading at this time.
            </div>
          ) : (
            manuscripts.map((manuscript) => (
              <ManuscriptCard
                key={manuscript.manuscriptId}
                manuscript={manuscript}
                isExpanded={expandedManuscripts.has(manuscript.manuscriptId)}
                onToggle={() => toggleManuscript(manuscript.manuscriptId)}
              />
            ))
          )}
        </div>

        {/* Pagination Controls - Bottom */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="hidden sm:flex items-center gap-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 2)
                .map((p, idx, arr) => (
                  <span key={p} className="flex items-center gap-2">
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(p)}
                      className={`w-10 h-10 rounded-md font-medium transition-colors ${
                        p === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
            </div>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.totalPages}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ManuscriptCard({
  manuscript,
  isExpanded,
  onToggle,
}: {
  manuscript: ManuscriptGroup;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border-l-4 ${
      manuscript.ungradedByUser > 0 ? "border-l-emerald-500" : "border-l-gray-300 dark:border-l-gray-600"
    }`}>
      {/* Header - Clickable */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors group"
      >
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-center gap-3">
            <span className={`text-lg flex-shrink-0 transition-colors ${
              isExpanded ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-600"
            }`}>{isExpanded ? "▼" : "▶"}</span>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                {manuscript.manuscriptTitle}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {manuscript.versions.length} version{manuscript.versions.length !== 1 ? "s" : ""} &middot;{" "}
                {manuscript.totalReviews} review{manuscript.totalReviews !== 1 ? "s" : ""} to grade
                {manuscript.ungradedByUser > 0 && (
                  <span className="ml-2 text-emerald-600 dark:text-emerald-400 font-medium">
                    ({manuscript.ungradedByUser} new)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
          {!manuscript.hasAiSummary && (
            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded whitespace-nowrap">
              No Summary
            </span>
          )}
          {manuscript.externalUrl ? (
            <a
              href={manuscript.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hidden sm:flex text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors items-center gap-1 whitespace-nowrap"
            >
              View manuscript ↗
            </a>
          ) : (
            <Link
              href={`/manuscripts/${manuscript.manuscriptId}`}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="hidden sm:flex text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors items-center gap-1 whitespace-nowrap"
            >
              View internal ↗
            </Link>
          )}
          <span className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
            isExpanded
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
              : "bg-emerald-600 text-white group-hover:bg-emerald-700"
          }`}>
            {isExpanded ? "Grading..." : "Grade Reviews"}
          </span>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {manuscript.versions.map((version) => (
            <div key={version.versionNumber} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
              {/* Version Header */}
              <div className="px-6 py-2 bg-gray-50 dark:bg-gray-700/50">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Version {version.versionNumber}
                  <span className="ml-2 font-normal text-gray-500 dark:text-gray-400">
                    ({version.reviews.length} review{version.reviews.length !== 1 ? "s" : ""})
                  </span>
                </h4>
              </div>

              {/* Reviews for this version */}
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {version.reviews.map((review) => (
                  <li key={review.id} className="px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 ${
                            review.reviewType === "INTERNAL" ? "bg-purple-500" : "bg-gray-500"
                          }`}
                        >
                          {review.reviewerName.charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {review.reviewerName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {review.reviewType === "INTERNAL" ? "Internal" : "External"} Reviewer
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-11 sm:ml-0">
                        <GradeStatus count={review.gradeCount} />
                        {!review.hasUserGraded ? (
                          <Link
                            href={`/grading/${review.id}`}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors"
                          >
                            Grade
                          </Link>
                        ) : (
                          <Link
                            href={`/grading/${review.id}`}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                          >
                            Edit Grade
                          </Link>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
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
    purple: "bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100",
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
