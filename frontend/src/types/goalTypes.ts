import { Id } from "./apiTypes";

export type Goal = {
  id: Id;
  title: string;
  description: string;
  unit: string;
  type: "challenge" | "cooperative" | "private";
  creationDate: string;
  startDate: string;
  deadline: string;
  createdBy: Id;
  objectives: Objective[];
};

export type Objective = {
  id: Id;
  quantity: number;
  frequency: "total" | "daily" | "weekly" | "monthly" | "yearly";
  goal: Id;
};
