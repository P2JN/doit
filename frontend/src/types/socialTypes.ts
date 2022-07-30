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

  numFollowers?: number;
  numFollowing?: number;
  numPosts?: number;
};

export type Post = {
  id?: Id;
  title: string;
  content: string;
  creationDate: string;

  createdBy: Id;
  goal?: Id;

  likes?: number;
  numComments?: number;
};

export type Comment = {
  id?: Id;
  content: string;
  creationDate?: string;
  createdBy: Id;
  post: Id;
};

export type Like = {
  id?: Id;
  createdBy: Id;
  post: Id;
};

export type LogIn = {
  username: string;
  password: string;
};

export type Follow = {
  id?: Id;
  follower: Id;
  user: Id;
};
