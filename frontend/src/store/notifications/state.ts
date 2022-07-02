import { NotificationTypes } from "types";

export interface StateNotification extends NotificationTypes.Notification {
  type?: "persistent" | "transient";
  variant?: "success" | "error" | "warning" | "info";
  snackHidden?: boolean;
}

export type NotificationsState = StateNotification[];
