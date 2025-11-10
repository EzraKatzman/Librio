import { useState } from "react";

interface BookCardProps {
  book: any;
  onClick: () => void;
}

const STATUS_INFO: { [key: string]: { label: string; color: string } } = {
  unread: { label: "Unread", color: "bg-neutral/90 text-white" },
  reading: { label: "Reading", color: "bg-info text-white" },
  finished: { label: "Finished", color: "bg-confirm text-white" },
};

export default function BookCard({ book, onClick }: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const readStatus = book.readStatus || 'unread';
  const statusInfo = STATUS_INFO[readStatus as keyof typeof STATUS_INFO] || STATUS_INFO['unread'];

  return (
    <div 
      onClick={onClick}
      className="group relative overflow-hidden cursor-pointer h-67.5 w-45 rounded-sm"
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
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/55 to-transparent transition-opacity">
          <div className="absolute top-3 right-3">
            <span className={`inline-block px-2 py-1 backrop-blur-md rounded text-xs font-medium ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-left">
            <h3 className="font-semibold leading-5 text-lg mb-1">
              {book.title}
            </h3>
            <p className="text-sm text-background/80 dark:text-foreground/80 mb-2">
              {book.author}
            </p>

            {/* Genre Badges */}
            {book.genres && book.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {book.genres.slice(0, 1).map((genre: string, index: number) => (
                  <span 
                    key={index}
                    className="inline-block px-2 py-1 bg-border/20 dark:bg-border-orig/20 backdrop-blur-md rounded text-xs"
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
