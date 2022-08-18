import { AxiosError } from "axios";
import { useQuery } from "react-query";

import { StatsTypes } from "types";
import { Id } from "types/apiTypes";

import { axiosInstance } from "./config";

const requests = {
  getUserStats: (userId?: Id) =>
    axiosInstance
      .get("/user/" + (userId || "missing") + "/stats")
      .then((response) => response.data),

  getGoalStats: (goalId?: Id, userId?: Id, refDay?: string) =>
    axiosInstance
      .get(
        "/goal/" +
          (goalId || "missing") +
          "/stats?userId=" +
          (userId || "missing") +
          "&refDay=" +
          (refDay || "missing")
      )
      .then((response) => response.data),
};

const recommendationService = {
  useUserStats: (userId?: Id) =>
    useQuery<StatsTypes.UserStats, AxiosError>("getUserRecommendations", () =>
      requests.getUserStats(userId)
    ),

  useWeekData: (goalId?: Id, userId?: Id, refDay?: string) =>
    useQuery<StatsTypes.GoalStats, AxiosError>(
      `get-${goalId}-stats-${refDay}`,
      () => requests.getGoalStats(goalId, userId, refDay)
    ),
};

export default recommendationService;
