import { Alert } from "@mui/material";

import { Page } from "layout";
import { useNotificationStore } from "store";

const NotificationsPage = () => {
  const { notifications, dismissNotification } = useNotificationStore();

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
