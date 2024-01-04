// App.js
import React from "react";
import { AuthProvider } from "./components/Auth/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import BackOfficePage from "./components/admin/BackOffice";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import LoginPage from "./components/admin/auth/LoginPage";
import SignupPage from "./components/admin/auth/SignupPage";
import { AdminAuthProvider } from "./components/admin/auth/AdminAuthContext";

const App = () => {
  const isBackOffice = window.location.pathname.startsWith("/admin");
  

  return (
    <AuthProvider>
      {isBackOffice ? (
        <AdminAuthProvider>
          <Router>
            <Routes>
              <Route path="/*" element={<BackOfficePage />} />
              <Route path="/admin/login/*" element={<LoginPage />} />
              <Route path="/admin/signup/*" element={<SignupPage />} />
            </Routes>
          </Router>
        </AdminAuthProvider>
      ) : (
        <Router>
          <Routes>
            <Route path="/*" element={<MainLayout />} />
          </Routes>
        </Router>
      )}
    </AuthProvider>
  );
}

export default App;
