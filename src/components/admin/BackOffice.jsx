// BackOfficePage.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboardLayout from './layout/AdminDashboardLayout';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminStatisticsPage from './pages/AdminStatisticsPage';
import { useAuth } from '../Auth/AuthContext';

const BackOfficePage = () => {
  const { isAuthenticated } = useAuth();

//   if (!isAuthenticated) {
//     // Redirect to the login page if not authenticated
//     return <Navigate to="/admin/login" />;
//   }
  if (isAuthenticated) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/admin/login" />;
  }

  return (
    <AdminDashboardLayout>
      {/* Your admin dashboard content goes here */}
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin dashboard. Add your components, charts, and other features here.</p>
      <Routes>
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/statistics" element={<AdminStatisticsPage />} />
        {/* Add more admin-specific routes as needed */}
      </Routes>
    </AdminDashboardLayout>
  );
};

export default BackOfficePage;
