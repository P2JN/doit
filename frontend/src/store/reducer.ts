import { initialState } from "./store";

import { notificationReducer } from "./notifications/reducer";
import { ActionType as NotificationActionType } from "./notifications/reducer";
import { ActionType as AppActionType } from "./app/reducer";
import { appReducer } from "./app/reducer";

export type StoreAction = {
  type: NotificationActionType | AppActionType;
  payload: any;
};

export const Reducer = (state = initialState, action: StoreAction) => ({
  notifications: notificationReducer(state.notifications, action),
  app: appReducer(state.app, action),
});
