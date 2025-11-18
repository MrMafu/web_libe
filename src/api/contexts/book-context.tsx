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

      const listResp = await api.get("/admin/books");
      const list = listResp?.data || [];

      const detailed = await Promise.all(
        list.map(async (b: any) => {
          try {
            const d = await api.get(`/admin/books/${b.id}`);
            const detail = d?.data || b;

            let resolvedSubTopic: SubTopic | null = null;

            if (detail.sub_topic) {
              resolvedSubTopic = detail.sub_topic;
            } else if (detail.subTopic) {
              resolvedSubTopic = detail.subTopic;
            } else if (detail.sub_topic_id) {
              resolvedSubTopic =
                subTopics.find((s) => s.id === detail.sub_topic_id) || null;
            }

            return {
              id: detail.id,
              isbn: detail.isbn,
              cover: detail.cover ?? null,
              title: detail.title,
              language: detail.language,
              num_of_pages: detail.num_of_pages ?? 0,
              author: detail.author,
              publisher: detail.publisher,
              publication_date: detail.publication_date ?? null,
              price: detail.price ?? 0,
              sub_topic: resolvedSubTopic,
            };
          } catch {
            return b;
          }
        })
      );

      setBooks(detailed);
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
