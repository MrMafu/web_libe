"use client";

import React from "react";
import { useFines } from "@/api/contexts/fine-context";
import DataTable, { TableColumn } from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faRotate } from "@fortawesome/free-solid-svg-icons";

export default function FinesPage() {
  const { fines, loading, generateFines } = useFines();

  const columns: TableColumn<any>[] = [
    { name: "User", selector: (row) => row.user_name, sortable: true },
    { name: "Book", selector: (row) => row.book_title, sortable: true },
    { name: "Amount", selector: (row) => `Rp ${row.amount.toLocaleString()}` },
    { name: "Status", selector: (row) => row.status },
    { name: "Created", selector: (row) => row.created_at },
  ];

  return (
    <div className="md:ml-64 min-h-screen bg-gray-50 p-6 transition-all duration-300">
      
      {/* HEADER */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 relative">
        
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => document.dispatchEvent(new Event("openSidebar"))}
          className="md:hidden absolute top-4 right-4 text-gray-700"
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>

        <h2 className="text-sm font-semibold text-gray-600 tracking-wide">
          FINES MANAGEMENT
        </h2>
        <h1 className="text-2xl font-bold mt-1">Pending Fines</h1>
        <p className="text-gray-500 text-sm mt-1">
          View and generate late-return fines.
        </p>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={generateFines}
            className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faRotate} />
            Generate Fines
          </button>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <DataTable
          columns={columns}
          data={fines}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
          dense
        />
      </div>
    </div>
  );
}
