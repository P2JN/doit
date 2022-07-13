import { useQuery } from "react-query";

import { GoalTypes } from "types";

import { axiosInstance } from "./config";

const requests = {
  getGoals: (filters?: string[]) =>
    axiosInstance
      .get("/goal/" + (!!filters ? "?" + filters?.join("&") : ""))
      .then((response) => response.data),
  // TODO: change hardcoded user example for the logged in user
  getMyGoals: () =>
    axiosInstance
      .get("/goal/?participant=62780be558f1bd7c8d2d3e71")
      .then((response) => response.data),

  getGoal: (id?: number) =>
    axiosInstance
      .get("/goal/" + (id || "missing"))
      .then((response) => response.data),

  // TODO: change hardcoded user example for the logged in user
  getMyGoalProgress: (id?: number) =>
    axiosInstance
      .get(
        "/goal/" +
          (id || "missing") +
          "/my-progress?user_id=62780be558f1bd7c8d2d3e71"
      )
      .then((response) => response.data),
};

const goalService = {
  // GOALS
  // Use all the goals
  useGoals: () =>
    useQuery<GoalTypes.Goal[], Error>("goals", () => requests.getGoals()),

  // Use my goals
  useMyGoals: () =>
    useQuery<GoalTypes.Goal[], Error>("my-goals", () => requests.getMyGoals()),

  // Use a goal specifying its id
  useGoal: (id?: number) =>
    useQuery<GoalTypes.Goal, Error>(`goal-${id}`, () => requests.getGoal(id)),

  // Use my goal progress specifying its id
  useMyGoalProgress: (id?: number) =>
    useQuery<GoalTypes.Progress, Error>(`goal-${id}-my-progress`, () =>
      requests.getMyGoalProgress(id)
    ),
};

export default goalService;
