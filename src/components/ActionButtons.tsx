interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onExport?: () => void;
  showCreate?: boolean;
  onCreate?: () => void;
}

export default function ActionButtons({ 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onExport, 
  showCreate = false,
  onCreate 
}: ActionButtonsProps) {
  return (
    <>
      {showCreate && onCreate && (
        <button
          onClick={onCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create New
        </button>
      )}
      
      {onEdit && (
        <button
          onClick={onEdit}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Edit
        </button>
      )}
      
      {onDuplicate && (
        <button
          onClick={onDuplicate}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Duplicate
        </button>
      )}
      
      {onExport && (
        <button
          onClick={onExport}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Export
        </button>
      )}
      
      {onDelete && (
        <button
          onClick={onDelete}
          className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Delete
        </button>
      )}
    </>
  );
}
