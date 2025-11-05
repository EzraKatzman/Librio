import { useEffect } from "react";
import { useBooksStore } from "../store/useBooksStore";
import BookList from "../components/BookList";

export default function LibraryPage() {
  const { books, loadBooks, deleteBook } = useBooksStore();

  useEffect(() => {
    loadBooks();
  }, []);

   return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground -ml-4">My Library</h1>
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
              {/* Placeholder for Search bar */}
              {/* Placeholder to move "Add Books Button" */}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-6">
        <BookList
          books={books}
          onDelete={(id) => deleteBook(id)}
          onUpdate={loadBooks}
        />
      </div>
    </div>
  );
}
