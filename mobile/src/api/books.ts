import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { Book } from "../types/book";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

export const addBookByISBN = async (isbn: string): Promise<Book> => {
    try {
        const response = await api.post("/books", { isbn });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                throw new Error("Book not found. Please check the ISBN.");
            }
            throw new Error(error.response?.data?.error || "Failed to add book");
        }
        throw new Error("Network error. Please check your connection");
    }
};

export const fetchBooks = async () : Promise<Book[]> => {
    try {
        const response = await api.get("/books");
        return response.data;
    } catch (error) {
        console.error("Error fetching books:", error);
        throw error;
    }
};

export const deleteBook = async (id: string): Promise<void> => {
    await api.delete(`/books/${id}`);
};
