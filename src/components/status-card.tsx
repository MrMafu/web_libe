import React from "react";

interface Prop {
    name: string,
    value: number,
}

export default function StatusCard({name, value}: Prop) {
    return (
        <div className="flex items-center justify-between p-8 rounded-lg bg-white gap-8 shadow-md">
            <div className="p-6 rounded-full bg-[var(--main-theme)]/20"></div>
            <div>
                <h1 className="text-xl text-gray-700 font-bold">{value}</h1>
                <p className="text-gray-400">{name}</p>
            </div>
        </div>
    )
}