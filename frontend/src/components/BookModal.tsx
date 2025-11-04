interface BookModalProps {
  book: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function BookModal({ book, isOpen, onClose, onEdit, onDelete }: BookModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 flex gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Book Cover - Left Side */}
        <div className="shrink-0">
          {book.coverUrl ? (
            <img 
              src={book.coverUrl} 
              alt={book.title} 
              className="w-48 h-72 object-cover rounded-lg shadow-md"
            />
          ) : (
            <div className="w-48 h-72 bg-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No Cover</span>
            </div>
          )}
        </div>

        {/* Book Details - Right Side */}
        <div className="flex-1 flex flex-col">
          <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
          <p className="text-gray-600 mb-6">{book.author}</p>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-auto">
            <button 
              onClick={onEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Edit
            </button>
            <button 
              onClick={onDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors ml-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
