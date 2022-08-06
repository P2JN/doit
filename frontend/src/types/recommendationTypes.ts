import { GoalTypes, SocialTypes } from "types";
import { Id } from "./apiTypes";

export type GoalRecommendations = {
  participants: GoalTypes.Goal[];
  followers: GoalTypes.Goal[];
  affinity: GoalTypes.Goal[];
  tracking: GoalTypes.Goal[];
};

export type UserRecommendations = {
  followers: SocialTypes.User[];
  posts: SocialTypes.User[];
  trackings: SocialTypes.User[];
  activity: SocialTypes.User[];
  affinity: SocialTypes.User[];
};

export type PostRecommendations = {
  likes: SocialTypes.Post[];
  comments: SocialTypes.Post[];
  activity: SocialTypes.Post[];
  followers: SocialTypes.Post[];
  recomendations: SocialTypes.Post[];
};
