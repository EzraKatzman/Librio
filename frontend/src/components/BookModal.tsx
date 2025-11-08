import { useState, useEffect } from 'react';

interface BookModalProps {
  book: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (updates: any) => void;
  onDelete: () => void;
}

const READ_STATUSES = [
  { value: 'unread', label: 'Unread' },
  { value: 'reading', label: 'In Progress' },
  { value: 'finished', label: 'Complete' }
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
          onMouseLeave={() => setHoveredRating(0)}  // Add this line
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const halfPoint = (rect.left + rect.right) / 2;
            handleStarClick(e.clientX < halfPoint ? starValue - 0.5 : starValue);
          }}
        >
          {/* Background star (gray) */}
          <svg className="w-6 h-6 text-border" fill="currentColor" viewBox="0 0 20 20">
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
        className="bg-white rounded-md shadow-xl max-w-2xl w-full p-6 flex gap-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Book Cover - Left Side */}
        <div className="shrink-0">
          {book.coverUrl ? (
            <img 
              src={book.coverUrl} 
              alt={book.title} 
              className="w-48 h-72 object-cover rounded-sm shadow-xs"
            />
          ) : (
            <div className="w-48 h-72 bg-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No Cover</span>
            </div>
          )}
        </div>

        {/* Book Details - Right Side */}
        <div className="flex-1 flex flex-col gap-4 text-left">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{book.title}</h2>
            <p className="text-gray-500">{book.author}</p>
          </div>

          {/* Genre Badges */}
          {book.genres && book.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {book.genres.map((genre: string, index: number) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-red-200 text-red-800 text-sm rounded-full font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Read Status */}
          <div className="space-y-2">
            <label htmlFor="readStatus" className="block text-sm font-semibold mb-2">
              Reading Progress
            </label>
            <div className="inline-flex bg-border/30 rounded-full gap-1">
              {READ_STATUSES.map((status) => {
                const isActive = readStatus === status.value;
              
                return (
                  <button
                    key={status.value}
                    onClick={() => setReadStatus(status.value)}
                    className={`
                      px-3 py-1 rounded-full text-sm font-medium transition-all cursor-pointer
                      ${isActive 
                        ? "bg-primary text-white" 
                        : "text-gray-700 hover:bg-red-200 hover:text-red-800"
                      }
                    `}
                  >
                    {status.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {renderStars()}
            </div>
            {rating > 0 && (
              <span className="text-sm text-gray-600">
                {rating}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-auto">
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors focus-ring-primary focus:ring-destructive/40 focus:bg-primary/90 cursor-pointer"
            >
              Save Changes
            </button>
            <button 
              onClick={onDelete}
              className="px-4 py-2 bg-destructive text-white rounded hover:bg-destructive/90 transition-colors focus-ring-primary focus:bg-destructive/90 cursor-pointer"
            >
              Delete
            </button>
            <button 
              onClick={onClose}
              className="absolute top-2 right-2 p-1 hover:bg-red-200 text-gray-500 hover:text-red-700 rounded-full transition-colors focus-ring-primary cursor-pointer"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
