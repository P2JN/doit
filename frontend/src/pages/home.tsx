import { useEffect } from "react";
import { Route, Routes, useNavigate, useSearchParams } from "react-router-dom";
import { Alert, Button, CircularProgress, Skeleton } from "@mui/material";

import { Page } from "layout";
import { goalService } from "services";
import { GoalTypes } from "types";
import { useActiveUser } from "store";

import { GoalTeaser, ModalDrawer, TrackingForm } from "components/organisms";

const HomePage = () => {
  const { activeUser } = useActiveUser();

  const {
    data: goals,
    isLoading: loadingGoals,
    refetch,
  } = goalService.useGoalsByParticipant(activeUser?.id);

  const navigate = useNavigate();

  return (
    <Page title="Home">
      <div className="flex flex-col gap-3">
        {loadingGoals && <CircularProgress />}
        {!loadingGoals && !goals?.length && (
          <Alert
            severity="info"
            className="my-7"
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                Reintentar
              </Button>
            }
          >
            No se han encontrado objetivos
          </Alert>
        )}
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
  const [params] = useSearchParams();

  const { activeUser } = useActiveUser();
  const {
    data: progress,
    isLoading: loadingProgress,
    refetch,
  } = goalService.useMyGoalProgress(goal.id, activeUser?.id);

  useEffect(() => {
    if (params.get("refresh") === goal?.id) refetch();
  }, [goal?.id, params, refetch]);

  return loadingProgress ? (
    <Skeleton />
  ) : (
    <GoalTeaser {...goal} progress={progress} />
  );
};
