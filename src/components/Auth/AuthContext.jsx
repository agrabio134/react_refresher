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
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      const decodedToken = jwt_decode(storedToken);

      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("authToken");
        toggleLogin(false);
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
