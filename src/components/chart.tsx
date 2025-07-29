import React from "react";

export default function Chart() {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full max-w-262">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Borrowing Statistics</h2>
            <div className="flex items-end h-64 border-b-2 border-l-2 border-gray-200 p-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div key={day} className="flex-1 mx-2 flex flex-col items-center">
                        <div 
                            className="w-8 bg-[var(--main-theme)] rounded-t" 
                            style={{ height: `${[40, 60, 80, 65, 50, 30, 20][index]}%` }}
                        ></div>
                        <span className="mt-2 text-xs text-gray-500">{day}</span>
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-4">
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[var(--main-theme)] mr-2"></div>
                    <span className="text-sm text-gray-600">Books Borrowed</span>
                </div>
            </div>
        </div>
    );
}