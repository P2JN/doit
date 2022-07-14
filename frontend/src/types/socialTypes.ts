import { Id } from "./apiTypes";

export type User = {
  id?: Id;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  birthDate: string;
  startDate: string;
};
