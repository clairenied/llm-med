import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AuthorViewPage({ params }: PageProps) {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  const { id } = await params;

  const author = await prisma.author.findUnique({
    where: { id },
    include: {
      manuscripts: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!author) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'ACCEPTED':
        return 'bg-blue-100 text-blue-800';
      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      case 'REVISED':
        return 'bg-purple-100 text-purple-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Link
        href="/authors"
        className="text-blue-600 hover:text-blue-500 mb-4 inline-block"
      >
        ← Back to Authors
      </Link>

      <div className="bg-white rounded-lg shadow-sm">
        {/* Author Details */}
        <div className="p-6 bg-gray-50 rounded-t-lg border-b">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                {author.name}
              </h1>
              <div className="space-y-1 text-sm text-gray-600">
                {author.email && (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <a href={`mailto:${author.email}`} className="hover:text-blue-600">
                      {author.email}
                    </a>
                  </div>
                )}
                {author.affiliation && (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                    </svg>
                    <span>{author.affiliation}</span>
                  </div>
                )}
                {author.orcId && (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>ORCID: {author.orcId}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>Created: {formatDate(author.createdAt)}</span>
                </div>
              </div>
            </div>
            <Link
              href={`/authors/${author.id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Author
            </Link>
          </div>
        </div>

        {/* Manuscripts List */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Manuscripts ({author.manuscripts.length})
          </h2>

          {author.manuscripts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-600">No manuscripts found for this author</p>
            </div>
          ) : (
            <div className="space-y-4">
              {author.manuscripts.map((manuscript) => (
                <div
                  key={manuscript.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <Link
                      href={`/manuscripts/${manuscript.id}`}
                      className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                    >
                      {manuscript.title}
                    </Link>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(manuscript.status)}`}>
                      {manuscript.status.replace('_', ' ')}
                    </span>
                  </div>

                  {manuscript.abstract && (
                    <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                      {manuscript.abstract}
                    </p>
                  )}

                  {manuscript.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {manuscript.keywords.slice(0, 5).map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                      {manuscript.keywords.length > 5 && (
                        <span className="px-2 py-1 text-xs text-gray-500">
                          +{manuscript.keywords.length - 5} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Created: {formatDate(manuscript.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
