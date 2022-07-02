import { useQuery } from "react-query";
import { GoalTypes } from "types";
import { axiosInstance } from "./config";

const requests = {
  getGoals: (filters?: string[]) =>
    axiosInstance
      .get("/goal/" + (!!filters ? "?" + filters?.join("&") : ""))
      .then((response) => response.data),
  getGoal: (id: string | number) =>
    axiosInstance.get("/goal/" + id).then((response) => response.data),
};

const goalService = {
  // GOALS
  // Use all the goals
  useGoals: () =>
    useQuery<GoalTypes.Goal[], Error>("goals", () => requests.getGoals()),

  // Use a goal specifying its id
  useGoal: (id: number) =>
    useQuery<GoalTypes.Goal, Error>(`goal-${id}`, () => requests.getGoal(id)),
};

export default goalService;
