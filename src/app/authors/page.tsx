import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function AuthorsPage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const search = params.search || "";
  const limit = 10;
  const offset = (page - 1) * limit;

  // Build where clause for search
  const whereClause = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { affiliation: { contains: search, mode: "insensitive" as const } },
          { orcId: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  // Get total count and paginated authors
  const [totalCount, authors] = await Promise.all([
    prisma.author.count({ where: whereClause }),
    prisma.author.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { manuscripts: true },
        },
      },
      orderBy: {
        name: "asc",
      },
      skip: offset,
      take: limit,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 bg-gray-50 rounded-t-lg border-b">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Authors</h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {totalCount} total author{totalCount !== 1 ? "s" : ""}
              </div>
              <Link
                href="/authors/new"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Add Author</span>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center space-x-4">
            <form action="/authors" method="get" className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="Search authors..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </form>
            {totalPages > 1 && (
              <div className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </div>
            )}
          </div>
        </div>

        {authors.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-12 h-12 mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-gray-600">No authors found</p>
            {search && (
              <p className="text-sm text-gray-500 mt-2">
                Try a different search term or{" "}
                <Link
                  href="/authors"
                  className="text-blue-600 hover:text-blue-800"
                >
                  clear search
                </Link>
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Affiliation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Manuscripts
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {authors.map((author) => (
                    <tr key={author.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/authors/${author.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {author.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {author.email || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {author.affiliation || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {author._count.manuscripts}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(author.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                        <Link
                          href={`/authors/${author.id}/edit`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t rounded-b-lg">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {offset + 1} to{" "}
                    {Math.min(offset + limit, totalCount)} of {totalCount}{" "}
                    results
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    {hasPrevPage ? (
                      <Link
                        href={`/authors?page=${page - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                        className="px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                      >
                        Previous
                      </Link>
                    ) : (
                      <span className="px-3 py-2 text-sm font-medium rounded-md text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed">
                        Previous
                      </span>
                    )}

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => {
                          return (
                            p === 1 ||
                            p === totalPages ||
                            Math.abs(p - page) <= 1
                          );
                        })
                        .map((p, index, array) => {
                          const showEllipsis =
                            index > 0 && p - array[index - 1] > 1;

                          return (
                            <div key={p} className="flex items-center">
                              {showEllipsis && (
                                <span className="px-2 py-2 text-sm text-gray-500">
                                  ...
                                </span>
                              )}
                              <Link
                                href={`/authors?page=${p}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                                className={`px-3 py-2 text-sm font-medium rounded-md ${
                                  p === page
                                    ? "text-blue-600 bg-blue-50 border border-blue-300"
                                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                {p}
                              </Link>
                            </div>
                          );
                        })}
                    </div>

                    {/* Next Button */}
                    {hasNextPage ? (
                      <Link
                        href={`/authors?page=${page + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                        className="px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                      >
                        Next
                      </Link>
                    ) : (
                      <span className="px-3 py-2 text-sm font-medium rounded-md text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed">
                        Next
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
