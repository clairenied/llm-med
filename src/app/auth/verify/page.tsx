"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Get callbackUrl for redirect
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Redirect if already signed in
  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      // Redirect based on role
      if (session.user?.role === "GRADER") {
        router.push("/grading");
      } else if (session.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push(callbackUrl);
      }
    }
  }, [session, status, router, callbackUrl]);

  // Get token and email from params
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // Show loading while checking session or if already signed in (will redirect)
  if (status === "loading" || session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {session ? "Redirecting..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  const handleSignIn = () => {
    if (!token || !email) {
      setError("Invalid sign-in link. Please request a new one.");
      return;
    }

    setIsLoading(true);

    // Build the NextAuth callback URL and redirect
    const nextAuthCallback = new URL("/api/auth/callback/resend", window.location.origin);
    nextAuthCallback.searchParams.set("token", token);
    nextAuthCallback.searchParams.set("email", email);
    nextAuthCallback.searchParams.set("callbackUrl", callbackUrl);

    // Redirect to NextAuth callback to complete sign-in
    window.location.href = nextAuthCallback.toString();
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md w-full mx-4 bg-white dark:bg-gray-800 py-8 px-6 shadow-lg rounded-lg text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Invalid Sign-In Link
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This sign-in link is invalid or has expired. Please request a new one.
          </p>
          <a
            href="/auth/signin"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full mx-4 bg-white dark:bg-gray-800 py-8 px-6 shadow-lg rounded-lg text-center">
        <div className="text-6xl mb-4">📚</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          LLM-Med Review Tracker
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Sign in as
        </p>
        <p className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          {email}
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded text-sm mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full py-3 px-6 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Signing in...
            </span>
          ) : (
            "Click to Sign In"
          )}
        </button>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          This extra step protects your sign-in link from being used by email security scanners.
        </p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
