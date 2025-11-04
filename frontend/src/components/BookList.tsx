import { useState } from 'react';
import BookCard from "./BookCard";
import BookModal from "./BookModal";

interface BookListProps {
  books: any[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function BookList({ books, onEdit, onDelete }: BookListProps) {
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (book: any) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    if (selectedBook && onEdit) {
      onEdit(selectedBook.id);
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
