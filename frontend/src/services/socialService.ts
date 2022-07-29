import { AxiosError } from "axios";
import { useInfiniteQuery, useMutation, useQuery } from "react-query";

import { SocialTypes } from "types";
import { Id, PagedList } from "types/apiTypes";

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

  getFeedPosts: (userId?: Id, page?: number) =>
    axiosInstance
      .get(
        "/post/?follows=" +
          (userId || "missing") +
          "&order_by=-creationDate" +
          (page ? "&page=" + page : "")
      )
      .then((response) => response.data),

  getGoalPosts: (goalId?: Id) =>
    axiosInstance
      .get("/post/?goal=" + (goalId || "missing"))
      .then((response) => response.data),

  getUserPosts: (userId?: Id) =>
    axiosInstance
      .get("/post/?createdBy=" + (userId || "missing"))
      .then((response) => response.data),

  getPosts: () => axiosInstance.get("/post/").then((response) => response.data),

  createPost: (post: SocialTypes.Post) =>
    axiosInstance.post("/post/", post).then((response) => response.data),

  getPostComments: (postId?: Id) =>
    axiosInstance
      .get("/comment/?post=" + (postId || "missing"))
      .then((response) => response.data),

  createComment: (comment: SocialTypes.Comment) =>
    axiosInstance.post("/comment/", comment).then((response) => response.data),

  createLike: (like: SocialTypes.Like) =>
    axiosInstance.post("/like-post/", like).then((response) => response.data),
  removeLike: (likeId: Id) =>
    axiosInstance
      .delete("/like-post/" + (likeId || "missing") + "/")
      .then((response) => response.data),
  getLike: (userId?: Id, post?: Id) =>
    axiosInstance
      .get(
        "/like-post/?createdBy=" +
          (userId || "missing") +
          "&post=" +
          (post || "missing")
      )
      .then((response) => response.data?.results?.[0]),

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
      .then((response) => response.data?.results?.[0]),
};

const socialService = {
  // USERS
  // Use all the users
  useUsers: () =>
    useQuery<PagedList<SocialTypes.User>, AxiosError>("users", () =>
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
    useInfiniteQuery<PagedList<SocialTypes.Post>, AxiosError>(
      "feed-posts-" + userId,
      ({ pageParam = 0 }) => requests.getFeedPosts(userId, pageParam),
      {
        getNextPageParam: (lastPage) => lastPage.next?.split("page=").pop(),
      }
    ),
  // Use goal posts
  useGoalPosts: (goalId?: Id) =>
    useQuery<PagedList<SocialTypes.Post>, AxiosError>(
      "goal-posts-" + goalId,
      () => requests.getGoalPosts(goalId)
    ),
  // use user posts
  useUserPosts: (userId?: Id) =>
    useQuery<PagedList<SocialTypes.Post>, AxiosError>(
      "user-posts-" + userId,
      () => requests.getUserPosts(userId)
    ),
  // use all the posts
  usePosts: () =>
    useQuery<PagedList<SocialTypes.Post>, AxiosError>("posts", () =>
      requests.getPosts()
    ),
  // use create post
  useCreatePost: () =>
    useMutation<any, AxiosError, SocialTypes.Post>(
      "create-post",
      requests.createPost
    ),
  // Use post comments
  usePostComments: (postId?: Id) =>
    useQuery<PagedList<SocialTypes.Comment>, AxiosError>(
      "post-comments-" + postId,
      () => requests.getPostComments(postId)
    ),
  // Use create comment
  useCreateComment: () =>
    useMutation<any, AxiosError, SocialTypes.Comment>(
      "create-comment",
      requests.createComment
    ),
  //use like creation
  useCreateLike: () =>
    useMutation<any, AxiosError, SocialTypes.Like>(
      "create-like",
      requests.createLike
    ),
  //use like deletion
  useRemoveLike: () =>
    useMutation<any, AxiosError, Id>("remove-like", requests.removeLike),
  //use like data
  useLike: (userId?: Id, post?: Id) =>
    useQuery<SocialTypes.Like, AxiosError>(`like-${userId}-${post}`, () =>
      requests.getLike(userId, post)
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
