export type AppState = {
  activeModal?: ModalType;
  activeUser?: UserType;
};

export type ModalType = "A" | "B" | "C";
export type UserType = { name: string };
