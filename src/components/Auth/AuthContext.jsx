// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);

  const toggleLogin = (value) => {
    setIsLogin(value);
  };

  useEffect(() => {
    // Check if there's a token in sessionStorage
    const sessionToken = sessionStorage.getItem("authToken");
  
    if (sessionToken) {
      const decodedToken = jwt_decode(sessionToken);
  
      if (decodedToken.exp * 1000 < Date.now()) {
        sessionStorage.removeItem("authToken");
      } else {
        toggleLogin(true);
        return; // If there's a valid token in sessionStorage, no need to check localStorage
      }
    }
  
    // Check if there's a token in localStorage
    const localToken = localStorage.getItem("authToken");
  
    if (localToken) {
      const decodedToken = jwt_decode(localToken);
  
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("authToken");
      } else {
        toggleLogin(true);
      }
    }
  }, []);
  

  const handleLogin = (token) => {
    localStorage.setItem("authToken", token);
    toggleLogin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    toggleLogin(false);
  };

  return (
    <AuthContext.Provider value={{ isLogin, toggleLogin, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
