import { useQuery } from "react-query";

import { GoalTypes } from "types";
import { Id } from "types/apiTypes";

import { axiosInstance } from "./config";

const requests = {
  getGoals: (filters?: string[]) =>
    axiosInstance
      .get("/goal/" + (!!filters ? "?" + filters?.join("&") : ""))
      .then((response) => response.data),
  // TODO: change hardcoded user example for the logged in user
  getGoalsByParticipant: (participantId?: Id) =>
    axiosInstance
      .get("/goal/?participant=" + (participantId || "missing"))
      .then((response) => response.data),

  getGoal: (id?: number) =>
    axiosInstance
      .get("/goal/" + (id || "missing"))
      .then((response) => response.data),

  // TODO: change hardcoded user example for the logged in user
  getGoalProgressByParticipant: (id?: Id, participantId?: Id) =>
    axiosInstance
      .get(
        "/goal/" +
          (id || "missing") +
          "/my-progress?user_id=" +
          (participantId || "missing")
      )
      .then((response) => response.data),
};

const goalService = {
  // GOALS
  // Use all the goals
  useGoals: () =>
    useQuery<GoalTypes.Goal[], Error>("goals", () => requests.getGoals()),

  // Use my goals
  useGoalsByParticipant: (participantId?: Id) =>
    useQuery<GoalTypes.Goal[], Error>("my-goals", () =>
      requests.getGoalsByParticipant(participantId)
    ),

  // Use a goal specifying its id
  useGoal: (id?: number) =>
    useQuery<GoalTypes.Goal, Error>(`goal-${id}`, () => requests.getGoal(id)),

  // Use my goal progress specifying its id
  useMyGoalProgress: (id?: Id, participantId?: Id) =>
    useQuery<GoalTypes.Progress, Error>(`goal-${id}-my-progress`, () =>
      requests.getGoalProgressByParticipant(id, participantId)
    ),
};

export default goalService;
