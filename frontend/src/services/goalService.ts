import { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";

import { GoalTypes } from "types";
import { Id } from "types/apiTypes";

import { axiosInstance } from "./config";

const requests = {
  getGoals: () => axiosInstance.get("/goal/").then((response) => response.data),

  getGoalsByParticipant: (participantId?: Id) =>
    axiosInstance
      .get("/goal/?participant=" + (participantId || "missing"))
      .then((response) => response.data),

  getGoal: (id?: Id) =>
    axiosInstance
      .get("/goal/" + (id || "missing") + "/")
      .then((response) => response.data),

  getGoalProgressByParticipant: (id?: Id, participantId?: Id) =>
    axiosInstance
      .get(
        "/goal/" +
          (id || "missing") +
          "/my-progress?user_id=" +
          (participantId || "missing")
      )
      .then((response) => response.data),

  createGoal: (goal: GoalTypes.Goal) =>
    axiosInstance.post("/goal/", goal).then((response) => response.data),

  createObjective: (objective: GoalTypes.Objective) =>
    axiosInstance
      .post("/objective/", objective)
      .then((response) => response.data),

  createParticipation: (participation: GoalTypes.Participation) =>
    axiosInstance
      .post("/participate/", participation)
      .then((response) => response.data),

  createTracking: (tracking: GoalTypes.Tracking) =>
    axiosInstance
      .post("/tracking/", tracking)
      .then((response) => response.data),
};

const goalService = {
  // GOALS
  // Use all the goals
  useGoals: () =>
    useQuery<GoalTypes.Goal[], AxiosError>("goals", () => requests.getGoals()),

  // Use my goals
  useGoalsByParticipant: (participantId?: Id) =>
    useQuery<GoalTypes.Goal[], AxiosError>("my-goals", () =>
      requests.getGoalsByParticipant(participantId)
    ),

  // Use a goal specifying its id
  useGoal: (id?: Id) =>
    useQuery<GoalTypes.Goal, AxiosError>(`goal-${id}`, () =>
      requests.getGoal(id)
    ),

  // Use my goal progress specifying its id
  useMyGoalProgress: (id?: Id, participantId?: Id) =>
    useQuery<GoalTypes.Progress, AxiosError>(`goal-${id}-my-progress`, () =>
      requests.getGoalProgressByParticipant(id, participantId)
    ),

  // Create a goal
  useCreateGoal: () =>
    useMutation<any, AxiosError, GoalTypes.Goal>(requests.createGoal),

  // Ceate an objective
  useCreateObjective: () =>
    useMutation<any, AxiosError, GoalTypes.Objective>(requests.createObjective),

  // Create a participation
  useCreateParticipation: () =>
    useMutation<any, AxiosError, GoalTypes.Participation>(
      requests.createParticipation
    ),

  // Create a tracking
  useCreateTracking: () =>
    useMutation<any, AxiosError, GoalTypes.Tracking>(requests.createTracking),
};

export default goalService;
