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
      .get("/post/?follows=" + (userId || "missing"))
      .then((response) => response.data),

  getPosts: () => axiosInstance.get("/post/").then((response) => response.data),

  getPostComments: (postId?: Id) =>
    axiosInstance
      .get("/comment/?post=" + (postId || "missing"))
      .then((response) => response.data),

  createComment: (comment: SocialTypes.Comment) =>
    axiosInstance.post("/comment/", comment).then((response) => response.data),

  followUser: (follow: SocialTypes.Follow) =>
    axiosInstance.post("/follow/", follow).then((response) => response.data),

  unfollowUser: (followId?: Id) =>
    axiosInstance
      .delete("/follow/" + (followId || "missing") + "/")
      .then((response) => response.data),

  getFollow: (userId?: Id, followerId?: Id) =>
    axiosInstance
      .get(
        "/follow/?user=" +
          (userId || "missing") +
          "&follower=" +
          (followerId || "missing")
      )
      .then((response) => response.data?.[0]),
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
  // follow an user
  useFollow: () =>
    useMutation<any, AxiosError, SocialTypes.Follow>(
      "follow-user",
      requests.followUser
    ),
  // unfollow an user
  useUnfollow: () =>
    useMutation<any, AxiosError, Id>("unfollow-user", requests.unfollowUser),
  // is follwing an user
  useFollowData: (userId?: Id, followerId?: Id) =>
    useQuery<SocialTypes.Follow, AxiosError>(
      `is-following-${userId}-${followerId}`,
      () => requests.getFollow(userId, followerId)
    ),

  // Use feed posts
  useFeedPosts: (userId?: Id) =>
    useQuery<SocialTypes.Post[], AxiosError>("feed-posts-" + userId, () =>
      requests.getFeedPosts(userId)
    ),
  // use all the posts
  usePosts: () =>
    useQuery<SocialTypes.Post[], AxiosError>("posts", () =>
      requests.getPosts()
    ),
  // Use post comments
  usePostComments: (postId?: Id) =>
    useQuery<SocialTypes.Comment[], AxiosError>("post-comments-" + postId, () =>
      requests.getPostComments(postId)
    ),
  // Use create comment
  useCreateComment: () =>
    useMutation<any, AxiosError, SocialTypes.Comment>(
      "create-comment",
      requests.createComment
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
