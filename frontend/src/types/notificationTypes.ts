import { Id } from "./apiTypes";

export type Notification = {
  id?: Id;
  title?: string;
  content: string;
};
