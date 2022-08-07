import { AxiosError } from "axios";
import { useQuery } from "react-query";

import { RecommendationTypes } from "types";
import { Id } from "types/apiTypes";

import { axiosInstance } from "./config";

const requests = {
  getGoalRecommendations: (userId?: Id) =>
    axiosInstance
      .get("/user/" + (userId || "missing") + "/goal-recommendations")
      .then((response) => response.data),

  getPostRecommendations: (userId?: Id) =>
    axiosInstance
      .get("/user/" + (userId || "missing") + "/post-recommendations")
      .then((response) => response.data),

  getUserRecommendations: (userId?: Id) =>
    axiosInstance
      .get("/user/" + (userId || "missing") + "/user-recommendations")
      .then((response) => response.data),
};

const recommendationService = {
  useGoalRecommendations: (userId?: Id) =>
    useQuery<RecommendationTypes.GoalRecommendations, AxiosError>(
      "getGoalRecommendations",
      () => requests.getGoalRecommendations(userId)
    ),

  usePostRecommendations: (userId?: Id) =>
    useQuery<RecommendationTypes.PostRecommendations, AxiosError>(
      "getPostRecommendations",
      () => requests.getPostRecommendations(userId)
    ),

  useUserRecommendations: (userId?: Id) =>
    useQuery<RecommendationTypes.UserRecommendations, AxiosError>(
      "getUserRecommendations",
      () => requests.getUserRecommendations(userId)
    ),
};

export default recommendationService;
