// src/context/AuthProvider.js
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import api from "../api";

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

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

      const tokens = { access, refresh };
      setAuthTokens(tokens);
      setUser({ username: credentials.username });

      localStorage.setItem("authTokens", JSON.stringify(tokens));
      localStorage.setItem(
        "user",
        JSON.stringify({ username: credentials.username })
      );

      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("authTokens");
    localStorage.removeItem("user");
    setAuthTokens(null);
    setUser(null);
  };

  // Restore user & tokens on refresh
  useEffect(() => {
    if (localStorage.getItem("authTokens")) {
      setAuthTokens(JSON.parse(localStorage.getItem("authTokens")));
    }
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  const isAuthenticated = !!authTokens;

  return (
    <AuthContext.Provider
      value={{ user, authTokens, register, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
