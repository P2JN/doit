import { useEffect } from "react";
import { Alert } from "@mui/material";

import { Page } from "layout";
import { useNotificationStore } from "store";

const NotificationsPage = () => {
  const { notifications, addNotification, dismissNotification } =
    useNotificationStore();

  useEffect(() => {
    // Notification Demo
    addNotification({
      content: "This is a notification test",
      title: "Notification Test Completed",
      variant: "success",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page title="Notifications">
      <div className="overflow-hidden">Notifications Content</div>
      <section className="mt-4 flex flex-col gap-3">
        {notifications.map((notification) => (
          <Alert
            key={notification.id}
            severity={notification.variant}
            onClose={
              notification.type !== "persistent"
                ? () => dismissNotification(notification.id)
                : undefined
            }
          >
            <p className="text-sm">{notification.title}</p>
            <p>{notification.content}</p>
          </Alert>
        ))}
      </section>
    </Page>
  );
};

export default NotificationsPage;
