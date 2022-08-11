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
};

const recommendationService = {
  useUserStats: (userId?: Id) =>
    useQuery<StatsTypes.UserStats, AxiosError>("getUserRecommendations", () =>
      requests.getUserStats(userId)
    ),
};

export default recommendationService;
