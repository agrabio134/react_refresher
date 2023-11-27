// NotificationPopup.jsx
import React from 'react';
import './styles/NotificationPopUp.css'; // Import your CSS file for styling

const NotificationPopup = ({ isOpen, notifications, onClose }) => {
  return (
    <div className={`notification-popup ${isOpen ? 'open' : ''}`}>
      <div className="popup-content">
        <h2>Notifications</h2>
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id}>{notification.message}</li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default NotificationPopup;
