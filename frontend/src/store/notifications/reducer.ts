import { StoreAction } from "store/reducer";
import { StateNotification } from "./state";

export type ActionType =
  | "ADD_NOTIFICATION"
  | "CLEAR_NOTIFICATIONS"
  | "DISMISS_NOTIFICATION"
  | "HIDE_NOTIFICATION_SNACK"
  | "OTHER_ACTION";

export const notificationReducer = (
  state: StateNotification[],
  action: StoreAction
) => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return state.concat(action.payload);
    case "DISMISS_NOTIFICATION":
      return state.filter((notification) => notification.id !== action.payload);
    case "HIDE_NOTIFICATION_SNACK":
      return state.map((notification) => {
        if (notification.id === action.payload) {
          return { ...notification, snackHidden: true };
        }
        return notification;
      });

    case "CLEAR_NOTIFICATIONS":
      return [];
    default:
      return state;
  }
};
