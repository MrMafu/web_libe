"use client";

import React from "react";
import { useBorrowings } from "@/api/contexts/borrowing-context";
import DataTable, { TableColumn } from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUndo } from "@fortawesome/free-solid-svg-icons";

export default function BorrowingsPage() {
  const { borrowings, loading, returnBook } = useBorrowings();

  const columns: TableColumn<any>[] = [
    { name: "User", selector: (row) => row.user_name, sortable: true },
    { name: "Book", selector: (row) => row.book_title, sortable: true },
    { name: "Borrow Date", selector: (row) => row.borrow_date },
    { name: "Due Date", selector: (row) => row.due_date },
    { name: "Return Date", selector: (row) => row.return_date || "-" },
    { name: "Status", selector: (row) => row.status },
    {
      name: "Actions",
      cell: (row) =>
        !row.return_date && (
          <button
            onClick={() => returnBook(row.id)}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            <FontAwesomeIcon icon={faUndo} /> Return
          </button>
        ),
      center: true,
    },
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
          BORROWINGS MANAGEMENT
        </h2>
        <h1 className="text-2xl font-bold mt-1">Borrowings Administration</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage all active and returned borrowings.
        </p>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <DataTable
          columns={columns}
          data={borrowings}
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
