import { ReactNode, useEffect, useState } from "react";
import { Snackbar } from "@mui/material";

import { useNotificationStore } from "store";
import { axiosInstance } from "services/config";

import { NotificationAlert } from "components/molecules";

const NotificationProvider = (props: { children: ReactNode }) => {
  const { notifications, addNotification, hideNotificationSnack } =
    useNotificationStore();

  const [interceptorAdded, setInterceptorAdded] = useState(false);

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interceptorAdded]);

  return (
    <>
      {notifications.map(
        (notification) =>
          notification &&
          !notification.checked &&
          !notification.snackHidden && (
            <Snackbar
              autoHideDuration={5000}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              key={notification.id}
              onClose={() => hideNotificationSnack(notification.id)}
              open={!notification.snackHidden}
            >
              <div>
                <NotificationAlert key={notification.id} {...notification} />
              </div>
            </Snackbar>
          )
      )}
      {props.children}
    </>
  );
};

export default NotificationProvider;
