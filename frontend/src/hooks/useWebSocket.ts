import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useBooksStore } from "../store/useBooksStore";
import { useToast } from "../context/ToastContext";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

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
    dateAdded: string;
}

export function useWebSocket() {
    const socketRef = useRef<Socket | null>(null);
    const { showToast } = useToast();
    const { addBookFromSocket, updateBookFromSocket, deleteBookFromSocket } = useBooksStore();

    useEffect(() => {
        socketRef.current = io(SOCKET_URL, {
            transports: ["websocket", "polling"],
        });

        const socket = socketRef.current;

        socket.on("connect", () => {
            console.log("Connected to Websocket server");
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from WebSocket server");
        });

        socket.on("connect_error", (error) => {
            console.error("WebSocket connection error:", error);
        });

        socket.on("book:added", (book: Book) => {
            console.log("Book added via WebSocket:", book.title);
            addBookFromSocket(book);
            showToast(`"${book.title}" was added to your library`, "success");
        });

        socket.on("book:updated", (book: Book) => {
            console.log("Book updated via WebSocket:", book.title);
            updateBookFromSocket(book);
        });

        socket.on("book:deleted", (data: { id: string }) => {
            console.log("Book deleted via Websocket", data.id);
            deleteBookFromSocket(data.id);
            showToast("Deleted book", "error");
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                console.log("WebSocket disconnected on cleanup");
            }
        };
    }, [addBookFromSocket, updateBookFromSocket, deleteBookFromSocket, showToast]);

    return socketRef.current;
}
