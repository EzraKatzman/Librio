export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  coverUrl?: string;
  genres?: string[];
  rating?: number;
  readStatus?: "unread" | "reading" | "finished";
  ebookPath?: string;
  dateAdded: string;
}

export interface ScanResult {
  type: string;
  data: string;
}
