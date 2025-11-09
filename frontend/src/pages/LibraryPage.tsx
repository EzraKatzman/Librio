import { useState, useEffect, useMemo, useRef } from "react";
import { useBooksStore } from "../store/useBooksStore";
import BookList from "../components/BookList";
import SearchBar from "../components/SearchBar";
import FilterDropdown, { type FilterOptions } from "../components/FilterDropdown";
import SortDropdown from "../components/SortDropdown";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

export default function LibraryPage() {
  const { books, loadBooks, deleteBook, addBook } = useBooksStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    readStatus: [],
    rating: 0,
    genres: []
  });

  const [sortBy, setSortBy] = useState("date_desc");
  const [isbn, setIsbn] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = async () => {
    if (!isbn) return;
    await addBook(isbn);
    setIsbn("");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBooks(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, loadBooks]);

  // Get unique genres from all books
  const availableGenres = useMemo(() => {
    const genreSet = new Set<string>();
    books.forEach(book => {
      if (book.genres) {
        book.genres.forEach(genre => genreSet.add(genre));
      }
    });
    return Array.from(genreSet).sort();
  }, [books]);

  // Apply filters and sorting
  const filteredBooks = useMemo(() => {
    let filtered = [...books];

    // Filter by read status
    if (filters.readStatus.length > 0) {
      filtered = filtered.filter(book => 
        filters.readStatus.includes(book.readStatus || "unread")
      );
    }

    // Filter by rating
    if (filters.rating > 0) {
      filtered = filtered.filter(book => 
        book.rating && book.rating >= filters.rating
      );
    }

    // Filter by genres (union - book must have at least one selected genre)
    if (filters.genres.length > 0) {
      filtered = filtered.filter(book => 
        book.genres && book.genres.some(g => filters.genres.includes(g))
      );
    }

    // Sort
    switch (sortBy) {
      case "title_asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title_desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "author_asc":
        filtered.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case "rating_desc":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "rating_asc":
        filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case "date_desc":
        filtered.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        break;
    }

    return filtered;
  }, [books, filters, sortBy]);

  useKeyboardShortcuts([
    { key: '/', ctrl: true, 
      callback: () => {
        searchInputRef.current?.focus();
      }
    },
    { key: 'a', ctrl: true, callback: () => {/*Open add book modal*/}},
  ], !isModalOpen);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">My Library</h1>
              <p className="mt-1 text-sm text-gray-500">
                {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"} 
                {filteredBooks.length !== books.length && ` (filtered from ${books.length})`}
              </p>
            </div>
          </div>
        </div>
      </header>
      
      {/* Search and Filters */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <SearchBar
                ref={searchInputRef}
                value={searchQuery}
                onChange={setSearchQuery}
              />
              <FilterDropdown 
                onFilterChange={setFilters}
                availableGenres={availableGenres}
                currentFilters={filters}
                allBooks={books}
              />
              <SortDropdown
                currentSort={sortBy}
                onSortChange={setSortBy}
              />
            </div>
            <div className="flex items-center">
              <button onClick={handleAdd} 
                className="px-4 py-2 mr-4 rounded-lg bg-primary text-primary-foreground 
                  hover:bg-primary/90 focus-ring-primary focus:ring-destructive/40 
                  focus:bg-primary/90 cursor-pointer
                  active:scale-95 transition-transform duration-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-3 inline-block w-5 h-5"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Book
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {books.length === 0 
                ? "No books in your library yet." 
                : "No books match your current filters."}
            </p>
          </div>
        ) : (
          <BookList
            books={filteredBooks}
            onDelete={(id) => deleteBook(id)}
            onUpdate={() => loadBooks(searchQuery)}
            onModalStateChange={setIsModalOpen}
          />
        )}
      </div>
    </div>
  );
}
