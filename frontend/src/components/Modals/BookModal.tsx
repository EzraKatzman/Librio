import { useState, useEffect, useRef } from 'react';
import { useToast } from "../../context/ToastContext";
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

interface BookModalProps {
  book: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (updates: any) => void;
  onDelete: () => void;
}

const READ_STATUSES = [
  { value: 'unread', label: 'Unread' },
  { value: 'reading', label: 'Reading' },
  { value: 'finished', label: 'Finished' }
];

export default function BookModal({ book, isOpen, onClose, onEdit, onDelete }: BookModalProps) {
  const { showToast } = useToast();
  const [readStatus, setReadStatus] = useState(book.readStatus || 'unread');
  const [rating, setRating] = useState(book.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [highlightStyle, setHighlightStyle] = useState({ width: 0, left: 0 });
  const buttonRefs = useRef<HTMLButtonElement[]>([]);

  useEffect(() => {
    const index = READ_STATUSES.findIndex(s => s.value === readStatus);
    const button = buttonRefs.current[index];
    if (button) {
      setHighlightStyle({
        width: button.offsetWidth,
        left: button.offsetLeft,
      });
    }
  }, [readStatus]);

  useEffect(() => {
    if (isOpen) {
      setReadStatus(book.readStatus || 'unread');
      setRating(book.rating || 0);
      setHoveredRating(0);
    }
  }, [book, isOpen]);

  const handleSave = () => {
    const finalRating = hoveredRating || rating;
    onEdit({ readStatus, rating: finalRating });
    setRating(finalRating);
    setHoveredRating(0);
    showToast("Saved changes!", "success")
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    showToast('Book Deleted', 'error');
    onClose();
  };

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  useKeyboardShortcuts([
    { key: 'Escape', callback: onClose },
    { key: 's', ctrl: true, callback: handleSave },
    { key: 'Delete', callback: onDelete }
  ], isOpen);

  if (!isOpen) return null;

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
          <svg className="w-6 h-6 text-border/80 dark:text-border-light" fill="currentColor" viewBox="0 0 20 20">
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
        className="bg-background text-foreground rounded-md shadow-xl max-w-2xl w-full p-6 flex gap-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Book Cover - Left Side */}
        <div className="shrink-0">
          {book.coverUrl ? (
            <img 
              src={book.coverUrl} 
              alt={book.title} 
              className="w-48 h-72 object-cover rounded-sm shadow-xs mt-1"
            />
          ) : (
            <div className="w-48 h-72 bg-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No Cover</span>
            </div>
          )}
        </div>

        {/* Book Details - Right Side */}
        <div className="flex-1 flex flex-col gap-4 text-left">
          <div className="mb-1">
            <h2 className="text-2xl font-bold truncate">{book.title}</h2>
            <p className="text-foreground/70">{book.author}</p>
          </div>

          {/* Genre Badges */}
          {book.genres && book.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {book.genres.slice(0, 3).map((genre: string, index: number) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-red-200 dark:bg-red-300 text-red-800 dark:text-red-900 text-sm rounded-full font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Read Status */}
          <div className="space-y-2 mb-1 relative">
            <label htmlFor="readStatus" className="block text-sm font-semibold">
              Progress
            </label>
            <div className="relative inline-flex bg-border-light rounded-full">
              {/* Sliding highlight */}
              <div
                className="absolute top-0 h-full bg-primary rounded-full transition-all duration-300 ease-in-out"
                style={{
                  width: highlightStyle.width,
                  left: highlightStyle.left,
                }}
              />

              {READ_STATUSES.map((status, index) => {
                const isActive = readStatus === status.value;
                return (
                  <button
                    key={status.value}
                    ref={e => { buttonRefs.current[index] = e!}}
                    onClick={() => setReadStatus(status.value)}
                    className={`relative z-10 px-4 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors duration-300
                      ${isActive ? "text-white font-semibold" : "text-foreground/70 hover:text-foreground"}
                    `}
                  >
                    {status.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0">
              {renderStars()}
            </div>
            {rating > 0 && (
              <span className="text-sm font-semibold text-foreground/70">
                {rating}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 border-t border-border pt-4">
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-white rounded 
                hover:bg-primary/90 transition-colors 
                focus-ring-primary focus:ring-destructive/40 focus:bg-primary/90 cursor-pointer"
            >
              Save
            </button>
            <button 
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-border/30 dark:bg-border-light/40 text-foreground/80 
                hover:bg-destructive/10 hover:text-destructive rounded transition-colors 
                focus-ring-primary focus:bg-destructive/10 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              Delete
            </button>
            <button 
              onClick={onClose}
              className="absolute top-2 right-2 p-1 text-foreground/80
                hover:bg-destructive/10 hover:text-destructive rounded-full 
                transition-colors focus-ring-primary cursor-pointer"
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
