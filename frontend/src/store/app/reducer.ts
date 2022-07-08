import { StoreAction } from "store/reducer";
import { AppState } from "./state";

export type ActionType = "SET_ACTIVE_MODAL" | "OTHER_ACTION";

export const appReducer = (state: AppState, action: StoreAction) => {
  switch (action.type) {
    case "SET_ACTIVE_MODAL":
      return { ...state, activeModal: action.payload };
    default:
      return state;
  }
};
