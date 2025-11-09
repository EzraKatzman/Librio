import { useState, useRef, useEffect } from "react";

interface SortDropdownProps {
  currentSort: string;
  onSortChange: (sortBy: string) => void;
}

const SORT_OPTIONS = [
  { value: "date_desc", label: "Recently Added" },
  { value: "author_asc", label: "Author" },
  { value: "title_asc", label: "Title: A-Z" },
  { value: "title_desc", label: "Title: Z-A" },
  { value: "rating_desc", label: "Rating: High to Low" },
  { value: "rating_asc", label: "Rating: Low to High" }
];

export default function SortDropdown({ currentSort, onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  const handleSortSelect = (sortValue: string) => {
    onSortChange(sortValue);
    setIsOpen(false);
  };

  const currentSortLabel = SORT_OPTIONS.find(opt => opt.value === currentSort)?.label || "Sort";

  return (
    <div className="relative shrink min-w-0">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative py-2 px-4 rounded-lg bg-border-light hover:bg-border/30 text-primary focus-ring-primary cursor-pointer flex items-center gap-2 active:scale-95 transition-transform duration-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 transition-transform duration-500 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
        </svg>
        <span className="hidden lg:inline">{currentSortLabel}</span>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-0 top-full mt-2 w-56 bg-background text-foreground border border-border rounded-lg shadow-xl z-50 p-1 space-y-1"
        >
          {SORT_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => handleSortSelect(option.value)}
              className={`w-full flex justify-between text-left px-4 py-2.5 text-sm transition-colors cursor-pointer rounded-md ${
                currentSort === option.value
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground hover:bg-border/30"
              }`}
            >
              {option.label}
              {option.value === currentSort && (
                <span className="h-5 w-5 -mr-2 shrink-0">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
