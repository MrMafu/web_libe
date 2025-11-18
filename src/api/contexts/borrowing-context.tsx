"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/api/axios";

interface Borrowing {
  id: number;
  user_name: string;
  book_title: string;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: string;
}

interface BorrowingContextType {
  borrowings: Borrowing[];
  loading: boolean;
  fetchBorrowings: () => Promise<void>;
  returnBook: (id: number) => Promise<void>;
}

const BorrowingContext = createContext<BorrowingContextType | undefined>(
  undefined
);

export const BorrowingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/borrowings");
      setBorrowings(res.data || res);
    } catch (err) {
      console.error("Failed to fetch borrowings:", err);
    } finally {
      setLoading(false);
    }
  };

  const returnBook = async (id: number) => {
    await api.post(`/borrowings/${id}/return`);
    await fetchBorrowings();
  };

  useEffect(() => {
    fetchBorrowings();
  }, []);

  return (
    <BorrowingContext.Provider
      value={{ borrowings, loading, fetchBorrowings, returnBook }}
    >
      {children}
    </BorrowingContext.Provider>
  );
};

export const useBorrowings = () => {
  const ctx = useContext(BorrowingContext);
  if (!ctx) throw new Error("useBorrowings must be used inside BorrowingProvider");
  return ctx;
};
