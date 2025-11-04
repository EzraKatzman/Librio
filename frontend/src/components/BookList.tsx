
import BookCard from "./BookCard";

interface BookListProps {
  books: any[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function BookList({ books, onEdit, onDelete }: BookListProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {books.map(book => (
        <BookCard
          key={book.id}
          book={book}
          onEdit={() => onEdit?.(book.id)}
          onDelete={() => onDelete?.(book.id)}
        />
      ))}
    </div>
  );
}
