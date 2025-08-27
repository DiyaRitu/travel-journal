// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Left - Logo */}
      <Link to="/" className="text-xl font-bold hover:text-gray-200">
        Travel Journal
      </Link>

      {/* Right - Navigation */}
      <div className="space-x-6">
        {user ? (
          <>
            <Link to="/journals" className="hover:text-gray-200">
              Journals
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-200">
              Login
            </Link>
            <Link to="/register" className="hover:text-gray-200">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
