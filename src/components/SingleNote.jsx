import React, { useEffect, useState } from "react";
import { getToken } from "../utils/auth";
import { useParams, useNavigate, data } from "react-router-dom";

export default function SingleNote() {
  const { id } = useParams(); // Get note ID from URL
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchNote() {
      try {
        const res = await fetch(`${apiUrl}/api/v1/notes/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        if (!res.ok) throw data;
        console.log(data.data, "note data")
        setNote(data.data);
      } catch (err) {
        setError(err.message || "Failed to load note");
      } finally {
        setLoading(false);
      }
    }

    fetchNote();
  }, [id]);

  if (loading) return <p>Loading note...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (note == null) return <p>Note not found</p>;

  return (
    <div className="max-w-xl mx-auto p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-2">{note.title}</h2>
      <p className="mb-4">{note.content}</p>
      <button
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        onClick={() => navigate("/app")}
      >
        Back to Notes
      </button>
    </div>
  );
}
