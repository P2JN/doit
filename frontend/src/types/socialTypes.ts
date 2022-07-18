import { Id } from "./apiTypes";

export type User = {
  id?: Id;
  username: string;
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  email: string;
  password?: string;
  password1?: string;
  password2?: string;
  birthDate: string;
  startDate: string;
};

export type LogIn = {
  username: string;
  password: string;
};
