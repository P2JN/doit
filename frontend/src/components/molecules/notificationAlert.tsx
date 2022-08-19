import { useMatch } from "react-router-dom";
import { Alert } from "@mui/material";
import { DoneAll } from "@mui/icons-material";

import { dateUtils } from "utils";
import { useNotificationStore } from "store";
import { StateNotification } from "store/notifications/state";

import { NotificationIcon } from "components/atoms";

const NotificationAlert = (notification: StateNotification) => {
  const { dismissNotification, hideNotificationSnack } = useNotificationStore();

  const isNotificationsPage = useMatch("/notifications/*");

  const onClose = isNotificationsPage
    ? notification.type === "transient"
      ? () => dismissNotification(notification.id)
      : undefined
    : () => hideNotificationSnack(notification.id);

  return (
    <Alert
      icon={
        notification.iconType && (
          <NotificationIcon icon={notification.iconType} />
        )
      }
      key={notification.id}
      severity={
        notification.type === "persistent" && !notification.checked
          ? "success"
          : notification.variant
      }
      onClose={onClose}
    >
      <p className="mb-1 text-sm leading-4">{notification.title}</p>
      <p>{notification.content}</p>
      <p className="mt-2 flex items-center">
        {notification.checked && <DoneAll fontSize="small" className="mr-2" />}
        {dateUtils.beautifyDate(notification.creationDate)}
      </p>
    </Alert>
  );
};

export default NotificationAlert;
