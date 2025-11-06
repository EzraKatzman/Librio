import { create } from "zustand";
import { fetchBooks, addBooksByISBN, updateBook, deleteBook } from "../api/books";

interface Book {
    id: string;
    title: string;
    author: string;
    isbn: string;
    coverUrl?: string;
    genres?: string[];
    rating?: number;
    readStatus?: "unread" | "reading" | "finished";
    ebookPath?: string;
}

interface BooksStore {
    books: Book[];
    loadBooks: (search?: string) => Promise<void>;
    addBook: (isbn: string) => Promise<void>;
    updateBook: (id: string, data: Partial<Book>) => Promise<void>;
    deleteBook: (id: string) => Promise<void>;
}

export const useBooksStore = create<BooksStore>((set, get) => ({
    books: [],
    loadBooks: async (search?: string) => {
        const data = await fetchBooks(search);
        set({ books: data });
    }, 
    addBook: async (isbn: string) => {
        const newBook = await addBooksByISBN(isbn);
        set({ books: [...get().books, newBook] });
    },
    updateBook: async (id: string, data) => {
        const updated = await updateBook(id, data);
        set({ books: get().books.map(b => (b.id === id ? updated : b)) });
    },
    deleteBook: async (id: string) => {
        await deleteBook(id);
        set({ books: get().books.filter(b => b.id !== id) });
    },
}));
