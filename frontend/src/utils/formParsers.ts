import { GoalTypes } from "types";

const enumParsers = {
  fromGoalTypeToEnumValue: (
    goalType: GoalTypes.GoalType
  ): GoalTypes.GoalTypeEnumValues => {
    switch (goalType) {
      case "challenge":
        return "GoalType.CHALLENGE";
      case "cooperative":
        return "GoalType.COOP";
      case "private":
        return "GoalType.PRIVATE";
      default:
        return "GoalType.PRIVATE";
    }
  },
  fromFrequencyToEnumValue: (
    frequency: GoalTypes.Frequency
  ): GoalTypes.FrequencyEnumValues => {
    return ("Frequency." +
      frequency.toUpperCase()) as GoalTypes.FrequencyEnumValues;
  },
  fromGoalObjectivesToFormValues: (
    objectives?: GoalTypes.Objective[]
  ): GoalTypes.Progress => {
    return (
      objectives?.reduce((a, v) => ({ ...a, [v.frequency]: v.quantity }), {}) ??
      {}
    );
  },
};

export default enumParsers;
