import { AxiosError } from "axios";
import { useInfiniteQuery } from "react-query";

import { paginationUtils } from "utils";
import { GoalTypes, SocialTypes } from "types";
import { PagedList } from "types/apiTypes";

import { axiosInstance } from "./config";

const requests = {
  // receives a multipart form data
  searchUsers: (query?: string, page?: number) =>
    axiosInstance
      .get(`/user/?search_text=${query}&size=3${page ? `&page=${page}` : ""}`)
      .then((response) => response.data),

  searchPosts: (query?: string, page?: number) =>
    axiosInstance
      .get(`/post/?search_text=${query}&size=3${page ? `&page=${page}` : ""}`)
      .then((response) => response.data),

  searchGoals: (query?: string, page?: number) =>
    axiosInstance
      .get(`/goal/?search_text=${query}&size=3${page ? `&page=${page}` : ""}`)
      .then((response) => response.data),
};

const searchService = {
  useSearchUsers: (query?: string) =>
    useInfiniteQuery<PagedList<SocialTypes.User>, AxiosError>(
      ["searchUsers", query],
      ({ pageParam = 0 }) => requests.searchUsers(query, pageParam),
      {
        getNextPageParam: paginationUtils.getNextPage,
      }
    ),

  useSearchPosts: (query?: string) =>
    useInfiniteQuery<PagedList<SocialTypes.Post>, AxiosError>(
      ["searchPosts", query],
      ({ pageParam = 0 }) => requests.searchPosts(query, pageParam),
      {
        getNextPageParam: paginationUtils.getNextPage,
      }
    ),

  useSearchGoals: (query?: string) =>
    useInfiniteQuery<PagedList<GoalTypes.Goal>, AxiosError>(
      ["searchGoals", query],
      ({ pageParam = 0 }) => requests.searchGoals(query, pageParam),
      {
        getNextPageParam: paginationUtils.getNextPage,
      }
    ),
};

export default searchService;
