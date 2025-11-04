import { useState } from "react";
import { useBooksStore } from "../store/useBooksStore";

export default function AddBookPage() {
  const [isbn, setIsbn] = useState("");
  const { addBook } = useBooksStore();

  const handleAdd = async () => {
    if (!isbn) return;
    await addBook(isbn);
    setIsbn("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Book</h1>
      <input
        type="text"
        placeholder="Enter ISBN"
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}
        className="border p-2 rounded w-64"
      />
      <button onClick={handleAdd} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
        Add
      </button>
    </div>
  );
}
