// NotificationContext.js
import React, { createContext, useContext, useState, useRef } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const notificationIdCounter = useRef(0);

  const showNotification = (type, title, message) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { type, title, message, id: notificationIdCounter.current++ },
    ]);
  };

  const hideNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showNotification,
        hideNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
