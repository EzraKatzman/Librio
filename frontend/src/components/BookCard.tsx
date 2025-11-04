
interface BookCardProps {
  book: any;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  return (
    <div className="border p-4 rounded shadow flex flex-col items-center">
      {book.coverUrl && <img src={book.coverUrl} alt={book.title} className="w-32 h-48 object-cover mb-2" />}
      <h3 className="font-bold">{book.title}</h3>
      <p className="text-sm text-gray-600">{book.author}</p>
      <div className="flex gap-2 mt-2">
        {onEdit && <button onClick={onEdit} className="px-2 py-1 bg-blue-500 text-white rounded">Edit</button>}
        {onDelete && <button onClick={onDelete} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>}
      </div>
    </div>
  );
}
