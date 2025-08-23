"use client";

import { useDashboard } from "@/api/contexts/dashboard-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBook, faClockRotateLeft, faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

import StatusCard from "./status-card";
import QuickActions from "./quick-actions";
import Chart from "./chart";

export default function Dashboard() {
    const { stats, loading } = useDashboard();

    const openSidebar = () => {
        document.dispatchEvent(new Event("openSidebar"));
    };

    if (!loading && !stats) return <div className="min-h-screen flex items-center justify-center">Unable to load stats.</div>;

    const statuses = loading ?
        [
            { name: "Total Books", value: "-", icon: faBook },
            { name: "Active Borrowings", value: "-", icon: faUpRightFromSquare },
            { name: "Pending Fines", value: "-", icon: faClockRotateLeft },
        ] : [
            { name: "Total Books", value: stats!.books_count, icon: faBook },
            { name: "Active Borrowings", value: stats!.active_borrowings_count, icon: faUpRightFromSquare },
            { name: "Pending Fines", value: stats!.pending_fines_count, icon: faClockRotateLeft },
        ];

    const actions = [
        { label: "Add New Book" },
        { label: "Process Return" },
        { label: "View All Borrowings" },
        { label: "Manage Users" },
    ];

    return (
        <div className={`space-y-6 ml-0 md:ml-64 ${loading ? "animate-pulse" : ""}`}>
            <button
                onClick={openSidebar}
                className="flex justify-self-end md:hidden text-gray-800">
                <FontAwesomeIcon icon={faBars} size="lg" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {statuses.map((card, index) => (
                    <StatusCard key={index} name={card.name} value={card.value} icon={card.icon} />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-y-6">
                <Chart />
                <QuickActions actions={actions} />
            </div>
        </div>
    );
}
