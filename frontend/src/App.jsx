// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import JournalList from "./pages/JournalList";
import JournalForm from "./pages/JournalForm";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/journals"
          element={user ? <JournalList /> : <Navigate to="/login" />}
        />
        <Route
          path="/journals/new"
          element={user ? <JournalForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/journals/:id/edit"
          element={user ? <JournalForm /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}
