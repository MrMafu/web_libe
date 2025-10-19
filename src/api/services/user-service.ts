import api from "../axios";

export interface User {
    id: number;
    name: string;
    role: string;
}

export const userService = {
    async getAll(): Promise<User[]> {
        const response = await api.get("/admin/users");
        return response.data?.data ?? response.data ?? [];
    },
    async create(data: { name: string; role: string; password: string }): Promise<User> {
        const response = await api.post("/admin/users", data);
        return response.data;
    },
    async update(id: number, data: { name: string; role: string; password?: string }): Promise<User> {
        const response = await api.put(`/admin/users/${id}`, data);
        return response.data;
    },
    async delete(id: number): Promise<void> {
        await api.delete(`/admin/users/${id}`);
    },
};