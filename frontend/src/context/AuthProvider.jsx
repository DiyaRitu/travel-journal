// src/context/AuthProvider.js
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import api from "../api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Register a new user
  const register = async (userData) => {
    const response = await api.post("/register/", userData);
    return response.data;
  };

  // Login user
  const login = async (credentials) => {
    try {
      const response = await api.post("/login/", {
        username: credentials.username,
        password: credentials.password,
      });

      const { access, refresh } = response.data;

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      setUser({ username: credentials.username });
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  // Restore user if token exists
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      setUser({ username: "persistedUser" });
    }
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, register, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
