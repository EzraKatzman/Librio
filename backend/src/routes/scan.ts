import express from "express";
import { addBookByISBN } from  "../controllers/bookController";

const router = express.Router();

router.post("/", addBookByISBN);

export default router;
