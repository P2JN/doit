import { ReactNode, useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

import { useNotificationStore } from "store";
import { axiosInstance } from "services/config";

const NotificationProvider = (props: { children: ReactNode }) => {
  const {
    notifications,
    addNotification,
    dismissNotification,
    hideNotificationSnack,
  } = useNotificationStore();

  const [interceptorAdded, setInterceptorAdded] = useState(false);

  useEffect(() => {
    // Notification interceptor
    if (!interceptorAdded)
      axiosInstance.interceptors.response.use(
        (response) => {
          if (response.data.notification) {
            const { notification, ...rest } = response.data;
            addNotification(notification);

            const values = Object.values(rest)[0] as any;
            return { ...response, data: { ...values } };
          }
          return response;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

    setInterceptorAdded(true);
  }, [interceptorAdded]);

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
      {props.children}
    </>
  );
};

export default NotificationProvider;
