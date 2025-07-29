import React from "react";
import StatusCard from "../status-card"

export default function Dashboard() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
            <StatusCard name="Total Books" value={10} />
        </div>
    );
}