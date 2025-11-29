"use client";

import React, { useState, useEffect, useMemo } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faEdit,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import api from "@/api/axios";
import { useBooks } from "@/api/contexts/book-context";

type Topic = { id: number; name: string };
type SubTopic = { id: number; name: string; topic?: Topic | null };

export default function BooksPage() {
  const { books, loading, createBook, updateBook, deleteBook, fetchBooks } =
    useBooks();

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
  const [selectedTopicForSub, setSelectedTopicForSub] = useState<number | "">(
    ""
  );
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
      if (!sub || !sub.topic || String(sub.topic.id) !== filterTopic)
        return false;
    }

    if (filterSubTopic) {
      if (!sub || String(sub.id) !== filterSubTopic) return false;
    }

    return true;
  });

  const statsSummary = useMemo(() => {
    const topicIds = new Set<number>();
    const subTopicIds = new Set<number>();
    const authors = new Set<string>();

    books.forEach((book) => {
      if (book.sub_topic?.topic?.id) topicIds.add(book.sub_topic.topic.id);
      if (book.sub_topic?.id) subTopicIds.add(book.sub_topic.id);
      if (book.author) authors.add(book.author);
    });

    return {
      totalBooks: books.length,
      totalTopics: topicIds.size,
      totalSubTopics: subTopicIds.size,
      uniqueAuthors: authors.size,
    };
  }, [books]);

  const fieldClass =
    "w-full rounded-xl border border-gray-200 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--main-theme)]/30 focus:border-[var(--main-theme)] transition";

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

  const assetBase = useMemo(() => {
    const candidate =
      process.env.NEXT_PUBLIC_STORAGE_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      api.defaults.baseURL ||
      "";

    if (!candidate) return "";

    try {
      const url = new URL(candidate);
      const trimmedPath = url.pathname.replace(/\/api\/?$/, "");
      return `${url.origin}${trimmedPath}`.replace(/\/$/, "");
    } catch {
      return candidate.replace(/\/api\/?$/, "").replace(/\/$/, "");
    }
  }, []);

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
      cell: (row) => {
        const coverSrc = row.cover_url
          ? row.cover_url
          : row.cover
          ? row.cover.startsWith("http")
            ? row.cover
            : `${assetBase || ""}/storage/${row.cover}`.replace(
                /([^:]\/)\/+/g,
                "$1"
              )
          : "";

        return (
          <div className="w-12 h-16 rounded border overflow-hidden bg-gray-100">
            {row.cover ? (
              <img
                src={coverSrc}
                alt={row.title}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
        );
      },
    },

    {
      name: "Title",
      grow: 1.6,
      cell: (row) => <span className="font-semibold">{row.title}</span>,
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
    <>
      <div className="md:ml-64 min-h-screen bg-gray-50 p-6">
        <div className="mx-auto w-full space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <section className="border border-gray-100 rounded-2xl shadow-sm p-6">
             <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
               <div>
                 <p className="text-sm uppercase tracking-wide text-gray-500">
                   Library catalog
                 </p>
                 <h1 className="text-2xl font-semibold text-gray-900">
                   Books management
                 </h1>
                 <p className="text-sm text-gray-500 mt-1">
                   Maintain topics, subtopics, and inventory from a single place.
                 </p>
               </div>
               <div className="flex flex-wrap gap-2">
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
                   className="inline-flex items-center gap-2 rounded-xl border border-transparent bg-[var(--main-theme)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-95"
                 >
                   <FontAwesomeIcon icon={faPlus} />
                   <span>Add Book</span>
                 </button>

                 <button
                   onClick={() => setShowTopicModal(true)}
                   className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-[var(--main-theme)] hover:text-[var(--main-theme)]"
                 >
                   <FontAwesomeIcon icon={faPlus} />
                   <span>Add Topic</span>
                 </button>

                 <button
                   onClick={() => setShowSubTopicModal(true)}
                   className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-[var(--main-theme)] hover:text-[var(--main-theme)]"
                 >
                   <FontAwesomeIcon icon={faPlus} />
                   <span>Add SubTopic</span>
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
 
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
             {[
               { label: "Total books", value: statsSummary.totalBooks },
               { label: "Topics covered", value: statsSummary.totalTopics },
               { label: "Subtopics", value: statsSummary.totalSubTopics },
               { label: "Unique authors", value: statsSummary.uniqueAuthors },
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
 
          <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
             <div className="grid gap-4 md:grid-cols-3 items-end">
               <select
                 value={filterTopic}
                 onChange={(e) => {
                   setFilterTopic(e.target.value);
                   setFilterSubTopic("");
                 }}
                 className={fieldClass}
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
                 className={fieldClass}
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
                 className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
               >
                 Reset filters
               </button>
             </div>
           </section>
 
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <DataTable
               columns={columns}
               data={filteredBooks}
               progressPending={loading}
               pagination
               highlightOnHover
               striped
               dense
             />
           </section>
        </div>
       </div>
 
       {showModal && (
         <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
           <div className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl">
             <div className="space-y-1">
               <p className="text-xs uppercase tracking-widest text-gray-500">
                 {editingBook ? "Update entry" : "New entry"}
               </p>
               <h3 className="text-2xl font-semibold text-gray-900">
                 {editingBook ? "Edit Book" : "Add New Book"}
               </h3>
               <p className="text-sm text-gray-500">
                 Complete the form below to keep the catalog in sync.
               </p>
             </div>

             <div className="mt-6 grid gap-4 md:grid-cols-2">
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
                   className={fieldClass}
                 />
               ))}

               <input
                 type="number"
                 placeholder="Number of pages"
                 value={formData.num_of_pages}
                 onChange={(e) =>
                   setFormData({
                     ...formData,
                     num_of_pages: Number(e.target.value),
                   })
                 }
                 className={fieldClass}
               />

               <input
                 type="date"
                 value={formData.publication_date}
                 onChange={(e) =>
                   setFormData({
                     ...formData,
                     publication_date: e.target.value,
                   })
                 }
                 className={fieldClass}
               />

               <input
                 type="number"
                 placeholder="Price"
                 value={formData.price}
                 onChange={(e) =>
                   setFormData({ ...formData, price: Number(e.target.value) })
                 }
                 className={fieldClass}
               />

               <select
                 value={formData.sub_topic_id}
                 onChange={(e) =>
                   setFormData({
                     ...formData,
                     sub_topic_id: Number(e.target.value),
                   })
                 }
                 className={fieldClass}
               >
                 <option value="">Select SubTopic</option>
                 {subTopics.map((st) => (
                   <option key={st.id} value={st.id}>
                     {st.name} {st.topic ? `(${st.topic.name})` : ""}
                   </option>
                 ))}
               </select>

               <label className="md:col-span-2">
                 <span className="mb-2 block text-sm font-medium text-gray-600">
                   Cover image
                 </span>
                 <input
                   type="file"
                   accept="image/*"
                   onChange={(e) =>
                     setFormData({
                       ...formData,
                       cover: e.target.files?.[0] || null,
                     })
                   }
                   className={`${fieldClass} file:mr-4 file:rounded file:border-0 file:bg-[var(--main-theme)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white`}
                 />
               </label>
             </div>

             <div className="mt-6 flex flex-col gap-3 md:flex-row md:justify-end">
               <button
                 onClick={() => setShowModal(false)}
                 className="inline-flex w-full justify-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 md:w-auto"
               >
                 Cancel
               </button>
               <button
                 onClick={handleSave}
                 className="inline-flex w-full justify-center rounded-xl bg-[var(--main-theme)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-95 md:w-auto"
               >
                 {editingBook ? "Update book" : "Save book"}
               </button>
             </div>
           </div>
         </div>
       )}

       {showTopicModal && (
         <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
           <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl">
             <h3 className="text-xl font-semibold text-gray-900">
               Add New Topic
             </h3>
             <p className="text-sm text-gray-500">
               Group related subtopics to keep the taxonomy clean.
             </p>

             <div className="mt-4 space-y-4">
               <input
                 type="text"
                 placeholder="Topic name"
                 value={newTopic}
                 onChange={(e) => setNewTopic(e.target.value)}
                 className={fieldClass}
               />

               <div className="flex flex-col gap-3 md:flex-row md:justify-end">
                 <button
                   onClick={() => setShowTopicModal(false)}
                   className="inline-flex w-full justify-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 md:w-auto"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={handleCreateTopic}
                   className="inline-flex w-full justify-center rounded-xl bg-[var(--main-theme)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-95 md:w-auto"
                 >
                   Save topic
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       {showSubTopicModal && (
         <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
           <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl">
             <h3 className="text-xl font-semibold text-gray-900">
               Add New SubTopic
             </h3>
             <p className="text-sm text-gray-500">
               Attach the subtopic to a parent topic to keep relationships clear.
             </p>

             <div className="mt-4 space-y-4">
               <select
                 value={selectedTopicForSub}
                 onChange={(e) =>
                   setSelectedTopicForSub(Number(e.target.value) || "")
                 }
                 className={fieldClass}
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
                 placeholder="Subtopic name"
                 value={newSubTopic}
                 onChange={(e) => setNewSubTopic(e.target.value)}
                 className={fieldClass}
               />

               <div className="flex flex-col gap-3 md:flex-row md:justify-end">
                 <button
                   onClick={() => setShowSubTopicModal(false)}
                   className="inline-flex w-full justify-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 md:w-auto"
                 >
                   Cancel
                 </button>

                 <button
                   onClick={handleCreateSubTopic}
                   className="inline-flex w-full justify-center rounded-xl bg-[var(--main-theme)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-95 md:w-auto"
                 >
                   Save subtopic
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
     </>
   );
 }