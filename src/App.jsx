import React from "react";
import { AuthProvider } from "./components/Auth/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import BackOfficePage from "./components/admin/BackOffice";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/admin/auth/LoginPage";

function App() {
  const isBackOffice = window.location.pathname.startsWith("/admin");

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {isBackOffice ? (
            <Route path="/*" element={<BackOfficePage />} />
          ) : (
            <Route path="/*" element={<MainLayout />} />
          )}
          <Route path="/admin/login/*" element={<LoginPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
