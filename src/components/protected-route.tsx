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
            <div>Loading...</div>
        );
    };

    if (user) {
        return <>{children}</>;
    }

    return null;
}