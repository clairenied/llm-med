"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ManuscriptList from "@/components/ManuscriptList";
import SignInForm from "@/components/SignInForm";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect users based on role
  useEffect(() => {
    if (status === "loading") return;
    if (session?.user?.role === "GRADER") {
      router.push("/grading");
    } else if (session?.user?.role === "ADMIN") {
      router.push("/admin");
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

  // Show loading while redirecting based on role
  if (session.user?.role === "GRADER" || session.user?.role === "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <ManuscriptList />;
}
