"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ManuscriptList from "@/components/ManuscriptList";
import SignInForm from "@/components/SignInForm";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect graders to grading page
  useEffect(() => {
    if (status === "loading") return;
    if (session?.user?.role === "GRADER") {
      router.push("/grading");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <SignInForm />;
  }

  // Show loading for graders while redirecting
  if (session.user?.role === "GRADER") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirecting to grading...</p>
        </div>
      </div>
    );
  }

  return <ManuscriptList />;
}
