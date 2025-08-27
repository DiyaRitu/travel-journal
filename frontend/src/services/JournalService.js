import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/journals/"; // Adjust if backend runs elsewhere

// Get auth token from localStorage
const getAuthHeader = () => {
  const tokens = JSON.parse(localStorage.getItem("authTokens"));
  if (tokens) {
    return { Authorization: `Bearer ${tokens.access}` };
  }
  return {};
};

// Fetch all journals
export const getJournals = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeader() });
  return response.data;
};

// Create a new journal
export const createJournal = async (journalData) => {
  const response = await axios.post(API_URL, journalData, {
    headers: { ...getAuthHeader(), "Content-Type": "application/json" },
  });
  return response.data;
};

// Update a journal
export const updateJournal = async (id, journalData) => {
  const response = await axios.put(`${API_URL}${id}/`, journalData, {
    headers: { ...getAuthHeader(), "Content-Type": "application/json" },
  });
  return response.data;
};

// Delete a journal
export const deleteJournal = async (id) => {
  await axios.delete(`${API_URL}${id}/`, { headers: getAuthHeader() });
};
