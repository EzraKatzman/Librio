import express from "express";
import cors from "cors";
import booksRouter from "./routes/books.js";
import scanRouter from "./routes/scan.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/books", booksRouter);
app.use("/api/scan", scanRouter);

export default app;
