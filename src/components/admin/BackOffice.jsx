import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboardLayout from "./layout/AdminDashboardLayout";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminStatisticsPage from "./pages/AdminStatisticsPage";
import { useAdminAuth } from "./auth/AdminAuthContext";
import "./styles/Dashboard.css";
import NotificationIcon from "./components/NotificationIcon";
import NotificationPopup from "./components/NotificationPopup";

const BackOfficePage = () => {
  const { isAdminLogin } = useAdminAuth();
  const [userCount, setUserCount] = useState(0);
  const [galleryCount, setGalleryCount] = useState(0);
  const [blogCount, setBlogCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [newAppointment, setNewAppointment] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Fetch data and update state variables
    // Replace the following with actual API calls
    setUserCount(Math.floor(Math.random() * 100));
    setGalleryCount(Math.floor(Math.random() * 100));
    setBlogCount(Math.floor(Math.random() * 100));
    setAppointmentCount(Math.floor(Math.random() * 100));
  }, []);

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
            <h1>Admin Dashboard</h1>
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
          <div className="card-container">
            <div className="card user-card">
              <h2>Total Users</h2>
              <p>{userCount}</p>
            </div>
            <div className="card gallery-card">
              <h2>Gallery Items</h2>
              <p>{galleryCount}</p>
            </div>
            <div className="card blog-card">
              <h2>Published Blogs</h2>
              <p>{blogCount}</p>
            </div>
            <div className="card appointment-card">
              <h2>Appointments Scheduled</h2>
              <p>{appointmentCount}</p>
            </div>
          </div>
          <Routes>
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin" element={<AdminStatisticsPage />} />
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
