import { AuthProvider } from "@/api/contexts/auth-context";
import { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    title: "Login",
    description: "Login page"
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    )
}