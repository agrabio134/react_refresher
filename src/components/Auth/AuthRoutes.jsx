// AuthRoutes.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "../../components/layout/AuthLayout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/auth/login" />} />
      <Route
        path="/login"
        element={
          <>
            <LoginPage />
          </>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthLayout>
            <SignupPage />
          </AuthLayout>
        }
      />
    </Routes>
  );
};

export default AuthRoutes;
