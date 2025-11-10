import type express from "express";
import { fetchBookByISBN } from "../services/googleBooks.js";
import { prisma } from "../db/connection.js";

export const addBookByISBN = async (req: express.Request, res: express.Response) => {
    const { isbn } = req.body;

    try {
        const existing = await prisma.book.findUnique({where: { isbn } });
        if (existing) return res.status(200).json(existing);

        const metadata = await fetchBookByISBN(isbn);
        if (!metadata) return res.status(404).json({ error: "Book not found" });

        const newBook = await prisma.book.create({
            data: { isbn, ...metadata },
        });

        res.status(201).json(newBook);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add book" });
    }
};

export const getBooks = async (req: express.Request, res: express.Response) => {
    const { search, genre, sort } = req.query;

    try {
        let where = {};
        if (search) {
            const searchStr = String(search).toLowerCase();
            where = {
                OR: [
                    { title: { contains: String(searchStr) } },
                    { author: { contains: String(searchStr) } },
                ],
          };
        }
        if (genre) {
            where = { ...where, genres: { has: String(genre) } };
        }

        let orderBy = {};
        if (sort === "rating_desc") orderBy = { rating: "desc" };
        if (sort === "rating_asc") orderBy = { rating: "asc" };

        const books = await prisma.book.findMany({ where, orderBy });
        res.json(books);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch books" });
    } 
};

export const getBookById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;  
    try {
        const book = await prisma.book.findUnique({ where: { id } });
        if (!book) return res.status(404).json({ error: "Book not found" });
        res.json(book);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch book" });
    } 
};

export const updateBook = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const data = req.body;
    try {
        if (data.rating !== undefined) {
            const rating = parseFloat(data.rating);
            if (isNaN(rating) || rating < 0 || rating > 5) {
                return res.status(400).json({ error: "Rating must be a number between 0 and 5" });
            }
            data.rating = rating;
        }

        if (data.readStatus && !["unread", "reading", "finished"].includes(data.readStatus)) {
            return res.status(400).json({ error: "Invalid read status" });
        }

        const updatedBook = await prisma.book.update({ where: { id }, data });
        res.json(updatedBook);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update book" });
    }
};

export const deleteBook = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
        await prisma.book.delete({ where: { id } });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete book" });
    }   
};
