"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await login(name, password);
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Invalid credentials or access denied");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="max-w-sm w-full bg-white rounded-xl p-6 space-y-3 shadow-md">
                <h1 className="text-xl text-gray-800 font-bold">Login to your account</h1>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6 text-sm">
                    {/* Name Field */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-600">
                            <FontAwesomeIcon icon={faUser} />
                            <label htmlFor="name">Name</label>
                        </div>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-[var(--main-theme)]/30 focus:border-[var(--main-theme)] transition duration-200"
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-600">
                            <FontAwesomeIcon icon={faLock} />
                            <label htmlFor="password">Password</label>
                        </div>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-[var(--main-theme)]/30 focus:border-[var(--main-theme)] transition duration-200"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="cursor-pointer w-full py-2 bg-[var(--main-theme)] text-white rounded-md hover:bg-[var(--main-theme)]/90 transition-colors">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}