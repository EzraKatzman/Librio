import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer | null = null;

export function initializeWebSocket(server: HTTPServer) {
    io = new SocketIOServer(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    console.log("Websocket server initialized");
    return io;
}

export function getIO(): SocketIOServer {
    if (!io) {
        throw new Error("WebSocket not initialized");
    }
    return io;
}

export function emitBookAdded(book: any) {
    if (io) {
        io.emit("book:added", book);
        console.log("Emitted book:added event", book.id);
    }
}

export function emitBookUpdated(book: any) {
    if (io) {
        io.emit("book:updated", book);
        console.log("Emitted book:updated event", book.id);
    }
}

export function emitBookDeleted(bookId: string) {
    if (io) {
        io.emit("book:deleted", { id: bookId });
        console.log("Emitted book: deleted event", bookId);
    }
}
