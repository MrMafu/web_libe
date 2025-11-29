"use client";

import React, { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { useUsers } from "@/api/contexts/user-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faEdit, faTrash, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";

export default function UsersPage() {
  const { users, loading, createUser, updateUser, deleteUser } = useUsers();

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "user",
    password: "",
  });

  const openCreate = () => {
    setEditingUser(null);
    setFormData({ name: "", role: "user", password: "" });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
    } catch (e: any) {
      alert(e.message || "Failed deleting user");
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
    } catch (e: any) {
      alert("Failed saving user");
    }
  };

  const fieldClass =
    "w-full rounded-xl border border-gray-200 bg-white p-3 text-sm " +
    "focus:outline-none focus:ring-2 focus:ring-[var(--main-theme)]/30 " +
    "focus:border-[var(--main-theme)] transition";

  const columns: TableColumn<any>[] = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Role", selector: (row) => row.role, sortable: true },
    {
      name: "Actions",
      center: true,
      grow: 0.6,
      cell: (row) => (
        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditingUser(row);
              setFormData({ name: row.name, role: row.role, password: "" });
              setShowModal(true);
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>

          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-500 hover:text-red-700"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="md:ml-64 min-h-screen bg-gray-50 p-6">
        <div className="mx-auto w-full space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          
          {/* Header Section */}
          <section className="border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-500">
                  User management
                </p>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Users Administration
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage user accounts, roles, and permissions.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={openCreate}
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--main-theme)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-95"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Create User</span>
                </button>

                <button
                  onClick={() => document.dispatchEvent(new Event("openSidebar"))}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 md:hidden"
                >
                  <FontAwesomeIcon icon={faBars} size="lg" />
                  <span>Menu</span>
                </button>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total users", value: users.length },
              { label: "Admins", value: users.filter((u) => u.role === "admin").length },
              { label: "Librarians", value: users.filter((u) => u.role === "librarian").length },
              { label: "Standard users", value: users.filter((u) => u.role === "user").length },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <p className="text-xs uppercase tracking-widest text-gray-500">
                  {card.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {card.value}
                </p>
              </div>
            ))}
          </section>

          {/* Main Table */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <DataTable
              columns={columns}
              data={users}
              progressPending={loading}
              pagination
              highlightOnHover
              striped
              dense
            />
          </section>
        </div>
      </div>

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-gray-500">
                {editingUser ? "Edit User" : "New User"}
              </p>
              <h3 className="text-2xl font-semibold text-gray-900">
                {editingUser ? "Update User" : "Create New User"}
              </h3>
              <p className="text-sm text-gray-500">
                Fill the form to manage account information.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={fieldClass}
              />

              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className={fieldClass}
              >
                <option value="user">User</option>
                <option value="librarian">Librarian</option>
                <option value="admin">Admin</option>
              </select>

              <input
                type="password"
                placeholder={editingUser ? "New Password (optional)" : "Password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={fieldClass}
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 md:flex-row md:justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="inline-flex w-full justify-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 md:w-auto"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="inline-flex w-full justify-center rounded-xl bg-[var(--main-theme)] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-95 md:w-auto"
              >
                Save User
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
