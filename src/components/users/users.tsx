"use client";

import React, { useState } from "react";
import { useUsers } from "@/api/contexts/user-context";
import DataTable, { TableColumn } from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function UsersPage() {
  const { users, loading, createUser, updateUser, deleteUser } = useUsers();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<null | { id: number; name: string; role: string }>(null);
  const [formData, setFormData] = useState({ name: "", role: "user", password: "" });

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
    } catch (error: any) {
      alert(error.message || "Failed to delete user");
    }
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, {
          name: formData.name,
          role: formData.role,
          ...(formData.password ? { password: formData.password } : {}),
        });
      } else {
        await createUser(formData);
      }
      setShowModal(false);
    } catch (error: any) {
      alert(error.message || "Failed to save user");
    }
  };

  const columns: TableColumn<{ id: number; name: string; role: string }>[] = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Role", selector: (row) => row.role, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button
            onClick={() => alert(`Detail user ${row.id}`)}
            className="px-2 text-gray-600"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => {
              setEditingUser(row);
              setFormData({ name: row.name, role: row.role, password: "" });
              setShowModal(true);
            }}
            className="px-2 text-blue-500"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="px-2 text-red-500"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ),
      center: true,
    },
  ];

  return (
    <div className="md:ml-64 transition-all duration-300 min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-3">
          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 bg-gray-300 rounded">
            Back
          </button>
          <button
            onClick={() => {
              setEditingUser(null);
              setFormData({ name: "", role: "user", password: "" });
              setShowModal(true);
            }}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Create User
          </button>
        </div>

        <button
          onClick={() => document.dispatchEvent(new Event("openSidebar"))}
          className="cursor-pointer flex items-center md:hidden text-gray-800"
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <DataTable
          columns={columns}
          data={users}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
          dense
        />
      </div>

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/60">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">
              {editingUser ? "Edit User" : "Create User"}
            </h3>

            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded mb-2"
            />

            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="user">User</option>
              <option value="librarian">Librarian</option>
              <option value="admin">Admin</option>
            </select>

            {!editingUser && (
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />
            )}

            {editingUser && (
              <input
                type="password"
                placeholder="New Password (optional)"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}