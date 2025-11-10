import { useState } from 'react';
import BookCard from "./BookCard";
import BookModal from "./Modals/BookModal";
import { updateBook } from "../api/books";

interface BookListProps {
  books: any[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdate?: () => void;
  onModalStateChange?: (isOpen: boolean) => void; // Track modal state
}

export default function BookList({ books, onEdit, onDelete, onUpdate, onModalStateChange }: BookListProps) {
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (book: any) => {
    setSelectedBook(book);
    setIsModalOpen(true);
    onModalStateChange?.(true);
  };

  const handleEdit = async (updates: any) => {
    if (selectedBook) {
      try {
        await updateBook(selectedBook.id, updates);
        if (onUpdate) onUpdate();
        if (onEdit) onEdit(selectedBook.id);
      } catch (error) {
        console.error('Failed to update book:', error);
      }
    }
    setIsModalOpen(false);
    onModalStateChange?.(false);
  };

  const handleDelete = () => {
    if (selectedBook && onDelete) {
      onDelete(selectedBook.id);
    }
    setIsModalOpen(false);
    onModalStateChange?.(false);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    onModalStateChange?.(false);
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
          onClose={handleClose}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
