// src/components/JournalForm.jsx
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api";

export default function JournalForm({ existingJournal, onSuccess, onCancel }) {
  const { authTokens } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    privacy: "public",
    tags: "",
    image: null,
  });

  // Pre-fill if editing
  useEffect(() => {
    if (existingJournal && existingJournal.id) {
      setFormData({
        title: existingJournal.title || "",
        description: existingJournal.description || "",
        start_date: existingJournal.start_date || "",
        end_date: existingJournal.end_date || "",
        privacy: existingJournal.privacy || "public",
        tags: existingJournal.tags || "",
        image: null, // don’t pre-fill file
      });
    }
  }, [existingJournal]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      if (existingJournal && existingJournal.id) {
        // update
        await api.put(`/journals/${existingJournal.id}/`, data, {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // create
        await api.post("/journals/", data, {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving journal:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded shadow flex flex-col space-y-3 mb-4"
    >
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <div className="flex space-x-2">
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>

      <select
        name="privacy"
        value={formData.privacy}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>

      <input
        type="text"
        name="tags"
        placeholder="Tags (comma separated)"
        value={formData.tags}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <div className="flex space-x-2">
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          {existingJournal && existingJournal.id ? "Update" : "Create"}
        </button>
        {onCancel && (
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
