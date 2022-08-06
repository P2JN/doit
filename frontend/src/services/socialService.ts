import { AxiosError } from "axios";
import { useInfiniteQuery, useMutation, useQuery } from "react-query";

import { SocialTypes } from "types";
import { Id, PagedList } from "types/apiTypes";
import { paginationUtils } from "utils";

import { axiosInstance } from "./config";

const requests = {
  getUsers: (page?: number) =>
    axiosInstance
      .get("/user/?size=9" + (page ? "&page=" + page + "/" : ""))
      .then((response) => response.data),

  getUser: (id?: Id) =>
    axiosInstance
      .get("/user/" + (id || "missing") + "/")
      .then((response) => response.data),

  getFollowers: (userId?: Id, page?: number) =>
    axiosInstance
      .get(
        "/user/?followers=" +
          (userId || "missing") +
          (page ? "&page=" + page : "")
      )
      .then((response) => response.data),

  getFollowing: (userId?: Id, page?: number) =>
    axiosInstance
      .get(
        "/user/?following=" +
          (userId || "missing") +
          (page ? "&page=" + page : "")
      )
      .then((response) => response.data),

  createUser: (user: SocialTypes.User) =>
    axiosInstance.post("/auth/signup/", user).then((response) => response.data),

  updateUserPhoto: (props: { userId?: Id; mediaId?: Id }) =>
    axiosInstance
      .patch("/user/" + (props.userId || "missing") + "/", {
        media: props?.mediaId || null,
      })
      .then((response) => response.data),

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

  getGoalPosts: (goalId?: Id, page?: number) =>
    axiosInstance
      .get(
        "/post/?goal=" +
          (goalId || "missing") +
          "&order_by=-creationDate" +
          "&size=9" +
          (page ? "&page=" + page : "")
      )
      .then((response) => response.data),

  getUserPosts: (userId?: Id, page?: number) =>
    axiosInstance
      .get(
        "/post/?createdBy=" +
          (userId || "missing") +
          "&order_by=-creationDate" +
          "&size=9" +
          (page ? "&page=" + page : "")
      )
      .then((response) => response.data),

  getPosts: (page?: number) =>
    axiosInstance
      .get(
        "/post/?order_by=-creationDate&size=9" + (page ? "?page=" + page : "")
      )
      .then((response) => response.data),

  createPost: (post: SocialTypes.Post) =>
    axiosInstance.post("/post/", post).then((response) => response.data),

  getPostComments: (postId?: Id, page?: number) =>
    axiosInstance
      .get(
        "/comment/?post=" +
          (postId || "missing") +
          "&order_by=-creationDate" +
          "&size=5" +
          (page ? "&page=" + page : "")
      )
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

  getNotifications: (userId?: Id, page?: number) =>
    axiosInstance
      .get(
        "/notification/?order_by=-creationDate&user=" +
          (userId || "missing") +
          (page ? "&page=" + page : "")
      )
      .then((response) => response.data),

  getUncheckedNotificationsCount: (userId?: Id) =>
    axiosInstance
      .get("/user/" + (userId || "missing") + "/unchecked-notifications")
      .then((response) => response.data),

  checkNotification: (notificationId?: Id) =>
    axiosInstance
      .patch("/notification/" + (notificationId || "missing") + "/", {
        checked: true,
      })
      .then((response) => response.data),
};

const socialService = {
  // USERS
  // Use all the users
  useUsers: () =>
    useInfiniteQuery<PagedList<SocialTypes.User>, AxiosError>(
      "users",
      ({ pageParam = 0 }) => requests.getUsers(pageParam),
      {
        getNextPageParam: paginationUtils.getNextPage,
      }
    ),
  // Use an user specifying its id
  useUser: (id?: Id) =>
    useQuery<SocialTypes.User, AxiosError>(`user-${id}`, () =>
      requests.getUser(id)
    ),
  // Use the followers of an user
  useFollowers: (userId?: Id) =>
    useInfiniteQuery<PagedList<SocialTypes.User>, AxiosError>(
      "followers",
      ({ pageParam = 0 }) => requests.getFollowers(userId, pageParam),
      {
        getNextPageParam: paginationUtils.getNextPage,
      }
    ),
  // Use the following of an user
  useFollowing: (userId?: Id) =>
    useInfiniteQuery<PagedList<SocialTypes.User>, AxiosError>(
      "following",
      ({ pageParam = 0 }) => requests.getFollowing(userId, pageParam),
      {
        getNextPageParam: paginationUtils.getNextPage,
      }
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

  useUpdateUserPhoto: () =>
    useMutation<any, AxiosError, { userId?: Id; mediaId?: Id }>(
      "update-user-photo",
      requests.updateUserPhoto
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
        getNextPageParam: paginationUtils.getNextPage,
      }
    ),
  // Use goal posts
  useGoalPosts: (goalId?: Id) =>
    useInfiniteQuery<PagedList<SocialTypes.Post>, AxiosError>(
      "goal-posts-" + goalId,
      ({ pageParam = 0 }) => requests.getGoalPosts(goalId, pageParam),
      {
        getNextPageParam: paginationUtils.getNextPage,
      }
    ),
  // use user posts
  useUserPosts: (userId?: Id) =>
    useInfiniteQuery<PagedList<SocialTypes.Post>, AxiosError>(
      "user-posts-" + userId,
      ({ pageParam = 0 }) => requests.getUserPosts(userId, pageParam),
      {
        getNextPageParam: paginationUtils.getNextPage,
      }
    ),

  // use all the posts
  usePosts: () =>
    useInfiniteQuery<PagedList<SocialTypes.Post>, AxiosError>(
      "posts",
      ({ pageParam = 0 }) => requests.getPosts(pageParam),
      {
        getNextPageParam: paginationUtils.getNextPage,
      }
    ),

  // use create post
  useCreatePost: () =>
    useMutation<any, AxiosError, SocialTypes.Post>(
      "create-post",
      requests.createPost
    ),
  // Use post comments
  usePostComments: (postId?: Id) =>
    useInfiniteQuery<PagedList<SocialTypes.Comment>, AxiosError>(
      "post-comments-" + postId,
      ({ pageParam = 0 }) => requests.getPostComments(postId, pageParam),
      {
        getNextPageParam: paginationUtils.getNextPage,
      }
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

  // Use notifications
  useNotifications: (userId?: Id) =>
    useInfiniteQuery<PagedList<SocialTypes.Notification>, AxiosError>(
      "notifications-" + userId,
      ({ pageParam = 0 }) => requests.getNotifications(userId, pageParam),
      {
        getNextPageParam: paginationUtils.getNextPage,
      }
    ),
  // Use check notification
  useCheckNotification: () =>
    useMutation<any, AxiosError, Id>(
      "check-notification",
      requests.checkNotification
    ),
  // Use unchecked notifications count
  useUncheckedNotificationsCount: (userId?: Id) =>
    useQuery<number, AxiosError>(
      "unchecked-notifications-count-" + userId,
      () => requests.getUncheckedNotificationsCount(userId)
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
