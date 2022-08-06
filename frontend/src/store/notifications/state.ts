import { SocialTypes } from "types";

export interface StateNotification extends SocialTypes.Notification {
  type?: "persistent" | "transient";
  variant?: "success" | "error" | "warning" | "info";
  snackHidden?: boolean;
}

export type NotificationsState = StateNotification[];
