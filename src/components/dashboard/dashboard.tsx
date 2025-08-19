"use client";

import { faBook, faClockRotateLeft, faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useDashboard } from "@/api/contexts/dashboard-context";

import StatusCard from "../status-card";
import QuickActions from "../quick-actions";
import Chart from "../chart";

export default function Dashboard() {
    const { stats, loading } = useDashboard();

    if (!loading && !stats) return <div className="min-h-screen flex items-center justify-center">Unable to load stats.</div>;

    const statusCards = loading
        ? [
            { name: "Total Books", value: "-", icon: faBook },
            { name: "Active Borrowings", value: "-", icon: faUpRightFromSquare },
            { name: "Pending Fines", value: "-", icon: faClockRotateLeft },
        ]
        : [
            { name: "Total Books", value: stats!.books_count, icon: faBook },
            { name: "Active Borrowings", value: stats!.active_borrowings_count, icon: faUpRightFromSquare },
            { name: "Pending Fines", value: stats!.pending_fines_count, icon: faClockRotateLeft },
        ];

    return (
        <div className={`space-y-6 ml-0 md:ml-64 ${loading ? "animate-pulse" : ""}`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {statusCards.map((card, index) => (
                    <StatusCard key={index} name={card.name} value={card.value} icon={card.icon} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Activity Over Time</h2>
                    <Chart />
                </div>
                <QuickActions />
            </div>
        </div>
    );
}
