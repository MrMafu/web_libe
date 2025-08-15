"use client";

import { useAuth } from "@/context/auth-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
    const { logout } = useAuth();

    const openSidebar = () => {
        document.dispatchEvent(new Event("openSidebar"));
    };

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b bg-white border-gray-200">
            <div className="flex items-center gap-4">
                <button
                    onClick={openSidebar}
                    className="md:hidden text-gray-800 focus:outline-none"
                >
                    <FontAwesomeIcon icon={faBars} size="lg" />
                </button>
                <h1 className="text-gray-800 text-2xl font-bold">
                    Lib<span className="text-[var(--main-theme)]">E</span>
                </h1>
            </div>
            <button
                onClick={logout}
                className="cursor-pointer text-gray-800"
            >
                Logout
            </button>
        </header>
    );
}
