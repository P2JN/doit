import { useContext } from "react";
import { Store } from "store/store";
import { Id } from "types/apiTypes";
import { StateNotification } from "./state";

export const useNotificationStore = () => {
  const { state, dispatch } = useContext(Store);
  const { notifications } = state;

  const addNotification = (notification: StateNotification) => {
    if (!notification.id) {
      notification.id = Math.random() * 100000;
      notification.type = "transient";
    } else {
      notification.type = "persistent";
      notification.variant = "info";
    }

    if (!notification.creationDate) {
      notification.creationDate = new Date().toISOString();
    }

    const existingNotification = notifications.find(
      (n) => n.id === notification.id
    );

    if (!existingNotification) {
      dispatch({ type: "ADD_NOTIFICATION", payload: notification });
    } else {
      dispatch({ type: "UPDATE_NOTIFICATION", payload: notification });
    }
  };

  const cleanNotifications = () => {
    dispatch({
      type: "CLEAR_NOTIFICATIONS",
      payload: undefined,
    });
  };

  const dismissNotification = (id?: Id) => {
    !!id && dispatch({ type: "DISMISS_NOTIFICATION", payload: id });
  };

  const hideNotificationSnack = (id?: Id) => {
    !!id && dispatch({ type: "HIDE_NOTIFICATION_SNACK", payload: id });
  };

  return {
    notifications,
    addNotification,
    cleanNotifications,
    dismissNotification,
    hideNotificationSnack,
  };
};
