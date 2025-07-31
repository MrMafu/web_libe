import React from "react";
import { faBook } from "@fortawesome/free-solid-svg-icons";

import StatusCard from "../status-card";
import QuickActions from "../quick-actions";
import Chart from "../chart";

export default function Dashboard() {
    return (
        <div className="min-h-screen p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatusCard name="Total Books" value={10} icon={faBook} />
                <StatusCard name="Active Borrowings" value={5} icon={faBook} />
                <StatusCard name="Pending Fines" value={5} icon={faBook} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Activity Over Time</h2>
                    <Chart />
                </div>
                <QuickActions />
            </div>
        </div>
    );
}