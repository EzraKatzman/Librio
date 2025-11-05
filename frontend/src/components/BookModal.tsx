import { useState, useEffect } from 'react';

interface BookModalProps {
  book: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (updates: any) => void;
  onDelete: () => void;
}

const READ_STATUSES = [
  { value: 'unread', label: 'Unread', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
  { value: 'reading', label: 'In Progress', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  { value: 'finished', label: 'Finished', color: 'bg-green-100 text-green-700 hover:bg-green-200' }
];

export default function BookModal({ book, isOpen, onClose, onEdit, onDelete }: BookModalProps) {
  const [readStatus, setReadStatus] = useState(book.readStatus || 'unread');
  const [rating, setRating] = useState(book.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    setReadStatus(book.readStatus || 'unread');
    setRating(book.rating || 0);
  }, [book]);

  if (!isOpen) return null;

  const handleSave = () => {
    // Use hoveredRating if it exists, otherwise use current rating
    const finalRating = hoveredRating || rating;
    onEdit({ readStatus, rating: finalRating });
    setRating(finalRating);
    setHoveredRating(0);
    onClose();
  };

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const starValue = i;
      const currentRating = hoveredRating || rating;
      const isFilled = currentRating >= starValue;
      const isHalfFilled = currentRating >= starValue - 0.5 && currentRating < starValue;

      stars.push(
        <div
          key={i}
          className="relative"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const halfPoint = (rect.left + rect.right) / 2;
            setHoveredRating(e.clientX < halfPoint ? starValue - 0.5 : starValue);
          }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const halfPoint = (rect.left + rect.right) / 2;
            handleStarClick(e.clientX < halfPoint ? starValue - 0.5 : starValue);
          }}
        >
          {/* Background star (gray) */}
          <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        
          {/* Filled star overlay */}
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{ 
              width: isHalfFilled ? '50%' : isFilled ? '100%' : '0%'
            }}
          >
            <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      );
    }
    return stars;
  };

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
          <p className="text-gray-600 mb-3">{book.author}</p>

          {/* Genre Badges */}
          {book.genres && book.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {book.genres.map((genre: string, index: number) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Read Status */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Reading Status</label>
            <div className="flex gap-2">
              {READ_STATUSES.map(status => (
                <button
                  key={status.value}
                  onClick={() => setReadStatus(status.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    readStatus === status.value 
                      ? status.color.replace('hover:', '') + ' ring-2 ring-offset-1 ring-current' 
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Star Rating */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Rating {rating > 0 && `(${rating}/5)`}
            </label>
            <div className="flex gap-1">
              {renderStars()}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-auto">
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-medium"
            >
              Save Changes
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
