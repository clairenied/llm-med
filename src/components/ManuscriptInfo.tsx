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
  pubmedUrl?: string;
  f1000Url?: string;
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
  return (
    <div>
      <h2 className="text-lg font-bold mb-4 leading-tight text-gray-900">{manuscript.title}</h2>
      
      <div className="space-y-2">
        {manuscript.authors.map((author) => (
          <div key={author.id}>
            <div className="text-sm text-gray-600 font-medium">{author.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
