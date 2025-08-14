"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import api from "@/lib/axios";

interface User {
    id: number;
    name: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (name: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const init = async () => {
            try {
                const res = await api.get("/me");
                const u = res.data?.data?.user ?? res.data?.user ?? res.data;
                if (mounted && u) {
                    setUser(u);
                }
            } catch (err) {
                setUser(null);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        init();

        return () => {
            mounted = false;
        };
    }, []);

    const login = async (name: string, password: string) => {
        setLoading(true);
        try {
            const { data } = await api.post("/login", { name, password });

            const token = data?.data?.token ?? data?.token;
            const u = data?.data?.user ?? data?.user ?? data;

            if (!token) throw new Error("No token returned by login");

            const maxAge = 60 * 60 * 2; // 2 hours
            document.cookie = `auth_token=${token}; path=/; max-age=${maxAge}`;

            if (!u) throw new Error("Access denied or invalid credentials.");

            if (u.role !== "admin" && u.role !== "librarian") {
                document.cookie = "auth_token=; path=/; max-age=0";
                setUser(null);
                throw new Error("Access denied. Only admins and librarians can login.");
            }

            setUser(u);
        } catch (error: any) {
            let msg = "Login failed";
            if (error.response?.data?.message) msg = error.response.data.message;
            else if (error.message) msg = error.message;
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.post("/logout");
        } catch (err) {
            // console.error("Logout error:", error);
        }
        document.cookie = "auth_token=; path=/; max-age=0";
        setUser(null);
        setLoading(false);
    };

    const contextValue = {
        user,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};