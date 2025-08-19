import api from "../axios";

export interface User {
    id: number;
    name: string;
    role: string;
}

interface LoginParams {
    name: string;
    password: string;
}

interface LoginResponse {
    token: string;
    user: User;
}

export const authService = {
    async login({ name, password }: LoginParams): Promise<LoginResponse> {
        const response = await api.post("/login", { name, password });
        return response.data;
    },

    async logout(): Promise<void> {
        await api.post("/logout");
    },

    async getMe(): Promise<User> {
        const response = await api.get("/me");
        return response.data?.data?.user ?? response.data?.user ?? response.data;
    },
};