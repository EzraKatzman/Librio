import { createServer } from "http";
import app from "./app.js";
import { initializeWebSocket } from "./services/websocket.js";

const PORT = process.env.PORT || 3000;

const server = createServer(app)
initializeWebSocket(server);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Websocket server is ready`);
});
