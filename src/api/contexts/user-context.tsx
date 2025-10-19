"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { userService, User } from "../services/user-service";

interface UserContextType {
    users: User[];
    loading: boolean;
    refresh: () => Promise<void>;
    createUser: (data: { name: string; role: string; password: string }) => Promise<void>;
    updateUser: (id: number, data: { name: string; role: string; password?: string }) => Promise<void>;
    deleteUser: (id: number) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const load = async () => {
        setLoading(true);
        try {
            const data = await userService.getAll();
            setUsers(data);
        } catch (err) {
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;
        (async () => {
            if (!mounted) return;
            await load();
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const createUser = async (data: { name: string; role: string; password: string }) => {
        await userService.create(data);
        await load();
    };

    const updateUser = async (id: number, data: { name: string; role: string; password?: string }) => {
        await userService.update(id, data);
        await load();
    };

    const deleteUser = async (id: number) => {
        await userService.delete(id);
        await load();
    };

    return (
        <UserContext.Provider value={{ users, loading, refresh: load, createUser, updateUser, deleteUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUsers = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUsers must be used within UserProvider");
    return ctx;
};