import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

import api from "@/apiService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
  const [loading, setLoading] = useState(true);

  const csrf = () => axios.get("/sanctum/csrf-cookie");

  useEffect(() => {
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Fetch user profile if token exists but user state is empty (e.g., page refresh)
      if (!user) {
        api
          .get("/api/user")
          .then(({ data }) => setUser(data))
          .catch(() => logout())
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const login = async (credentials) => {
    const { data } = await api.post("/api/login", credentials);
    setUser(data.user);
    setToken(data.token);
  };

  const register = async (userData) => {
    const { data } = await api.post("/api/register", userData);
    setUser(data.user);
    setToken(data.token);
  };

  const logout = async () => {
    try {
      await api.post("/api/logout");
    } catch (e) {
      console.error("Logout failed on server", e);
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  // 1. Send reset link email
  const forgotPassword = async (email) => {
    await csrf();
    return api.post("/api/forgot-password", { email });
  };

  // 2. Reset the password using the token from the email link
  const resetPassword = async (data) => {
    await csrf();
    // data: { email, token, password, password_confirmation }
    return api.post("/api/reset-password", data);
  };

  const verifyEmail = async (id, hash, searchParams) => {
    return api.get(`/api/email/verify/${id}/${hash}?${searchParams}`);
  };

  const resendEmailVerification = async (user) => {
    await csrf();
    return api.post("/api/email/verification-notification", { user });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        verifyEmail,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
