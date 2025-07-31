"use client";

import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faFolder, faUser } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
    const [isMasterDataOpen, setIsMasterDataOpen] = useState(false);

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-screen">
            <div className="px-2 py-2">
                <button
                    onClick={() => setIsMasterDataOpen(!isMasterDataOpen)}
                    className="flex items-center w-full p-2 space-x-2 text-sm text-gray-800 hover:bg-[var(--main-theme)]/10 rounded-md transition-colors">
                    <FontAwesomeIcon icon={faFolder} />
                    <span className="flex-1 text-left">Master Data</span>
                    <FontAwesomeIcon
                        icon={faChevronRight}
                        className={`transform transition-transform duration-200 ease-in-out ${
                            isMasterDataOpen ? 'rotate-90' : 'rotate-0'
                        }`}
                    />
                </button>

                {isMasterDataOpen && (
                    <nav className="mt-2 mx-4 pl-2 border-l border-gray-200 space-y-2">
                        <Link
                            href="/users"
                            className="flex items-center p-2 text-sm text-gray-700 hover:bg-[var(--main-theme)]/10 rounded-md transition-colors">
                            <FontAwesomeIcon icon={faUser} className="mr-2" />
                            <span>Users</span>
                        </Link>
                    </nav>
                )}
            </div>
        </aside>
    );
}