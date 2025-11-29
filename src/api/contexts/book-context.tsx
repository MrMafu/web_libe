"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/api/axios";

interface Topic {
  id: number;
  name: string;
}

interface SubTopic {
  id: number;
  name: string;
  topic?: Topic | null;
}

interface Book {
  id: number;
  isbn: string;
  cover: string | null;
  cover_url?: string | null;
  title: string;
  language: string;
  num_of_pages: number;
  author: string;
  publisher: string;
  publication_date: string | null;
  price?: number;
  sub_topic?: SubTopic | null;
}

interface BookContextType {
  books: Book[];
  loading: boolean;
  fetchBooks: () => Promise<void>;
  createBook: (data: FormData) => Promise<void>;
  updateBook: (id: number, data: FormData) => Promise<void>;
  deleteBook: (id: number) => Promise<void>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider = ({ children }: { children: React.ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSubTopics = async () => {
    try {
      const res = await api.get("/admin/subtopics");
      setSubTopics(res?.data || []);
    } catch (e) {
      console.log("Error loading subtopics", e);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);

      const resp = await api.get("/admin/books");
      const list = resp?.data?.data ?? resp?.data ?? [];

      setBooks(
        list.map((item: any) => ({
          id: item.id,
          isbn: item.isbn,
          cover: item.cover ?? null,
          cover_url: item.cover_url ?? item.coverUrl ?? null,
          title: item.title,
          language: item.language,
          num_of_pages: item.num_of_pages ?? 0,
          author: item.author,
          publisher: item.publisher,
          publication_date: item.publication_date ?? null,
          price: item.price ?? 0,
          sub_topic: item.sub_topic ?? item.subTopic ?? null,
        }))
      );
    } catch (err) {
      console.error("Failed fetch books:", err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const createBook = async (data: FormData) => {
    await api.post("/admin/books", data);
    await fetchBooks();
  };

  const updateBook = async (id: number, data: FormData) => {
    await api.post(`/admin/books/${id}?_method=PUT`, data);
    await fetchBooks();
  };

  const deleteBook = async (id: number) => {
    await api.delete(`/admin/books/${id}`);
    setBooks((prev) => prev.filter((x) => x.id !== id));
  };

  useEffect(() => {
    loadSubTopics().then(fetchBooks);
  }, []);

  return (
    <BookContext.Provider
      value={{ books, loading, fetchBooks, createBook, updateBook, deleteBook }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const ctx = useContext(BookContext);
  if (!ctx) throw new Error("useBooks must be inside provider");
  return ctx;
};
