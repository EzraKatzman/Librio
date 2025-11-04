import { useEffect } from "react";
import { useBooksStore } from "../store/useBooksStore";
import BookList from "../components/BookList";

export default function LibraryPage() {
  const { books, loadBooks, deleteBook } = useBooksStore();

  useEffect(() => {
    loadBooks();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Library</h1>
      <BookList
        books={books}
        onDelete={(id) => deleteBook(id)}
        onEdit={(id) => alert(`Edit book ${id}`)}
      />
    </div>
  );
}
