import axios from "axios";

export async function fetchBookByISBM(isbn: string) {
    try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
        const res = await axios.get(url);
        const item = res.data.items?.[0];

        if (!item) return null;

        const volume = item.volumeInfo;
        return {
            title: volume.title,
            author: volume.authors?.join(", ") || "Unknown Author",
            genres: volume.categories || [],
            coverUrl: volume.imageLinks?.thumbnail || "",
        };
    } catch (err) {
        console.error("Error fetching book data from Google Books:", err);
        return null;
    }
}
