// AdminNotifications.jsx
import React, { useState, useEffect } from 'react';

const AdminNotifications = ({ newAppointment }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (newAppointment) {
      // Add a new appointment notification
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { id: Date.now(), message: 'New appointment scheduled.' },
      ]);
    }
  }, [newAppointment]);

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminNotifications;
