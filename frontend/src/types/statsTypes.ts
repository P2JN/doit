import { Id } from "./apiTypes";

export type UserStats = {
  id: Id;
  createdGoals: number;
  participatedGoals: number;
  totalObjectivesCompleted: number;
  monthlyObjectivesCompleted: number;
  yearlyObjectivesCompleted: number;
  dailyObjectivesCompleted: number;
  weeklyObjectivesCompleted: number;
  createdBy: Id;
  actuallyParticipatedGoals: number;
  numTrackings: number;
  numPosts: number;
  numLikes: number;
  numComments: number;
};

export type GoalStats = {
  [key: string]: number;
  totalMonth: number;
  totalYear: number;
};

export type Achievement = {
  id: Id;
  title: string;
  description: string;
  media: Id;
  type: "bronze" | "silver" | "gold" | "special";

  urlMedia: string;
  completed: boolean;
};
