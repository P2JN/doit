import { useEffect } from "react";

import { socialService } from "services";
import { Page } from "layout";
import { useActiveUser, useNotificationStore } from "store";

import { DataLoader, NotificationAlert } from "components/molecules";

const NotificationsPage = () => {
  const { activeUser } = useActiveUser();
  const { notifications, addNotification } = useNotificationStore();

  const {
    data: notificationPages,
    isLoading,
    error,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = socialService.useNotifications(activeUser?.id);

  const { mutate: checkNotification } = socialService.useCheckNotification();

  useEffect(() => {
    notificationPages?.pages.forEach((page) => {
      page.results.forEach((notification) => {
        console.log(notification);
        addNotification(notification);
      });
    });

    return () => {
      notifications.forEach((notification) => {
        notification.id &&
          !notification.checked &&
          checkNotification(notification.id);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkNotification, notificationPages]);

  return (
    <Page title="Actividad">
      <section className="my-4 flex flex-col gap-3">
        {notifications
          .sort(
            (a, b) =>
              new Date(b?.creationDate || 0).getTime() -
              new Date(a?.creationDate || 0).getTime()
          )
          .map((notification) => (
            <NotificationAlert key={notification.id} {...notification} />
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
