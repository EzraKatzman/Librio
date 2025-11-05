import { useState } from "react";

interface BookCardProps {
  book: any;
  onClick: () => void;
}

export default function BookCard({ book, onClick }: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onClick={onClick}
      className="group relative overflow-hidden cursor-pointer h-70 w-45"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Book Cover - static */}
      {book.coverUrl ? (
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
          <span className="text-gray-500">No Cover</span>
        </div>
      )}

      {isHovered && (
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-left">
            <h3 className="font-semibold text-lg mb-1">
              {book.title}
            </h3>
            <p className="text-sm text-white/90 mb-2">
              {book.author}
            </p>

            {/* Genre Badges */}
            {book.genres && book.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {book.genres.slice(0, 2).map((genre: string, index: number) => (
                  <span 
                    key={index}
                    className="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-xs"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
