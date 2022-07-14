import { Page } from "layout";
import { useEffect } from "react";
import { goalService } from "services";
import { useNotificationStore } from "store";
import { GoalTypes } from "types";

const Goal = (props: GoalTypes.Goal) => <div>{props.title}</div>;

const ExplorePage = () => {
  const { addNotification } = useNotificationStore();

  const {
    data: goals,
    isLoading: loadingGoals,
    error: goalError,
    isError: isGoalError,
  } = goalService.useGoals();

  useEffect(() => {
    if (isGoalError) {
      addNotification({
        content: goalError.message,
        title: "Error loading goals",
        variant: "error",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGoalError, goalError]);

  return (
    <Page title="Explore">
      <div className="overflow-hidden">Explore Content</div>

      {loadingGoals && <div>Loading Goals ...</div>}
      {goalError && <div>Error Loading Goals</div>}

      {goals && goals.map((goal) => <Goal {...goal} />)}
    </Page>
  );
};

export default ExplorePage;
