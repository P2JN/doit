import { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";

import { SocialTypes } from "types";
import { Id } from "types/apiTypes";

import { axiosInstance } from "./config";

const requests = {
  getUsers: (filters?: string[]) =>
    axiosInstance
      .get("/user/" + (!!filters ? "?" + filters?.join("&") : ""))
      .then((response) => response.data),

  getUser: (id?: Id) =>
    axiosInstance
      .get("/user/" + (id || "missing") + "/")
      .then((response) => response.data),

  createUser: (user: SocialTypes.User) =>
    axiosInstance.post("/auth/signup/", user).then((response) => response.data),

  logInUser: (login: SocialTypes.LogIn) =>
    axiosInstance.post("/auth/login/", login).then((response) => response.data),

  logOutUser: () =>
    axiosInstance.post("/auth/logout/").then((response) => response.data),

  getActiveUser: () =>
    axiosInstance.get("/auth/user/").then((response) => response.data),

  getFeedPosts: (userId?: Id) =>
    axiosInstance
      .get("/post/?follower=" + (userId || "missing"))
      .then((response) => response.data),
};

const socialService = {
  // USERS
  // Use all the users
  useUsers: () =>
    useQuery<SocialTypes.User[], AxiosError>("users", () =>
      requests.getUsers()
    ),
  // Use an user specifying its id
  useUser: (id?: Id) =>
    useQuery<SocialTypes.User, AxiosError>(`user-${id}`, () =>
      requests.getUser(id)
    ),
  // Use active user
  useActiveUser: () =>
    useQuery<{ mongoUser: SocialTypes.User }, AxiosError>("activeUser", () =>
      requests.getActiveUser()
    ),
  // Create an user
  useCreateUser: () =>
    useMutation<any, AxiosError, SocialTypes.User>(
      "create-user",
      requests.createUser
    ),

  // Use feed posts
  useFeedPosts: (userId?: Id) =>
    useQuery<SocialTypes.Post[], AxiosError>("feed-posts", () =>
      requests.getFeedPosts(userId)
    ),
  // Log in an user
  useLogin: () =>
    useMutation<any, AxiosError, SocialTypes.LogIn>(
      "login",
      requests.logInUser
    ),
  // Log out an user
  useLogout: () =>
    useMutation<any, AxiosError, any>("logout", requests.logOutUser),
};

export default socialService;
