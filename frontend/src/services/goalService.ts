import { AxiosError } from "axios";
import { useInfiniteQuery, useMutation, useQuery } from "react-query";

import { GoalTypes } from "types";
import { Id, PagedList } from "types/apiTypes";
import { paginationUtils } from "utils";

import { axiosInstance } from "./config";

const requests = {
  getGoals: (page?: number) =>
    axiosInstance
      .get("/goal/?size=9" + (page ? "&page=" + page : ""))
      .then((response) => response.data),

  getGoalsByParticipant: (participantId?: Id, page?: number) =>
    axiosInstance
      .get(
        "/goal/?participant=" +
          (participantId || "missing") +
          (page ? "&page=" + page : "")
      )
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

  updateGoal: (goal: GoalTypes.Goal) =>
    axiosInstance
      .put("/goal/" + goal.id + "/", goal)
      .then((response) => response.data),

  deleteGoal: (id: Id) =>
    axiosInstance.delete("/goal/" + id + "/").then((response) => response.data),

  createObjective: (objective: GoalTypes.Objective) =>
    axiosInstance
      .post("/objective/", objective)
      .then((response) => response.data),

  updateObjective: (objective: GoalTypes.Objective) =>
    axiosInstance
      .put("/objective/" + objective.id + "/", objective)
      .then((response) => response.data),

  deleteObjective: (objectiveId: Id) =>
    axiosInstance
      .delete("/objective/" + objectiveId + "/")
      .then((response) => response.data),

  createParticipation: (participation: GoalTypes.Participation) =>
    axiosInstance
      .post("/participate/", participation)
      .then((response) => response.data),

  deleteParticipation: (participationId?: Id) =>
    axiosInstance
      .delete("/participate/" + (participationId || "missing") + "/")
      .then((response) => response.data),

  getParticipation: (userId?: Id, goalId?: Id) =>
    axiosInstance
      .get(
        "/participate/?createdBy=" +
          (userId || "missing") +
          "&goal=" +
          (goalId || "missing")
      )
      .then((response) => response.data?.results?.[0]),

  createTracking: (tracking: GoalTypes.Tracking) =>
    axiosInstance
      .post("/tracking/", tracking)
      .then((response) => response.data),

  removeTracking: (trackingId?: Id) =>
    axiosInstance
      .delete("/tracking/" + (trackingId || "missing") + "/")
      .then((response) => response.data),

  getUserTrackings: (userId?: Id, page?: number) =>
    axiosInstance
      .get(
        "/tracking/?order_by=-date&size=12&createdBy=" +
          (userId || "missing") +
          (page ? "&page=" + page : "")
      )
      .then((response) => response.data),

  getGoalTrackings: (goalId?: Id, page?: number) =>
    axiosInstance
      .get(
        "/tracking/?order_by=-date&size=12&goal=" +
          (goalId || "missing") +
          (page ? "&page=" + page : "")
      )
      .then((response) => response.data),
};

const goalService = {
  // GOALS
  // Use all the goals
  useGoals: () =>
    useInfiniteQuery<PagedList<GoalTypes.Goal>, AxiosError>(
      "goals",
      ({ pageParam = 0 }) => requests.getGoals(pageParam),
      {
        getNextPageParam: paginationUtils.getNextPage,
      }
    ),

  // Use my goals
  useGoalsByParticipant: (participantId?: Id) =>
    useInfiniteQuery<PagedList<GoalTypes.Goal>, AxiosError>(
      `participant-${participantId}-goals`,
      ({ pageParam = 0 }) =>
        requests.getGoalsByParticipant(participantId, pageParam),
      {
        getNextPageParam: paginationUtils.getNextPage,
      }
    ),

  // Use a goal specifying its id
  useGoal: (id?: Id) =>
    useQuery<GoalTypes.Goal, AxiosError>(`goal-${id}`, () =>
      requests.getGoal(id)
    ),

  // Use delete goal
  useDeleteGoal: () =>
    useMutation<void, AxiosError, Id>(`delete-goal`, requests.deleteGoal),

  // Use my goal progress specifying its id
  useMyGoalProgress: (id?: Id, participantId?: Id) =>
    useQuery<GoalTypes.Progress, AxiosError>(`goal-${id}-my-progress`, () =>
      requests.getGoalProgressByParticipant(id, participantId)
    ),

  // Create a goal
  useCreateGoal: () =>
    useMutation<any, AxiosError, GoalTypes.Goal>(requests.createGoal),

  // Update a goal
  useUpdateGoal: () =>
    useMutation<any, AxiosError, GoalTypes.Goal>(requests.updateGoal),

  // Ceate an objective
  useCreateObjective: () =>
    useMutation<any, AxiosError, GoalTypes.Objective>(requests.createObjective),

  // Update an objective
  useUpdateObjective: () =>
    useMutation<any, AxiosError, GoalTypes.Objective>(requests.updateObjective),

  // Delete an objective
  useDeleteObjective: () =>
    useMutation<any, AxiosError, Id>(requests.deleteObjective),

  // Create a participation
  useCreateParticipation: () =>
    useMutation<any, AxiosError, GoalTypes.Participation>(
      requests.createParticipation
    ),
  // Use participation by user and goal
  useParticipation: (userId?: Id, goalId?: Id) =>
    useQuery<GoalTypes.Participation, AxiosError>(
      `participation-${userId}-${goalId}`,
      () => requests.getParticipation(userId, goalId)
    ),
  // Use stop participating
  useStopParticipating: () =>
    useMutation<any, AxiosError, Id>(requests.deleteParticipation),

  // Create a tracking
  useCreateTracking: () =>
    useMutation<any, AxiosError, GoalTypes.Tracking>(requests.createTracking),

  // Remove a tracking
  useRemoveTracking: () =>
    useMutation<any, AxiosError, Id>(requests.removeTracking),

  // Use user trackings
  useUserTrackings: (userId?: Id) =>
    useInfiniteQuery<PagedList<GoalTypes.Tracking>, AxiosError>(
      "user-trackings-" + userId,
      ({ pageParam = 0 }) => requests.getUserTrackings(userId, pageParam),
      {
        getNextPageParam: paginationUtils.getNextPage,
      }
    ),
  // Use goal posts
  useGoalTrackings: (goalId?: Id) =>
    useInfiniteQuery<PagedList<GoalTypes.Tracking>, AxiosError>(
      "goal-trackings-" + goalId,
      ({ pageParam = 0 }) => requests.getGoalTrackings(goalId, pageParam),
      {
        getNextPageParam: paginationUtils.getNextPage,
      }
    ),
};

export default goalService;
