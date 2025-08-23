"use client";

import Link from "next/link";
import { useAuth } from "@/api/contexts/auth-context";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faFolder, faUser, faTimes, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
    const [isMasterDataOpen, setIsMasterDataOpen] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { logout } = useAuth();

    useEffect(() => {
        const handleOpenSidebar = () => setIsSidebarOpen(true);
        document.addEventListener("openSidebar", handleOpenSidebar);
        return () => document.removeEventListener("openSidebar", handleOpenSidebar);
    }, []);

    return (
        <>
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-1 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <aside
                className={`fixed left-0 top-0 h-full w-64 z-1 border-r border-gray-200 bg-white transform transition-transform duration-300
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0 md:block flex flex-col`}>
                
                {/* Header section */}
                <div className="flex items-center justify-between px-5 py-6 relative border-b border-gray-100">
                    <h1 className="select-none text-gray-800 text-2xl font-bold">
                        Lib<span className="text-[var(--main-theme)]">E</span>
                    </h1>
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="text-gray-800 focus:outline-none">
                            <FontAwesomeIcon icon={faTimes} size="lg" />
                        </button>
                    </div>
                </div>

                {/* Navigation content */}
                <div className="flex-grow overflow-y-auto py-4">
                    {/* Master data */}
                    <div className="px-4 mb-6">
                        <button
                            onClick={() => setIsMasterDataOpen(!isMasterDataOpen)}
                            className="flex items-center w-full p-3 space-x-2 text-sm text-gray-800 hover:bg-[var(--main-theme)]/10 rounded-md transition-colors">
                            <FontAwesomeIcon icon={faFolder} />
                            <span className="flex-1 text-left">Master Data</span>
                            <FontAwesomeIcon
                                icon={faChevronRight}
                                className={`transform transition-transform duration-200 ease-in-out ${isMasterDataOpen ? "rotate-90" : "rotate-0"
                                    }`}
                            />
                        </button>
                        
                        {isMasterDataOpen && (
                            <nav className="mt-2 ml-2 pl-4 border-l border-gray-200 space-y-2">
                                {/* Users module */}
                                <Link
                                    href="/users"
                                    className="flex items-center p-2 space-x-1 text-sm text-gray-700 hover:bg-[var(--main-theme)]/10 rounded-md transition-colors">
                                    <FontAwesomeIcon icon={faUser} />
                                    <span>Users</span>
                                </Link>
                            </nav>
                        )}
                    </div>
                </div>

                {/* Log Out button */}
                <div className="p-4 border-t border-gray-100 mt-auto">
                    <button
                        onClick={logout}
                        className="flex items-center w-full p-3 space-x-2 text-sm text-red-500 hover:bg-red-50 rounded-md transition-colors">
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}