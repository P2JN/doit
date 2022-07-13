import { Route, Routes, useNavigate } from "react-router-dom";
import { CircularProgress, Skeleton } from "@mui/material";

import { Page } from "layout";
import { goalService } from "services";
import { GoalTypes } from "types";

import { GoalTeaser, ModalDrawer, TrackingForm } from "components/organisms";

const HomePage = () => {
  const { data: goals, isLoading: loadingGoals } = goalService.useMyGoals();

  const navigate = useNavigate();

  return (
    <Page title="Home">
      <div className="flex flex-col gap-3">
        {loadingGoals && <CircularProgress />}
        {goals?.map((goal) => (
          <GoalTeaserProvider {...goal} />
        ))}
      </div>
      <Routes>
        <Route
          path="/:goalId/track"
          element={
            <ModalDrawer title="New Tracking" onClose={() => navigate(-1)}>
              <TrackingForm />
            </ModalDrawer>
          }
        />
        <Route path="/:goalId" element={<></>} />
      </Routes>
    </Page>
  );
};

export default HomePage;

const GoalTeaserProvider = (goal: GoalTypes.Goal) => {
  const { data: progress, isLoading: loadingProgress } =
    goalService.useMyGoalProgress(goal.id);

  return loadingProgress ? (
    <Skeleton />
  ) : (
    <GoalTeaser {...goal} progress={progress} />
  );
};
