import api from "../axios";

export interface Stats {
    books_count: number;
    active_borrowings_count: number;
    pending_fines_count: number;
}

export const dashboardService = {
    async getStats(): Promise<Stats> {
        const response = await api.get("/admin/stats");
        return response.data ?? response;
    }
};