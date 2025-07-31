import React from "react";
import { faBook } from "@fortawesome/free-solid-svg-icons";

import StatusCard from "../status-card";
import QuickActions from "../quick-actions";
import Chart from "../chart";

type statusCard = {
    name: string,
    value: number,
    icon: any
}

const statusCards: statusCard[] = [
    { name: "Total Books", value: 10, icon: faBook },
    { name: "Active Borrowings", value: 10, icon: faBook },
    { name: "Pending Fines", value: 10, icon: faBook },
]

export default function Dashboard() {
    return (
        <div className="min-h-screen p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {statusCards.map((statusCard, index) => (
                    <StatusCard key={index} name={statusCard.name} value={statusCard.value} icon={statusCard.icon} />
                ))}
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