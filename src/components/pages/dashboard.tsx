import React from "react";
import StatusCard from "../status-card";

export default function Dashboard() {
    return (
        <div className="flex flex-row gap-30 p-10">
            <StatusCard name="Total Books" value={10} />
            <StatusCard name="Active Borrowings" value={5} />
            <StatusCard name="Pending Fines" value={5} />
        </div>
    );
}