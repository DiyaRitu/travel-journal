// src/pages/Login.jsx
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "", // Django expects "username"
    password: "", // Django expects "password"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      alert("✅ Logged in successfully!");
    } catch (error) {
      alert("❌ Error: " + (error.response?.data?.detail || "Invalid credentials"));
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {/* Username field */}
        <input
          type="text"
          name="username"
          placeholder="Username (e.g. diya_demo)"
          className="w-full p-2 mb-3 border rounded"
          value={formData.username}
          onChange={handleChange}
          required
        />

        {/* Password field */}
        <input
          type="password"
          name="password"
          placeholder="Password (e.g. ExamplePass123)"
          className="w-full p-2 mb-3 border rounded"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}
