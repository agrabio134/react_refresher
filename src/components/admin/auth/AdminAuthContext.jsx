// AdminAuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import jwt_decode from 'jwt-decode';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const toggleAdminLogin = (value) => {
    setIsAdminLogin(value);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("adminAuthToken");

    if (storedToken) {
      const decodedToken = jwt_decode(storedToken);

      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("adminAuthToken");
        toggleAdminLogin(false);
      } else {
        toggleAdminLogin(true);
      }
    }
  }, []);

  const handleAdminLogin = (token) => {
    localStorage.setItem("adminAuthToken", token);
    toggleAdminLogin(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminAuthToken");
    toggleAdminLogin(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminLogin, toggleAdminLogin, handleAdminLogin, handleAdminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
