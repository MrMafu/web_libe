"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/api/axios";

interface Fine {
  id: number;
  user_name: string;
  book_title: string;
  amount: number;
  status: string;
  created_at: string;
}

interface FineContextType {
  fines: Fine[];
  loading: boolean;
  fetchFines: () => Promise<void>;
  generateFines: () => Promise<void>;
}

const FineContext = createContext<FineContextType | undefined>(undefined);

export const FineProvider = ({ children }: { children: React.ReactNode }) => {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFines = async () => {
    try {
      setLoading(true);
      const res = await api.get("/fines");
      setFines(res.data || res);
    } catch (err) {
      console.error("Failed to fetch fines:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateFines = async () => {
    try {
      await api.post("/fines/generate");
      await fetchFines();
      alert("Fines successfully generated!");
    } catch (err) {
      alert("Failed to generate fines");
    }
  };

  useEffect(() => {
    fetchFines();
  }, []);

  return (
    <FineContext.Provider value={{ fines, loading, fetchFines, generateFines }}>
      {children}
    </FineContext.Provider>
  );
};

export const useFines = () => {
  const ctx = useContext(FineContext);
  if (!ctx) throw new Error("useFines must be used inside FineProvider");
  return ctx;
};
