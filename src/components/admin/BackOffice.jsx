import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboardLayout from "./layout/AdminDashboardLayout";
import AdminUsersPage from "./pages/AdminUsersPage";
import { useAdminAuth } from "./auth/AdminAuthContext";
import "./styles/Dashboard.css";
import "./styles/Card.css";
import NotificationIcon from "./components/NotificationIcon";
import NotificationPopup from "./components/NotificationPopup";
import AdminCalendarPage from "./pages/AdminCalendarPage";

import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminContentPage from "./pages/AdminContentPage";

const BackOfficePage = () => {
  const { isAdminLogin } = useAdminAuth();

  const [newAppointment, setNewAppointment] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const createNewAppointment = () => {
    setNewAppointment(true);

    setTimeout(() => {
      setNewAppointment(false);
    }, 5000);
  };

  const closeNotifications = () => {
    setShowNotifications(false);
  };

  const openNotifications = () => {
    // Optionally, you can fetch notifications data here
    // For simplicity, let's use a static notification for demo
    const notifications = [{ id: 1, message: "New appointment scheduled." }];
    setShowNotifications(true);
  };

  if (localStorage.getItem("adminAuthToken")) {
    return (
      <AdminDashboardLayout>
        <div className="dashboard light-bg">
          <div className="dashboard-header">
            <div className="adminText">
              <h1>Happy Paws | Backoffice</h1>
            </div>
            <div className="notification-container">
              <NotificationIcon
                onClick={openNotifications}
                className="notification-icon"
              />
              <NotificationPopup
                isOpen={showNotifications}
                onClose={closeNotifications}
                notifications={[]}
              />
            </div>
          </div>

          <Routes>
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/" element={<AdminDashboardPage />} />
            <Route path="/admin/calendar" element={<AdminCalendarPage />} />
            <Route path="/admin/content" element={<AdminContentPage />} />
            {/* Add more admin-specific routes as needed */}
          </Routes>
        </div>
      </AdminDashboardLayout>
    );
  } else {
    return <Navigate to="/admin/login" />;
  }
};

export default BackOfficePage;
