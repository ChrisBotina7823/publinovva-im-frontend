// Notification.js
import React, { useEffect } from 'react';
import { useNotification } from 'components/NotificationContext';
import MDSnackbar from 'components/MDSnackbar';

const Notification = () => {
  const { notifications, hideNotification } = useNotification();

  useEffect(() => {
    const timer = setInterval(() => {
      if (notifications.length > 0) {
        hideNotification(notifications[0].id);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [notifications, hideNotification]);

  return (
    <>
      {notifications.map((notification) => {
        switch (notification.type) {
            case "success":
                notification.icon = "check";
                break;
            case "error":
                notification.icon = "warning";
                break;
            default:
                notification.icon = "notifications";
        }
        const timestamp = new Date();
        const formattedDate = timestamp.toDateString();

        return (
            <MDSnackbar
              key={notification.id}
              open={true}
              color={notification.type}
              content={notification.message}
              title={notification.title}
              icon={notification.icon}
              dateTime={formattedDate}
              onClose={() => hideNotification(notification.id)}
              close={() => hideNotification(notification.id)}
              bgWhite
            />
          )
      })}
    </>
  );
};

export default Notification;
