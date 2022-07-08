import { createContext, Dispatch } from "react";
import { AppState } from "./app/state";
import { NotificationsState } from "./notifications/state";
import { StoreAction } from "./reducer";

export type StoreState = {
  app: AppState;
  notifications: NotificationsState;
};

export const initialState: StoreState = {
  app: {} as AppState,
  notifications: [] as NotificationsState,
};

export const Store = createContext<{
  state: StoreState;
  dispatch: Dispatch<StoreAction>;
}>({
  state: initialState,
  dispatch: () => null,
});
Store.displayName = "Store";
