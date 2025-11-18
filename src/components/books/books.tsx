"use client";

import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import api from "@/api/axios";
import { useBooks } from "@/api/contexts/book-context";

type Topic = { id: number; name: string };
type SubTopic = { id: number; name: string; topic?: Topic | null };

export default function BooksPage() {
  const { books, loading, createBook, updateBook, deleteBook, fetchBooks } = useBooks();

  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [formData, setFormData] = useState<any>({
    isbn: "",
    title: "",
    author: "",
    publisher: "",
    language: "",
    num_of_pages: 0,
    publication_date: "",
    price: 0,
    cover: null,
    sub_topic_id: "",
  });

  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showSubTopicModal, setShowSubTopicModal] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [newSubTopic, setNewSubTopic] = useState("");
  const [selectedTopicForSub, setSelectedTopicForSub] = useState<number | "">("");
  const [filterTopic, setFilterTopic] = useState<string>("");
  const [filterSubTopic, setFilterSubTopic] = useState<string>("");

  // Load Topic & SubTopic
  const loadTopics = async () => {
    try {
      const resp = await api.get("/admin/topics");
      setTopics(resp?.data || []);
    } catch (err) {
      console.error("Load topics error:", err);
    }
  };

  const loadSubTopics = async () => {
    try {
      const resp = await api.get("/admin/subtopics");
      setSubTopics(resp?.data || []);
    } catch (err) {
      console.error("Load subtopics error:", err);
    }
  };

  useEffect(() => {
    loadTopics();
    loadSubTopics();
  }, []);

  useEffect(() => {
    if (showModal) loadSubTopics();
  }, [showModal]);

  // Filtering logic
  const filteredBooks = books.filter((b) => {
    const sub = b.sub_topic ?? null;

    if (filterTopic) {
      if (!sub || !sub.topic || String(sub.topic.id) !== filterTopic) return false;
    }

    if (filterSubTopic) {
      if (!sub || String(sub.id) !== filterSubTopic) return false;
    }

    return true;
  });

  // Save Book
  const handleSave = async () => {
    try {
      const fd = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          fd.append(key, value instanceof File ? value : String(value));
        }
      });

      if (editingBook) {
        await updateBook(editingBook.id, fd);
        alert("Book updated");
      } else {
        await createBook(fd);
        alert("Book created");
      }

      await fetchBooks();
      setShowModal(false);
      setEditingBook(null);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save book");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteBook(id);
      alert("Book deleted");
    } catch {
      alert("Failed deleting book");
    }
  };

  // Create Topic
  const handleCreateTopic = async () => {
    if (!newTopic.trim()) return alert("Topic name required");
    try {
      await api.post("/admin/topics", { name: newTopic });
      setNewTopic("");
      setShowTopicModal(false);
      loadTopics();
      alert("Topic created");
    } catch (err) {
      console.error(err);
      alert("Failed creating topic");
    }
  };

  // Create SubTopic
  const handleCreateSubTopic = async () => {
    if (!selectedTopicForSub || !newSubTopic.trim())
      return alert("Select topic and fill subtopic name");
    try {
      await api.post("/admin/subtopics", {
        topic_id: selectedTopicForSub,
        name: newSubTopic,
      });
      setNewSubTopic("");
      setSelectedTopicForSub("");
      setShowSubTopicModal(false);
      loadSubTopics();
      alert("Subtopic created");
    } catch (err) {
      console.error(err);
      alert("Failed creating subtopic");
    }
  };

  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";

  const columns: TableColumn<any>[] = [
    {
      name: "ISBN",
      selector: (row) => row.isbn,
      grow: 0.5,
      wrap: true,
    },
  
    {
      name: "Image",
      grow: 0.4,
      center: true,
      cell: (row) => (
        <div className="w-12 h-16 rounded border overflow-hidden bg-gray-100">
          {row.cover ? (
            <img
              src={`${apiBase}/storage/${row.cover}`}
              alt={row.title}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>
      ),
    },
  
    {
      name: "Title",
      grow: 1.6,
      cell: (row) => (
        <span className="font-semibold">{row.title}</span>
      ),
    },
  
    {
      name: "SubTopic",
      selector: (row) => row.sub_topic?.name ?? "-",
      grow: 1,
      wrap: true,
    },
  
    {
      name: "Topic",
      selector: (row) => row.sub_topic?.topic?.name ?? "-",
      grow: 1,
      wrap: true,
    },
  
    {
      name: "Author",
      selector: (row) => row.author,
      grow: 0.8,
      wrap: true,
    },
  
    {
      name: "Publisher",
      selector: (row) => row.publisher,
      grow: 0.8,
      wrap: true,
    },
  
    {
      name: "Actions",
      grow: 0.5,
      center: true,
      cell: (row) => (
        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditingBook(row);
              setFormData({
                isbn: row.isbn,
                title: row.title,
                author: row.author,
                publisher: row.publisher,
                language: row.language,
                num_of_pages: row.num_of_pages,
                publication_date: row.publication_date,
                price: row.price,
                cover: null,
                sub_topic_id: row.sub_topic?.id || "",
              });
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
    <div className="md:ml-64 min-h-screen bg-gray-50 p-6">
      {/* Top Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setEditingBook(null);
              setFormData({
                isbn: "",
                title: "",
                author: "",
                publisher: "",
                language: "",
                num_of_pages: 0,
                publication_date: "",
                price: 0,
                cover: null,
                sub_topic_id: "",
              });
              setShowModal(true);
            }}
            className="px-4 py-2 bg-green-500 text-white rounded flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Add Book</span>
          </button>

          <button
            onClick={() => setShowTopicModal(true)}
            className="px-4 py-2 bg-green-500 text-white rounded flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Add Topic</span>
          </button>

          <button
            onClick={() => setShowSubTopicModal(true)}
            className="px-4 py-2 bg-green-500 text-white rounded flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Add SubTopic</span>
          </button>
        </div>

        <button
          onClick={() => document.dispatchEvent(new Event("openSidebar"))}
          className="cursor-pointer flex items-center md:hidden text-gray-800"
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex space-x-4 items-center">
        <select
          value={filterTopic}
          onChange={(e) => {
            setFilterTopic(e.target.value);
            setFilterSubTopic("");
          }}
          className="p-2 border rounded"
        >
          <option value="">All Topics</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <select
          value={filterSubTopic}
          onChange={(e) => setFilterSubTopic(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All SubTopics</option>
          {subTopics
            .filter((st) =>
              filterTopic ? String(st.topic?.id) === filterTopic : true
            )
            .map((st) => (
              <option key={st.id} value={st.id}>
                {st.name}
              </option>
            ))}
        </select>

        <button
          onClick={() => {
            setFilterTopic("");
            setFilterSubTopic("");
          }}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <DataTable
          columns={columns}
          data={filteredBooks}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
          dense
        />
      </div>

      {/* ============ BOOK MODAL ============ */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[520px] max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingBook ? "Edit Book" : "Add New Book"}
            </h3>

            <div className="space-y-3">
              {/* Fields */}
              {[
                { name: "isbn", placeholder: "ISBN" },
                { name: "title", placeholder: "Title" },
                { name: "author", placeholder: "Author" },
                { name: "publisher", placeholder: "Publisher" },
                { name: "language", placeholder: "Language" },
              ].map((f) => (
                <input
                  key={f.name}
                  type="text"
                  placeholder={f.placeholder}
                  value={formData[f.name]}
                  onChange={(e) =>
                    setFormData({ ...formData, [f.name]: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              ))}

              <input
                type="number"
                placeholder="Number of Pages"
                value={formData.num_of_pages}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    num_of_pages: Number(e.target.value),
                  })
                }
                className="w-full p-2 border rounded"
              />

              <input
                type="date"
                value={formData.publication_date}
                onChange={(e) =>
                  setFormData({ ...formData, publication_date: e.target.value })
                }
                className="w-full p-2 border rounded"
              />

              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className="w-full p-2 border rounded"
              />

              <select
                value={formData.sub_topic_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sub_topic_id: Number(e.target.value),
                  })
                }
                className="w-full p-2 border rounded"
              >
                <option value="">Select SubTopic</option>
                {subTopics.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} {st.topic ? `(${st.topic.name})` : ""}
                  </option>
                ))}
              </select>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cover: e.target.files?.[0] || null,
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {editingBook ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ TOPIC MODAL ============ */}
      {showTopicModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add New Topic</h3>

            <input
              type="text"
              placeholder="Topic name"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowTopicModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTopic}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ SUBTOPIC MODAL ============ */}
      {showSubTopicModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add New SubTopic</h3>

            <select
              value={selectedTopicForSub}
              onChange={(e) =>
                setSelectedTopicForSub(
                  Number(e.target.value) || ""
                )
              }
              className="w-full p-2 border rounded mb-3"
            >
              <option value="">Select Topic</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="SubTopic name"
              value={newSubTopic}
              onChange={(e) => setNewSubTopic(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowSubTopicModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateSubTopic}
                className="px-4 py-2 bg-purple-600 text-white rounded"
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
