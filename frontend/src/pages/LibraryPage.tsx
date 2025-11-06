import { useState, useEffect } from "react";
import { useBooksStore } from "../store/useBooksStore";
import BookList from "../components/BookList";
import SearchBar from "../components/SearchBar";

export default function LibraryPage() {
  const { books, loadBooks, deleteBook, addBook } = useBooksStore();
  const [searchQuery, setSearchQuery] = useState("");

  const [isbn, setIsbn] = useState("");

  const handleAdd = async () => {
    if (!isbn) return;
    await addBook(isbn);
    setIsbn("");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBooks();
    }, 300); // Debounce search by 300ms

    return () => clearTimeout(timer);
  }, [searchQuery]);

   return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">My Library</h1>
              <p className="mt-1 text-sm text-gray-500">
                {books.length} {books.length === 1 ? "book" : "books"} in your collection
              </p>
            </div>
          </div>
        </div>
      </header>
      
      {/* Search and Filters */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4">
            <div className="relative flex-1 sm:max-w-md">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>
            <div className="flex items-center">
              <button onClick={handleAdd} className="px-4 py-2 mr-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
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
        <BookList
          books={books}
          onDelete={(id) => deleteBook(id)}
          onUpdate={loadBooks}
        />
      </div>
      
    </div>
  );
}
