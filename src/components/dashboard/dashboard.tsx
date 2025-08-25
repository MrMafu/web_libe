"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useDashboard } from "@/api/contexts/dashboard-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars,
    faBook,
    faClockRotateLeft,
    faUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";

import StatusCard from "./status-card";
import Chart from "./chart";

export default function Dashboard() {
    const { stats, loading } = useDashboard();
    const [isDashboardDropdownOpen, setIsDashboardDropdownOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const openSidebar = () => {
        document.dispatchEvent(new Event("openSidebar"));
    };

    const toggleDropdown = () => {
        setIsDashboardDropdownOpen(prev => !prev);
    };

    const closeDropdown = () => {
        setIsDashboardDropdownOpen(false);
    };

    // 🔥 auto close kalau klik di luar
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDashboardDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!loading && !stats)
        return (
            <div className="min-h-screen flex items-center justify-center">
                Unable to load stats.
            </div>
        );

    const statuses = loading
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
            <div className="top-0 left-0 w-full z-0 flex justify-end items-center md:hidden relative">
                <div ref={dropdownRef}>
                    <button
                        onClick={toggleDropdown}
                        className="flex items-center justify-center mx-6 px-4 py-2 bg-[var(--main-theme)] text-white rounded-md md:hidden hover:bg-white hover:text-[var(--main-theme)] transition-colors">
                        Quick Actions
                    </button>

                    {isDashboardDropdownOpen && (
                        <div className="absolute right-12 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                            <Link href="/" onClick={closeDropdown} className="block px-4 py-2 text-sm text-gray-700 hover:bg-[var(--main-theme)]/10">
                                Add New Book
                            </Link>
                            <Link href="/" onClick={closeDropdown} className="block px-4 py-2 text-sm text-gray-700 hover:bg-[var(--main-theme)]/10">
                                Process Return
                            </Link>
                            <Link href="/" onClick={closeDropdown} className="block px-4 py-2 text-sm text-gray-700 hover:bg-[var(--main-theme)]/10">
                                View All Borrowings
                            </Link>
                            <Link href="/" onClick={closeDropdown} className="block px-4 py-2 text-sm text-gray-700 hover:bg-[var(--main-theme)]/10">
                                Manage Users
                            </Link>
                        </div>
                    )}
                </div>

                {/* Sidebar button */}
                <button
                    onClick={openSidebar}
                    className="flex justify-self-end md:hidden text-gray-800">
                    <FontAwesomeIcon icon={faBars} size="lg" />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {statuses.map((card, index) => (
                    <StatusCard
                        key={index}
                        name={card.name}
                        value={card.value}
                        icon={card.icon}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-y-6">
                <Chart />
            </div>
        </div>
    );
}
