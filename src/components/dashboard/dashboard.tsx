"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useDashboard } from "@/api/contexts/dashboard-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars,
    faBook,
    faClockRotateLeft,
    faUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";

import StatusCard from "./status-card";
import BorrowChart from "./chart";
import QuickActions from "./quick-actions";
import { useAuth } from "@/api/contexts/auth-context";

export default function Dashboard() {
    const { user } = useAuth();
    const { stats, loading } = useDashboard();
    const [isDashboardDropdownOpen, setIsDashboardDropdownOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const openSidebar = () => {
        document.dispatchEvent(new Event("openSidebar"));
    };

    const toggleDropdown = () => {
        setIsDashboardDropdownOpen(prev => !prev);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDashboardDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        function handleQuickActionClose() {
            setIsDashboardDropdownOpen(false);
        }
        document.addEventListener("closeQuickActions", handleQuickActionClose as EventListener);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("closeQuickActions", handleQuickActionClose as EventListener);
        };
    }, []);

    if (!loading && !stats)
        return (
            <div className="min-h-screen flex items-center justify-center">
                Unable to load stats.
            </div>
        );

    const greetingTemplates = useMemo(
        () => [
            { before: "Welcome back, ", after: "." },
            { before: "How are you doing, ", after: "?" },
            { before: "Ready to start the day, ", after: "?" },
        ],
        []
    );

    const [greetingIndex, setGreetingIndex] = useState<number>(() =>
        Math.floor(Math.random() * greetingTemplates.length)
    );

    useEffect(() => {
        setGreetingIndex(Math.floor(Math.random() * greetingTemplates.length));
    }, [user?.name]);

    const displayName = user?.name;


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
            <div className="top-0 left-0 w-full z-0 flex items-center justify-between relative">
                {/* Greetings message */}
                <div className="flex-1 flex items-center">
                    <h2
                        id="randomMessage"
                        className="text-lg font-bold text-gray-800 text-left truncate flex flex-col sm:flex-row sm:flex-wrap">
                        <span>
                            {greetingTemplates[greetingIndex].before}
                        </span>
                         <span className="flex flex-row items-center sm:ml-1">
                          <span className="text-[var(--main-theme)]">{displayName}</span>
                          <span>{greetingTemplates[greetingIndex].after}</span>
                        </span>
                    </h2>
                </div>

                <div className="flex items-center space-x-3">
                    {/* Quick actions */}
                    <div ref={dropdownRef} className="relative">
                        <button
                            onClick={toggleDropdown}
                            aria-expanded={isDashboardDropdownOpen}
                            aria-haspopup="true"
                            className={
                                `cursor-pointer flex items-center justify-center px-4 py-2 text-sm rounded-md transition-colors
                                ${isDashboardDropdownOpen
                                    ? "bg-[var(--main-theme)]/10 text-[var(--main-theme)] hover:bg-[var(--main-theme)]/10 hover:text-[var(--main-theme)]"
                                    : "bg-[var(--main-theme)] text-white hover:bg-[var(--main-theme)]/10 hover:text-[var(--main-theme)]"
                                }`
                            }>
                            Quick Actions
                        </button>

                        {isDashboardDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-20">
                                <QuickActions />
                            </div>
                        )}
                    </div>

                    {/* Sidebar button */}
                    <button
                        onClick={openSidebar}
                        className="cursor-pointer flex items-center md:hidden text-gray-800">
                        <FontAwesomeIcon icon={faBars} size="lg" />
                    </button>
                </div>
            </div>

            {/* Status cards */}
            <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {statuses.map((card, idx) => (
                            <StatusCard
                                key={idx}
                                name={card.name}
                                value={card.value}
                                icon={card.icon}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="grid grid-cols-1 gap-y-6">
                <BorrowChart />
            </div>
        </div>
    );
}
