// src/api/contexts/dashboard-context.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { dashboardService, Stats } from "../services/dashboard-service";

interface DashboardContextType {
    stats: Stats | null;
    loading: boolean;
    refresh: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const load = async () => {
        setLoading(true);
        try {
            const s = await dashboardService.getStats();
            setStats(s);
        } catch (err) {
            console.error("dashboard: failed to load stats", err);
            setStats(null);
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

    return (
        <DashboardContext.Provider value={{ stats, loading, refresh: load }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const ctx = useContext(DashboardContext);
    if (!ctx) {
        throw new Error("useDashboard must be used within DashboardProvider");
    }
    return ctx;
};
