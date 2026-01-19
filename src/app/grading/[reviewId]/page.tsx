"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface ReviewData {
  id: string;
  content: string;
  reviewerName: string;
  reviewType: string;
  versionNumber: number;
  manuscript: {
    id: string;
    title: string;
    abstract: string | null;
    aiSummary: string | null;
    externalUrl: string | null;
  };
  existingGrade: GradeData | null;
}

interface GradeData {
  clinicalRelevance: string | null;
  methodology: string | null;
  results: string | null;
  writingClarity: string | null;
  ethicalConsiderations: string | null;
  notes: string | null;
}

const GRADE_OPTIONS = [
  { value: "VERY_GOOD", label: "Very Good", score: 4 },
  { value: "GOOD", label: "Good", score: 3 },
  { value: "POOR", label: "Poor", score: 2 },
  { value: "VERY_POOR", label: "Very Poor", score: 1 },
  { value: "NA", label: "N/A", score: null },
];

const GRADING_DOMAINS = [
  {
    key: "clinicalRelevance",
    label: "Clinical Relevance",
    description: "How well does the review address the clinical significance and applicability of the research?",
  },
  {
    key: "methodology",
    label: "Methodology",
    description: "How thoroughly does the review evaluate the study design, data sources, and methods?",
  },
  {
    key: "results",
    label: "Results",
    description: "How well does the review assess the reported findings and their alignment with stated objectives?",
  },
  {
    key: "writingClarity",
    label: "Writing Clarity",
    description: "How well does the review address the clarity of the manuscript's writing?",
  },
  {
    key: "ethicalConsiderations",
    label: "Ethical Considerations",
    description: "How well does the review address ethical aspects (consent, privacy, compliance)?",
  },
];

export default function GradingFormPage({ params }: { params: Promise<{ reviewId: string }> }) {
  const { reviewId } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [review, setReview] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [grades, setGrades] = useState<Record<string, string>>({
    clinicalRelevance: "",
    methodology: "",
    results: "",
    writingClarity: "",
    ethicalConsiderations: "",
  });
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated" && reviewId) {
      fetchReview();
    }
  }, [status, reviewId, router]);

  const fetchReview = async () => {
    try {
      const response = await fetch(`/api/grading/${reviewId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch review");
      }
      const data = await response.json();
      setReview(data.review);

      // If user already graded, populate the form
      if (data.review.existingGrade) {
        const existing = data.review.existingGrade;
        setGrades({
          clinicalRelevance: existing.clinicalRelevance || "",
          methodology: existing.methodology || "",
          results: existing.results || "",
          writingClarity: existing.writingClarity || "",
          ethicalConsiderations: existing.ethicalConsiderations || "",
        });
        setNotes(existing.notes || "");
      }

      // If no AI summary, generate one
      if (!data.review.manuscript.aiSummary) {
        generateSummary(data.review.manuscript.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load review");
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async (manuscriptId: string) => {
    setSummaryLoading(true);
    try {
      const response = await fetch(`/api/summaries/${manuscriptId}`);
      if (response.ok) {
        const data = await response.json();
        setReview((prev) =>
          prev
            ? {
                ...prev,
                manuscript: { ...prev.manuscript, aiSummary: data.summary },
              }
            : null
        );
      }
    } catch (err) {
      console.error("Failed to generate summary:", err);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleGradeChange = (domain: string, value: string) => {
    setGrades((prev) => ({ ...prev, [domain]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // Validate all grades are selected
    const emptyGrades = GRADING_DOMAINS.filter((d) => !grades[d.key]);
    if (emptyGrades.length > 0) {
      setError(`Please select a grade for: ${emptyGrades.map((d) => d.label).join(", ")}`);
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/grading/${reviewId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grades, notes }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit grade");
      }

      setSuccess(true);
      setTimeout(() => router.push("/grading"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit grade");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-red-600">Review not found</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Grade Submitted!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Redirecting to grading queue...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              href="/grading"
              className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 mb-2 inline-block"
            >
              ← Back to Queue
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Grade Review
            </h1>
          </div>
        </div>

        {/* Manuscript and Version Context */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-medium rounded">
                  Version {review.versionNumber}
                </span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                  review.reviewType === "INTERNAL"
                    ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}>
                  {review.reviewType === "INTERNAL" ? "Internal" : "External"} Review
                </span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {review.manuscript.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Reviewer: {review.reviewerName}
              </p>
            </div>
            {review.manuscript.externalUrl ? (
              <a
                href={review.manuscript.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-2"
              >
                <span>View Full Manuscript</span>
                <span className="text-lg">↗</span>
              </a>
            ) : (
              <Link
                href={`/manuscripts/${review.manuscript.id}`}
                target="_blank"
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-2"
              >
                <span>View Internal Record</span>
                <span className="text-lg">↗</span>
              </Link>
            )}
          </div>
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-700">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Tip:</strong> The review may reference specific parts of the manuscript (e.g., &quot;First paragraph, second line&quot;).
              Open the full manuscript to follow along.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Review and Summary */}
          <div className="space-y-6">
            {/* AI Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  AI-Generated Manuscript Summary
                </h3>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                {summaryLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-gray-500 dark:text-gray-400">
                      Generating summary...
                    </div>
                  </div>
                ) : review.manuscript.aiSummary ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                    <ReactMarkdown>{review.manuscript.aiSummary}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-gray-500 dark:text-gray-400 italic">
                    No summary available. Using abstract instead.
                    {review.manuscript.abstract && (
                      <p className="mt-2 text-gray-700 dark:text-gray-300">
                        {review.manuscript.abstract}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Review Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Peer Review Content
                </h3>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                  {review.content}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Grading Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Grade This Review
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              {GRADING_DOMAINS.map((domain) => (
                <div key={domain.key}>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {domain.label}
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {domain.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {GRADE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleGradeChange(domain.key, option.value)}
                        className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                          grades[domain.key] === option.value
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-emerald-500"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Any additional comments about this review..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Submitting..." : "Submit Grade"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
