import { useLocation } from "react-router-dom";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Snackbar } from "@mui/material";

import { useActiveUser, useAlertCount, useNotificationStore } from "store";
import { socialService } from "services";
import { axiosInstance } from "services/config";

import { NotificationAlert } from "components/molecules";

const HIDE_TIME = 2500;

const NotificationProvider = (props: { children: ReactNode }) => {
  const { activeUser } = useActiveUser();
  const {
    notifications,
    addNotification,
    hideNotificationSnack,
    cleanNotifications,
  } = useNotificationStore();

  const [currentlyDisplayed, setCurrentlyDisplayed] = useState<number>(0);

  const location = useLocation();
  const isNotificationsPage = useMemo(
    () => location.pathname === "/notifications",
    [location]
  );

  const [interceptorAdded, setInterceptorAdded] = useState(false);

  const { data: alertCount, refetch } =
    socialService.useUncheckedNotificationsCount(activeUser?.id);
  const { setAlertCount } = useAlertCount();

  useEffect(() => {
    activeUser?.id && refetch();
  }, [refetch, location, activeUser?.id]);

  useEffect(() => {
    setAlertCount(alertCount || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertCount]);

  useEffect(() => {
    if (!interceptorAdded)
      axiosInstance.interceptors.response.use(
        (response) => {
          if (response.data.notification) {
            activeUser?.id && refetch();
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

    return () => {
      cleanNotifications();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interceptorAdded]);

  const toBeDisplayed = useMemo(() => {
    setCurrentlyDisplayed(0);
    return notifications.filter((n) => n && !n.checked && !n.snackHidden);
  }, [notifications]);

  return (
    <>
      {toBeDisplayed.map(
        (notification, index) =>
          !isNotificationsPage && (
            <Snackbar
              autoHideDuration={(index + 1) * HIDE_TIME}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              key={notification.id}
              onClose={() => {
                hideNotificationSnack(notification.id);
                setCurrentlyDisplayed(index + 1);
              }}
              open={!notification.snackHidden && index === currentlyDisplayed}
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
