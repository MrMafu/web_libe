"use client";

import { useAuth } from "@/context/auth-context";

export default function Navbar() {
    const { logout } = useAuth();

    return (
        <header className="sticky top-0 z-10 flex items-center justify-between px-10 py-5 border-b bg-white border-gray-200">
            <h1 className="text-gray-800 text-2xl font-bold">Lib<span className="text-[var(--main-theme)]">E</span></h1>
            <button onClick={logout} className="cursor-pointer text-gray-800">
                Logout
            </button>
        </header>
    );
}