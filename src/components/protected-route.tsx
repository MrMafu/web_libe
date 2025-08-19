"use client";

import { useAuth } from "@/api/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace("/login");
            }
        }
    }, [loading, user, router]);

    if (loading) {
        return (
            <div className="animate-pulse min-h-screen flex flex-col items-center justify-center space-y-4">
                <h1 className="text-gray-800 text-4xl font-bold">
                    Lib<span className="text-[var(--main-theme)]">E</span>
                </h1>
                <div className="animate-spin h-8 w-8 border-5 border-[var(--main-theme)]/50 border-t-transparent rounded-full"></div>
            </div>
        );
    };

    if (user) {
        return <>{children}</>;
    }

    return null;
}