// NotificationIcon.jsx
import React from 'react';
import './styles/NotificationIcon.css'; // Import your CSS file for styling

const NotificationIcon = ({ onClick }) => {
  return (
    <div className="notification-icon" onClick={onClick}>
      <i className="fa fa-bell"></i>
    </div>
  );
};

export default NotificationIcon;
