import { SocialTypes } from "types";

export type AppState = {
  activeModal?: ModalType;
  activeUser?: UserType;
  alertCount?: number;
};

export type ModalType = "A" | "B" | "C";
export type UserType = SocialTypes.User;
