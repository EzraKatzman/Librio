import express from "express";
import { 
    addBookByISBN, 
    getBooks, 
    getBookById, 
    updateBook, 
    deleteBook 
} from "../controllers/bookController.js";
import { prisma } from "../db/connection.js";

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBookById);  
router.post("/", addBookByISBN);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;
