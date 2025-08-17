"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { authService } from "../services/auth-service";

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
                const userData = await authService.getMe();
                if (mounted && userData) setUser(userData);
            } catch {
                setUser(null);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        init();

        return () => { mounted = false };
    }, []);

    const login = async (name: string, password: string) => {
        setLoading(true);
        try {
            const { token, user: u } = await authService.login({ name, password });

            if (!token) throw new Error("No token returned by login");
            if (!u) throw new Error("Access denied or invalid credentials.");

            if (u.role !== "admin" && u.role !== "librarian") {
                document.cookie = "auth_token=; path=/; max-age=0";
                setUser(null);
                throw new Error("Access denied. Only admins and librarians can login.");
            }

            const maxAge = 60 * 60 * 2; // 2 hours
            document.cookie = `auth_token=${token}; path=/; max-age=${maxAge}`;
            setUser(u);
        } catch (error: any) {
            throw new Error(error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error: any) {
            throw new Error(error.message || "Logout failed");
        } finally {
            document.cookie = "auth_token=; path=/; max-age=0";
            setUser(null);
            setLoading(false);
        }
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