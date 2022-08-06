import { StoreAction } from "store/reducer";
import { AppState } from "./state";

export type ActionType =
  | "SET_ACTIVE_MODAL"
  | "SET_ACTIVE_USER"
  | "OTHER_ACTION"
  | "SET_ALERT_COUNT";

export const appReducer = (state: AppState, action: StoreAction) => {
  switch (action.type) {
    case "SET_ACTIVE_MODAL":
      return { ...state, activeModal: action.payload };
    case "SET_ALERT_COUNT":
      return { ...state, alertCount: action.payload };
    case "SET_ACTIVE_USER":
      return { ...state, activeUser: action.payload };
    default:
      return state;
  }
};
