// src/components/JournalList.jsx
import { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import JournalForm from "./JournalForm";

export default function JournalList() {
  const { authTokens } = useContext(AuthContext);
  const [journals, setJournals] = useState([]);
  const [editingJournal, setEditingJournal] = useState(null); // track editing

  // ✅ useCallback prevents ESLint dependency warnings
  const fetchJournals = useCallback(async () => {
    try {
      const response = await api.get("/journals/", {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      setJournals(response.data);
    } catch (error) {
      console.error("Error fetching journals:", error);
    }
  }, [authTokens.access]);

  useEffect(() => {
    fetchJournals();
  }, [fetchJournals]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this journal?")) {
      try {
        await api.delete(`/journals/${id}/`, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        fetchJournals();
      } catch (error) {
        console.error("Error deleting journal:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Journals</h2>

      {/* Show form if editing or creating */}
      {editingJournal ? (
        <JournalForm
          existingJournal={editingJournal}
          onSuccess={() => {
            setEditingJournal(null);
            fetchJournals();
          }}
          onCancel={() => setEditingJournal(null)}
        />
      ) : (
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
          onClick={() => setEditingJournal({})} // empty means new journal
        >
          + New Journal
        </button>
      )}

      <ul className="space-y-4">
        {journals.map((journal) => (
          <li
            key={journal.id}
            className="border p-4 rounded shadow flex flex-col space-y-2"
          >
            <h3 className="text-lg font-semibold">{journal.title}</h3>
            <p>{journal.description}</p>
            <p className="text-sm text-gray-500">
              {journal.start_date} → {journal.end_date}
            </p>
            {journal.image && (
              <img
                src={journal.image}
                alt={journal.title}
                className="w-32 h-32 object-cover rounded"
              />
            )}
            <div className="flex space-x-2 mt-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => setEditingJournal(journal)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => handleDelete(journal.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
