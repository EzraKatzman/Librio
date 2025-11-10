import { prisma } from "../../src/db/connection.js";
import { fetchBookByISBN } from "../../src/services/googleBooks.js";

async function main() {
    const books = await prisma.book.findMany();

    for (const book of books) {
        console.log(`Refreshing ${book.isbn}...`);

        const metadata = await fetchBookByISBN(book.isbn);
        if (!metadata) {
            console.log(`Skipping ${book.isbn} (not found)`);
            continue;
        }

        await prisma.book.update({
            where: { id: book.id },
            data: {
                title: metadata.title,
                author: metadata.author,
                coverUrl: metadata.coverUrl,
                genres: metadata.genres,
            },
        });
    }

    console.log("Refresh complete.");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
  