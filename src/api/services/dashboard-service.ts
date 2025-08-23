import api from "../axios";

export interface SeriesEntry {
    date: string;   // "YYYY-MM-DD"
    label: string;  // "Aug 21"
    count: number;
}

export interface Stats {
    books_count: number;
    active_borrowings_count: number;
    pending_fines_count: number;
    last_7_days: SeriesEntry[];
    last_30_days: SeriesEntry[];
}

export const dashboardService = {
    async getStats(): Promise<Stats> {
        const response = await api.get("/admin/stats");
        return response.data ?? response;
    }
};