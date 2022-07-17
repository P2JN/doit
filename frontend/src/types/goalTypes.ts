import { Id } from "./apiTypes";

export type Goal = {
  id?: Id;
  title: string;
  description: string;
  unit: string;
  type: GoalType | GoalTypeEnumValues;
  creationDate?: string;
  startDate?: string;
  deadline?: string;
  createdBy?: Id;
  objectives?: Objective[];
  progress?: Progress;
};

export type GoalType = "challenge" | "cooperative" | "private";
export type GoalTypeEnumValues =
  | "GoalType.CHALLENGE"
  | "GoalType.COOP"
  | "GoalType.PRIVATE";

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
  frequency: Frequency | FrequencyEnumValues;
  goal: Id;
};

export type Frequency = "total" | "daily" | "weekly" | "monthly" | "yearly";
export type FrequencyEnumValues =
  | "GoalType.TOTAL"
  | "GoalType.DAILY"
  | "GoalType.WEEKLY"
  | "GoalType.MONTHLY"
  | "GoalType.YEARLY";

export type Tracking = {
  id?: Id;
  goal: Id;
  user: Id;

  date?: string;
  amount: number;
};

export type Participation = {
  id?: Id;
  goal?: Id;
  user?: Id;
};
