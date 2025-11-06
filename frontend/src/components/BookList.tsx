import { useState } from 'react';
import BookCard from "./BookCard";
import BookModal from "./BookModal";
import { updateBook } from "../api/books";

interface BookListProps {
  books: any[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdate?: () => void; // Callback to refresh book list
}

export default function BookList({ books, onEdit, onDelete, onUpdate }: BookListProps) {
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (book: any) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleEdit = async (updates: any) => {
    if (selectedBook) {
      try {
        await updateBook(selectedBook.id, updates);
        if (onUpdate) onUpdate(); // Refresh the book list
        if (onEdit) onEdit(selectedBook.id);
      } catch (error) {
        console.error('Failed to update book:', error);
      }
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedBook && onDelete) {
      onDelete(selectedBook.id);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {books.map(book => (
          <BookCard
            key={book.id}
            book={book}
            onClick={() => handleCardClick(book)}
          />
        ))}
      </div>

      {selectedBook && (
        <BookModal
          book={selectedBook}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
