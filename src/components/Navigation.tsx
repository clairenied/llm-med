"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide navigation on auth pages
  if (pathname?.startsWith("/auth/")) {
    return null;
  }

  // Only show navigation items if user is authenticated
  const getNavItems = () => {
    if (!session) return [];

    const role = session.user?.role;

    // Graders only see grading interface
    if (role === "GRADER") {
      return [{ href: "/grading", label: "Grading", icon: "📝" }];
    }

    // Admin: Admin first, then grading, then the rest
    if (role === "ADMIN") {
      return [
        { href: "/admin", label: "Admin", icon: "⚙️" },
        { href: "/grading", label: "Grading", icon: "📝" },
        { href: "/", label: "Manuscripts", icon: "📄" },
        { href: "/authors", label: "Authors", icon: "👤" },
      ];
    }

    // Other roles
    const items = [
      { href: "/", label: "Manuscripts", icon: "📄" },
      { href: "/authors", label: "Authors", icon: "👤" },
    ];

    return items;
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
            >
              📚 LLM-Med Review Tracker
            </Link>
            {navItems.length > 0 && (
              <div className="hidden md:flex space-x-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {status === "loading" ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{session.user.email}</span>
                  <span className="ml-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                    {session.user.role}
                  </span>
                </div>
                <Link
                  href="/profile"
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <button
                  onClick={() => signIn()}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-4 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
          {status === "loading" ? (
            <div className="text-sm text-gray-500 dark:text-gray-400 px-3 py-2">
              Loading...
            </div>
          ) : session ? (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2">
              <div className="text-sm text-gray-700 dark:text-gray-300 px-3">
                <span className="font-medium">{session.user.email}</span>
                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  {session.user.role}
                </span>
              </div>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={() => { signOut(); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => { signIn(); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
