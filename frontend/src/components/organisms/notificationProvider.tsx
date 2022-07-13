import { Alert, Snackbar } from "@mui/material";

import { useNotificationStore } from "store";

const NotificationProvider = () => {
  const { notifications, dismissNotification, hideNotificationSnack } =
    useNotificationStore();

  return (
    <>
      {notifications.map(
        (notification) =>
          !notification.snackHidden && (
            <Snackbar
              autoHideDuration={5000}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              key={notification.id}
              onClose={() => hideNotificationSnack(notification.id)}
              open={!notification.snackHidden}
            >
              <Alert
                severity={notification.variant}
                onClose={() => dismissNotification(notification.id)}
              >
                <p className="text-sm">{notification.title}</p>
                <p>{notification.content}</p>
              </Alert>
            </Snackbar>
          )
      )}
    </>
  );
};

export default NotificationProvider;
