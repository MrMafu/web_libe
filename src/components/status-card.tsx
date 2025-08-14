"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Prop {
    name: string,
    value: number,
    icon: any
}

export default function StatusCard({name, value, icon}: Prop) {
    return (
        <div className="flex items-center p-8 rounded-lg bg-white gap-6 shadow-md">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--main-theme)]/20">
                <FontAwesomeIcon icon={icon} className="text-lg text-[var(--main-theme)]" />
            </div>
            <div>
                <h1 className="text-xl text-gray-800 font-bold">{value}</h1>
                <p className="text-gray-400">{name}</p>
            </div>
        </div>
    )
}