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
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-bold">Pending Fines</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 bg-gray-300 rounded">
            Back
          </button>
          <button
            onClick={generateFines}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            <FontAwesomeIcon icon={faRotate} /> Generate
          </button>
          <button
            onClick={() => document.dispatchEvent(new Event("openSidebar"))}
            className="cursor-pointer flex items-center md:hidden text-gray-800"
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
        </div>
      </div>

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
