import React, { useState, useRef, useEffect, useMemo } from "react";
import { useToast } from "../context/ToastContext";

interface FilterDropdownProps {
  onFilterChange: (filters: FilterOptions) => void;
  availableGenres: string[];
  currentFilters: FilterOptions;
  allBooks: any[]; // Add this prop
}

export interface FilterOptions {
  readStatus: string[];
  rating: number;
  genres: string[];
}

const READ_STATUSES = [
  { value: "unread", label: "Unread", color: "bg-neutral/90 text-white" },
  { value: "reading", label: "Reading", color: "bg-info text-white" },
  { value: "finished", label: "Finished", color: "bg-confirm text-white" }
];

export default function FilterDropdown({ onFilterChange, availableGenres, currentFilters, allBooks }: FilterDropdownProps) {
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  // Local state for draft filters
  const [readStatus, setReadStatus] = useState<string[]>(currentFilters.readStatus);
  const [rating, setRating] = useState<number>(currentFilters.rating);
  const [genres, setGenres] = useState<string[]>(currentFilters.genres);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Sync local state with current filters when they change externally
  useEffect(() => {
    setReadStatus(currentFilters.readStatus);
    setRating(currentFilters.rating);
    setGenres(currentFilters.genres);
  }, [currentFilters]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate preview count based on draft filters
  const previewCount = useMemo(() => {
    let filtered = [...allBooks];

    // Filter by read status
    if (readStatus.length > 0) {
      filtered = filtered.filter(book => 
        readStatus.includes(book.readStatus || "unread")
      );
    }

    // Filter by rating
    if (rating > 0) {
      filtered = filtered.filter(book => 
        book.rating && book.rating >= rating
      );
    }

    // Filter by genres
    if (genres.length > 0) {
      filtered = filtered.filter(book => 
        book.genres && book.genres.some((g: string) => genres.includes(g))
      );
    }

    return filtered.length;
  }, [allBooks, readStatus, rating, genres]);

  const toggleReadStatus = (status: string) => {
    setReadStatus(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const toggleGenre = (genre: string) => {
    setGenres(prev => 
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const clearFilters = () => {
    setReadStatus([]);
    setRating(0);
    setGenres([]);
    onFilterChange({ readStatus: [], rating: 0, genres: []});
    showToast("Filters cleared", "info");
  };

  const applyFilters = () => {
    onFilterChange({ readStatus, rating, genres });
    setIsOpen(false);
    const count = readStatus.length + (rating > 0 ? 1 : 0) + genres.length;
    if (count === 0) return;
    const filterText = count === 1 ? "Filter" : "Filters";
    showToast(`${count} ${filterText} applied`, "success");
  };

  const activeFilterCount = currentFilters.readStatus.length + (currentFilters.rating > 0 ? 1 : 0) + currentFilters.genres.length;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative py-2.5 px-4 rounded-lg bg-border/20 hover:bg-border/40 text-primary focus-ring-primary cursor-pointer active:scale-95 transition-transform duration-100"
      >
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
        >
          <line x1="12" y1="9" x2="12" y2="22" />
          <line x1="12" y1="2" x2="12" y2="5" />
          <line x1="5" y1="16" x2="5" y2="22" />
          <line x1="5" y1="2" x2="5" y2="12" />
          <line x1="19" y1="16" x2="19" y2="22" />
          <line x1="19" y1="2" x2="19" y2="12" />
          <line x1="16" y1="16" x2="22" y2="16" />
          <line x1="9" y1="9" x2="15" y2="9" />
          <line x1="2" y1="16" x2="8" y2="16" />
        </svg>
        {activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-0 top-full mt-2 w-96 bg-white border border-border rounded-lg shadow-xl z-50 flex flex-col max-h-[80vh]"
        >
          <div className="relative border-b border-border py-4">
            <span className="text-md font-semibold block text-center">Filters</span>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-700 hover:text-destructive rounded-full transition-colors focus-ring-primary cursor-pointer"
              >
              <svg 
                className="h-5 w-5"
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
          {/* Scrollable Content */}
          <div className="overflow-y-auto p-4 space-y-4">
            {/* Read Status Pills */}
            <div className="border-b border-border pb-4">
              <label className="block text-sm font-semibold mb-3">Progress</label>
              <div className="flex flex-wrap gap-2">
                {READ_STATUSES.map(status => (
                  <button
                    key={status.value}
                    onClick={() => toggleReadStatus(status.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                      readStatus.includes(status.value)
                        ? status.color
                        : "bg-border/20 text-foreground hover:bg-border/40"
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Slider */}
            <div className="border-b border-border pb-4">
              <label className="block text-sm font-semibold mb-1">
                Rating {rating > 0 && `(${rating}+)`}
              </label>
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type="range"
                    min={0}
                    max={5}
                    step={0.5}
                    value={rating}
                    onChange={(e) => setRating(parseFloat(e.target.value))}
                    className="primary w-full h-2 rounded-lg appearance-none"
                    style={{
                      "--fill-percent": `${(rating / 5) * 100}%`,
                      "--fill-color": "rgb(59 130 246)", // Tailwind primary color (#3b82f6)
                    } as React.CSSProperties}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Any</span>
                  <span>1★</span>
                  <span>2★</span>
                  <span>3★</span>
                  <span>4★</span>
                  <span>5★</span>
                </div>
              </div>
            </div>

            {/* Genre Pills */}
            {availableGenres.length > 0 && (
              <div>
                <label className="block text-sm font-semibold mb-3">Genres</label>
                <div className="flex flex-wrap gap-2">
                  {availableGenres.map(genre => (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                        genres.includes(genre)
                          ? "bg-red-200 text-red-800"
                          : "bg-border/20 text-foreground hover:bg-border/40"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer with Clear and Apply buttons */}
          <div className="border-t border-border p-4 bg-card rounded-b-lg flex items-center justify-between gap-3">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-destructive transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={readStatus.length === 0 && rating === 0 && genres.length === 0}
            >
              Clear
            </button>
            <button
              onClick={applyFilters}
              className="flex-1 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              {readStatus.length === 0 && rating === 0 && genres.length === 0
                ? "See all results"
                : `See ${previewCount} ${previewCount === 1 ? "result" : "results"}`}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider-thumb::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
