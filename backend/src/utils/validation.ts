export function isValidISBN(isbn: string) {
    return /^[0-9]{10, 13}$/.test(isbn.replace(/-/g, ""));
}
