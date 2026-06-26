import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // If we have a token, we consider the user logged in. 
    // In a real production app we would fetch the user profile from /api/auth/me,
    // but since we are keeping it clean and simple for a MERN assignment, 
    // we can parse/load the stored user details from localStorage.
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await API.post("/auth/login", { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setToken(token);
      setUser(userData);
      toast.success("Welcome back! Login successful.");
      navigate("/dashboard");
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed. Please check credentials.";
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (name, email, password) => {
    try {
      await API.post("/auth/register", { name, email, password });
      toast.success("Registration successful! Please login.");
      navigate("/login");
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed.";
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully.");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
