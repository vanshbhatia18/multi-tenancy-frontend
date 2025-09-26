import React, { useState, useEffect } from "react";
import { getToken, removeToken, getUserIdentity } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [tenantPlan, setTenantPlan] = useState("FREE"); // assume FREE initially
  const [slug, setTenantSlug] = useState("")
  const role = getUserIdentity()
  console.log(role, "the user identity is")
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`
  };

  useEffect(() => {

    fetchNotes()



  }, []);

  async function fetchNotes() {
    setLoading(true);
    try {

      // console.log(userIdentity, "the userIdentity is")
      const res = await fetch(`${apiUrl}/api/v1/notes/allNotes`, { headers });
      const data = await res.json();
      console.log(data, "val fafkjdvkb")
      setNotes(data.data || []);
      if (data.data[0].tenantId.plan) setTenantPlan(data.data[0].tenantId.plan);
      if (data.data[0].tenantId.slug) setTenantSlug(data.data[0].tenantId.slug)

    } catch (err) {
      if (err) {
        setError("Failed to load notes");
      }

    } finally {
      setLoading(false);
    }
  }

  async function saveNote(e) {
    e.preventDefault();
    if (tenantPlan === "FREE" && notes.length >= 3 && !editingId) {
      alert("Free plan reached. Upgrade to Pro!");
      return;
    }

    try {
      const body = { title, content };
      let res;
      if (editingId) {
        res = await fetch(`${apiUrl}/api/v1/notes/${editingId}`, {
          method: "PUT", headers, body: JSON.stringify(body)
        });
      } else {
        res = await fetch(`${apiUrl}/api/v1/notes/addNote`, {
          method: "POST", headers, body: JSON.stringify(body)
        });
      }
      const data = await res.json();
      if (!res.ok) throw data;
      setTitle(""); setContent(""); setEditingId(null);
      fetchNotes();
    } catch (err) {
      setError(err.message || "Error saving note");
    }
  }

  async function deleteNote(deleteId) {
    if (!confirm("Delete this note?")) return;
    try {
      console.log(deleteId, "the deleteId is ")
      const res = await fetch(`${apiUrl}/api/v1/notes/deleteNote/${deleteId}`, { method: "DELETE", headers });
      if (!res.ok) throw await res.json();
      fetchNotes();
    } catch (err) {
      setError(err.message || "Error deleting note");
    }
  }

  function editNote(note) {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
  }

  function viewNote(note) {
    navigate(`/getnote/${note._id}`); // go to SingleNote.jsx
  }

  function handleLogout() {
    removeToken();
    navigate("/login");
  }
  async function handleUpgradePlan() {

    const res = await fetch(`${apiUrl}/api/v1/notes/upgradePlan/${slug}`, { method: "PUT", headers });
    if (!res.ok) throw await res.json();
    const data = await res.json()
    console.log(data.plan);
    setTenantPlan(data.plan)
    fetchNotes();
  }
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6 px-5 gap-1 space-x-2">
        <h2 className="text-2xl font-bold">Hi  from Company Your Notes</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {error && <div className="text-red-600 mb-2">{error}</div>}

      <form onSubmit={saveNote} className="mb-6 space-y-2">
        <input
          className="w-full p-2 border rounded"
          placeholder="Title" value={title} onChange={e => setTitle(e.target.value)}
        />
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Content" value={content} onChange={e => setContent(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editingId ? "Update Note" : "Add Note"}
        </button>
      </form>

      {tenantPlan === "FREE" && notes.length >= 3 && (
        <div className="mb-4 text-center text-red-600">
          Free plan limit reached. {role == 'USER' ? <h1>you need to be admin to upgrade plan to pro</h1> : <button onClick={handleUpgradePlan} className="underline text-blue-600 hover:text-green-600 transition-colors duration-300">Upgrade to Pro</button>}
        </div>
      )}
      {tenantPlan === "PRO" ? <h1 className="text-green-500 text-2xl"> Congratualtion now you can add Unlimited Notes</h1> : null}
      {loading ? <p>Loading notes...</p> :
        <ul className="space-y-2">
          {notes.map(note => (

            <li key={note._id} className="border p-3 rounded flex justify-between items-start">
              <div>
                notes from {note.userId.username}-:
              </div>
              <div>
                <h3 className="font-semibold">{note.title}</h3>
                <p>{note.content}</p>
              </div>
              <div className="space-x-2">
                <button onClick={() => viewNote(note)} className="text-green-600 hover:underline">View</button>
                <button onClick={() => editNote(note)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => deleteNote(note._id)} className="text-red-600 hover:underline">Delete</button>
              </div>
            </li>
          ))}
        </ul>}
    </div>
  );
}
