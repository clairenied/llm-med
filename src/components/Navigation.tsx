"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Only show navigation items if user is authenticated
  const getNavItems = () => {
    if (!session) return [];

    const items = [
      { href: "/", label: "Manuscripts", icon: "📄" },
      { href: "/authors", label: "Authors", icon: "👤" },
    ];

    // Add admin routes for admin users
    if (session.user?.role === "ADMIN") {
      items.push({ href: "/admin", label: "Admin", icon: "⚙️" });
    }

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
              <div className="flex space-x-6">
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
          <div className="flex items-center space-x-4">
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
        </div>
      </div>
    </nav>
  );
}
