import { Id } from "./apiTypes";

export type User = {
  id?: Id;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  birthDate: string;
  startDate: string;

  first_name?: string;
  last_name?: string;
  password1?: string;
  password2?: string;

  media?: Id;
  urlMedia?: string;

  numFollowers?: number;
  numFollowing?: number;
  numPosts?: number;
};

export type Post = {
  id?: Id;
  title: string;
  content: string;
  creationDate: string;

  media?: Id;
  urlMedia?: string;

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
