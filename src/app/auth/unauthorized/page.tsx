import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 py-8 px-6 shadow rounded-lg text-center">
        <div className="text-yellow-600 dark:text-yellow-400 text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You don&apos;t have permission to access this page. Please contact an administrator if you believe this is an error.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
