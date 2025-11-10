import axios from "axios";
import { fetchSubjectsByISBN } from "./openLibrary";
import { parseGenres } from "../utils/genParser";

export async function fetchBookByISBN(isbn: string) {
    try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
        const res = await axios.get(url);
        const item = res.data.items?.[0];

        if (!item) return null;

        const volume = item.volumeInfo;

        const googleGenres = volume.categories || [];
        const openLibrarySubjects = await fetchSubjectsByISBN(isbn);
        const mergedGenres = Array.from(
            new Set([...googleGenres, ...openLibrarySubjects])
        );
        const normalizedGenres = parseGenres(mergedGenres);

        return {
            title: volume.title,
            author: volume.authors?.join(", ") || "Unknown Author",
            genres: normalizedGenres,
            coverUrl: volume.imageLinks?.thumbnail || "",
        };
    } catch (err) {
        console.error("Error fetching book data from Google Books:", err);
        return null;
    }
}
