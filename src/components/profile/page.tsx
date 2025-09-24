"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/api/contexts/auth-context";
import Link from "next/link";

type Profile = {
  name: string;
  bio: string;
};

export default function ProfilePage() {
  const { user } = useAuth();
  const initialProfile: Profile = {
    name: user?.name || "",
    bio: "",
  };

  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Profile>(profile);

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name || "", bio: "" });
      setForm({ name: user.name || "", bio: "" });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setProfile(form);
    setEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Profile</h2>
        <Link
          href="/"
          className="text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <p>
        <strong>Name:</strong> {profile.name}
      </p>
      <p>
        <strong>Bio:</strong> {profile.bio}
      </p>
      <button
        onClick={() => setEditing(true)}
        className="mt-4 bg-[var(--main-theme)] text-white px-4 py-2 rounded"
      >
        Edit Profile
      </button>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit Profile</h3>
            <form>
              <div className="mb-4">
                <label className="block font-medium">Name:</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Bio:</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-[var(--main-theme)] text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-gray-200 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
