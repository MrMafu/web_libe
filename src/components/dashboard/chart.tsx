"use client";

import { useState } from "react";
import { useDashboard } from "@/api/contexts/dashboard-context";
import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

const fallbackData = [
    { name: "Page A", uv: 21 },
    { name: "Page B", uv: 17 },
    { name: "Page C", uv: 15 },
    { name: "Page D", uv: 24 },
];

export default function Chart() {
    const { stats, loading } = useDashboard();
    const [view, setView] = useState<"7" | "30" | "4w">("7");

    const makeChartDataFromSeries = (series: any[]) => {
        if (!series || !Array.isArray(series)) return fallbackData;
        return series.map((s: any) => ({
            name: s.label ?? s.date ?? s.start ?? "",
            uv: s.count ?? 0
        }));
    };

    const chartData = !loading && stats ?
        (view === "7"
            ? makeChartDataFromSeries(stats.last_7_days)
            : view === "30"
                ? makeChartDataFromSeries(stats.last_30_days)
                : fallbackData
        ) : fallbackData;

    return (
        <div className="flex flex-col lg:col-span-3 bg-white p-6 rounded-lg shadow-md h-full">
            <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Activity Over Time</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setView("7")}
                        className={`px-3 py-1 rounded ${view === "7" ? "bg-[var(--main-theme)] text-white" : "bg-[var(--main-theme)]/20 text-[var(--main-theme)]"}`}>
                        Last 7 Days
                    </button>

                    <button
                        onClick={() => setView("30")}
                        className={`px-3 py-1 rounded ${view === "30" ? "bg-[var(--main-theme)] text-white" : "bg-[var(--main-theme)]/20 text-[var(--main-theme)]"}`}>
                        Last 30 Days
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} syncId="anyId">
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="uv" stroke="var(--main-theme)" fill="var(--main-theme)" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}