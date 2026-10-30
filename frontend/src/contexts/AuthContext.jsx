import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // Fetch Logged In User
  const fetchProfile = async () => {
    try {
      const res = await API.get("auth/profile/");

      setUser(res.data);
    } catch (err) {
      console.log("Profile Error:", err);

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        fetchProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook
export const useAuth = () => {
  return useContext(AuthContext);
};