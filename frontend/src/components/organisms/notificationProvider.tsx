import { useLocation } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { Snackbar } from "@mui/material";

import { useActiveUser, useAlertCount, useNotificationStore } from "store";
import { socialService } from "services";
import { axiosInstance } from "services/config";

import { NotificationAlert } from "components/molecules";

const NotificationProvider = (props: { children: ReactNode }) => {
  const { activeUser } = useActiveUser();
  const { notifications, addNotification, hideNotificationSnack } =
    useNotificationStore();

  const location = useLocation();

  const [interceptorAdded, setInterceptorAdded] = useState(false);

  const { data: alertCount, refetch } =
    socialService.useUncheckedNotificationsCount(activeUser?.id);
  const { setAlertCount } = useAlertCount();

  useEffect(() => {
    refetch();
  }, [refetch, location]);

  useEffect(() => {
    setAlertCount(alertCount || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertCount]);

  useEffect(() => {
    if (!interceptorAdded)
      axiosInstance.interceptors.response.use(
        (response) => {
          if (response.data.notification) {
            refetch();
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
