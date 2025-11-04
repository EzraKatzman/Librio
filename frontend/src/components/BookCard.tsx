interface BookCardProps {
  book: any;
  onClick: () => void;
}

export default function BookCard({ book, onClick }: BookCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group relative w-40 h-60 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
    >
      {/* Book Cover - static */}
      {book.coverUrl ? (
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
          <span className="text-gray-500">No Cover</span>
        </div>
      )}

      {/* Translucent overlay with details - slides up from bottom on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-0 group-hover:h-[40%] bg-black/25 backdrop-blur-sm transition-all duration-300 flex flex-col items-center justify-center gap-2 px-3 overflow-hidden">
        <h3 className="font-bold text-center text-sm line-clamp-2 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
          {book.title}
        </h3>
        <p className="text-xs text-center line-clamp-1 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
          {book.author}
        </p>
      </div>
    </div>
  );
}
