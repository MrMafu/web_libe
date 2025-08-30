"use client";

import { useEffect, useMemo, useState } from "react";
import { useDashboard } from "@/api/contexts/dashboard-context";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    Filler,
    ChartOptions,
    ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    ChartTooltip,
    Legend,
    Filler
);

const fallbackData = [
    { name: "Page A", uv: 21 },
    { name: "Page B", uv: 17 },
    { name: "Page C", uv: 15 },
    { name: "Page D", uv: 24 },
];

export default function BorrowChart() {
    const { stats, loading } = useDashboard();
    const [view, setView] = useState<"7" | "30">("7");

    const themeColor = getComputedStyle(document.documentElement).getPropertyValue("--main-theme").trim() || "#3b82f6";

    // choose series depending on view; if stats missing use fallback
    const series = useMemo(() => {
        if (!stats || loading) {
            // adapt fallbackData to the same structure for labels/data
            return fallbackData.map((f) => ({ label: f.name, count: f.uv }));
        }

        if (view === "7") return stats.last_7_days ?? [];
        if (view === "30") return stats.last_30_days ?? [];

        return (fallbackData.map((f) => ({ label: f.name, count: f.uv })));
    }, [stats, loading, view]);

    const labels = series.map((s: any) => s.label ?? s.date ?? s.start ?? "");
    const values = series.map((s: any) => Number(s.count ?? 0));

    const data: ChartData<"line"> = {
        labels,
        datasets: [
            {
                label: "Borrowings",
                data: values,
                tension: 0.35,
                borderWidth: 2,
                borderColor: themeColor,
                backgroundColor: themeColor,
                pointRadius: 2,
                pointHoverRadius: 4,
                pointBackgroundColor: themeColor,
            },
        ],
    };

    const options: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "index",
            intersect: false,
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: (context) => {
                        const v = context.parsed.y ?? 0;
                        return ` ${v} borrowings`;
                    },
                },
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                ticks: {
                    autoSkip: true,
                    maxRotation: 0,
                    minRotation: 0,
                },
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
    };

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
                <Line data={data} options={options} />
            </div>
        </div>
    );
}