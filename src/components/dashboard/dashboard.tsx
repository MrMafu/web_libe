"use client";

import { useState } from "react";
import Link from "next/link";
import { useDashboard } from "@/api/contexts/dashboard-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars,
    faBook,
    faClockRotateLeft,
    faUpRightFromSquare,
    faEllipsisV,
    faUser,
    faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";

import StatusCard from "./status-card";
import QuickActions from "./quick-actions";
import Chart from "./chart";

export default function Dashboard() {
    const { stats, loading } = useDashboard();
    const [isDashboardDropdownOpen, setIsDashboardDropdownOpen] = useState(false);

    const openSidebar = () => {
        document.dispatchEvent(new Event("openSidebar"));
    };

    const toggleDropdown = () => {
        setIsDashboardDropdownOpen(prev => !prev);
    };

    const closeDropdown = () => {
        setIsDashboardDropdownOpen(false);
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
            <div className="fixed top-0 left-0 w-full z-0 flex justify-end items-center md:hidden bg-white p-4 shadow">
                
                {/* The new dropdown button and menu */}
                <button
                    onClick={toggleDropdown}
                    className="flex items-center justify-center mx-6 px-4 py-2 bg-[var(--main-theme)] text-white rounded-md md:hidden hover:bg-green-300 transition">
                    Quick Actions
                </button>
                {isDashboardDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 top-15 right-10">
                        <Link href="/" onClick={closeDropdown} className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-500 hover:bg-[var(--main-theme)]">
                            <span>Add New Book</span>
                        </Link>
                        <Link href="/" onClick={closeDropdown} className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-500 hover:bg-[var(--main-theme)]">
                            <span>Procces Return</span>
                        </Link>
                        <Link href="/" onClick={closeDropdown} className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-500 hover:bg-[var(--main-theme)]">
                            <span>View All Borrowings</span>
                        </Link>
                        <Link href="/" onClick={closeDropdown} className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-500 hover:bg-[var(--main-theme)]">
                            <span>Manage Users</span>
                        </Link>
                    </div>
                )}
                {/* Container for the mobile buttons */}
                <button
                    onClick={openSidebar}
                    className="flex justify-self-end md:hidden text-gray-800">
                    <FontAwesomeIcon icon={faBars} size="lg" />
                </button>
            </div>

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

