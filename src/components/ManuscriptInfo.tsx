interface Author {
  id: string;
  name: string;
  email?: string;
  affiliation?: string;
}

interface Manuscript {
  id: string;
  title: string;
  abstract?: string;
  keywords: string[];
  status: 'DRAFT' | 'UNDER_REVIEW' | 'REVISED' | 'ACCEPTED' | 'REJECTED' | 'PUBLISHED';
  authors: Author[];
  createdAt: string;
}

interface ManuscriptInfoProps {
  manuscript: Manuscript;
}

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800',
  UNDER_REVIEW: 'bg-yellow-100 text-yellow-800',
  REVISED: 'bg-blue-100 text-blue-800',
  ACCEPTED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  PUBLISHED: 'bg-purple-100 text-purple-800',
};

export default function ManuscriptInfo({ manuscript }: ManuscriptInfoProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-3 leading-tight text-gray-900">{manuscript.title}</h2>
        
        <div className="flex items-center space-x-2 mb-4">
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[manuscript.status]}`}>
            {manuscript.status.replace('_', ' ')}
          </span>
          <span className="text-sm text-gray-500">
            {formatDate(manuscript.createdAt)}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Authors</h3>
        <div className="space-y-2">
          {manuscript.authors.length > 0 ? (
            manuscript.authors.map((author) => (
              <div key={author.id} className="text-sm">
                <div className="font-medium text-gray-900">{author.name}</div>
                {author.affiliation && (
                  <div className="text-gray-600 text-xs">{author.affiliation}</div>
                )}
                {author.email && (
                  <div className="text-blue-600 text-xs">{author.email}</div>
                )}
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">No authors listed</div>
          )}
        </div>
      </div>


    </div>
  );
}
