import axios from "axios";

const API_URL = "http://localhost:3000/api/books";

export const fetchBooks = async () => {
    return (await axios.get(API_URL)).data;
};

export const addBooksByISBN = async (isbn: string) => {
    return (await axios.post(API_URL, { isbn })).data;
};

export const updateBook = async (id: string, data: any) => {
  return (await axios.put(`${API_URL}/${id}`, data)).data;
};

export const deleteBook = async (id: string) => {
  return (await axios.delete(`${API_URL}/${id}`)).data;
};
