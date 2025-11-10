import axios from "axios"

export async function fetchSubjectsByISBN(isbn: string): Promise<String[]> {
    try {
        const isbnUrl = `https://openlibrary.org/isbn/${isbn}.json`;
        const isbnRes = await axios.get(isbnUrl);

        const works = isbnRes.data.works;
        if (!works || works.length === 0) return [];

        const workKey = works[0].key;

        const workUrl = `https://openlibrary.org${workKey}.json`;
        const workRes = await axios.get(workUrl);
        
        const subjects = workRes.data.subjects || [];
        return Array.isArray(subjects) ? subjects : [];
    } catch {
        return [];
    }
}
