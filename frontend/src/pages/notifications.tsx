import { useEffect } from "react";
import { Alert } from "@mui/material";

import { socialService } from "services";
import { Page } from "layout";
import { useActiveUser, useNotificationStore } from "store";

import { DataLoader } from "components/molecules";

const NotificationsPage = () => {
  const { activeUser } = useActiveUser();
  const { notifications, addNotification, dismissNotification } =
    useNotificationStore();

  const {
    data: notificationPages,
    isLoading,
    error,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = socialService.useNotifications(activeUser?.id);

  useEffect(() => {
    notificationPages?.pages.forEach((page) => {
      page.results.forEach((notification) => {
        addNotification(notification);
      });
    });
  }, [notificationPages]);

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
        <DataLoader
          hasData={notifications?.length > 0}
          error={error}
          hasNextPage={hasNextPage}
          isLoading={isLoading}
          loadMore={fetchNextPage}
          retry={refetch}
        />
      </section>
    </Page>
  );
};

export default NotificationsPage;
