import { Id } from "./apiTypes";

export type Goal = {
  id?: Id;
  title: string;
  description: string;
  unit: string;
  type: "challenge" | "cooperative" | "private";
  creationDate: string;
  startDate: string;
  deadline: string;
  createdBy: Id;
  objectives: Objective[];
  progress?: Progress;
};

export type Progress = {
  total?: number;
  daily?: number;
  weekly?: number;
  monthly?: number;
  yearly?: number;
};

export type Objective = {
  id?: Id;
  quantity: number;
  frequency: "total" | "daily" | "weekly" | "monthly" | "yearly";
  goal: Id;
};

export type Tracking = {
  id?: Id;
  goal: Id;
  user: Id;

  date?: string;
  amount: number;
};
