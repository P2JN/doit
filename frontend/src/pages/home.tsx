import { useEffect, useMemo } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Button, Skeleton, Typography } from "@mui/material";

import { Page } from "layout";
import { goalService } from "services";
import { GoalTypes } from "types";
import { useActiveUser } from "store";
import { paginationUtils } from "utils";

import { DataLoader } from "components/molecules";
import { GoalTeaser, ModalDrawer } from "components/organisms";
import { GoalForm, ObjectivesForm, TrackingForm } from "components/templates";

const HomePage = () => {
  const { activeUser } = useActiveUser();

  const {
    data: goalPages,
    isLoading: loadingGoals,
    refetch,
  } = goalService.useGoalsByParticipant(activeUser?.id);
  const goals = useMemo(
    () => paginationUtils.combinePages(goalPages),
    [goalPages]
  );

  const navigate = useNavigate();

  const location = useLocation();
  useEffect(() => {
    refetch();
  }, [location, refetch]);

  return (
    <Page title="Inicio">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Typography variant="h5">Mis metas</Typography>
          <Button onClick={() => navigate("/home/new-goal")}>Nuevo</Button>
        </div>

        <DataLoader
          isLoading={loadingGoals}
          hasData={!!goals?.length}
          retry={refetch}
        />

        {goals?.map((goal) => (
          <GoalTeaserProvider key={goal.id} {...goal} />
        ))}
      </div>
      <HomeModals />
    </Page>
  );
};

export default HomePage;

const HomeModals = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/new-goal"
        element={
          <ModalDrawer title="Crear nueva meta" onClose={() => navigate(-1)}>
            <GoalForm />
          </ModalDrawer>
        }
      />
      <Route
        path="/:goalId/track"
        element={
          <ModalDrawer title="Registrar progreso" onClose={() => navigate(-1)}>
            <TrackingForm />
          </ModalDrawer>
        }
      />
      <Route
        path="/:goalId/objectives"
        element={
          <ModalDrawer
            title="Objetivos temporales"
            onClose={() => navigate("/home")}
          >
            <ObjectivesForm />
          </ModalDrawer>
        }
      />
    </Routes>
  );
};

const GoalTeaserProvider = (goal: GoalTypes.Goal) => {
  const { activeUser } = useActiveUser();
  const {
    data: progress,
    isLoading: loadingProgress,
    refetch,
  } = goalService.useMyGoalProgress(goal.id, activeUser?.id);

  const location = useLocation();
  useEffect(() => {
    refetch();
  }, [goal?.id, refetch, location]);

  return loadingProgress ? (
    <Skeleton />
  ) : (
    <GoalTeaser {...goal} progress={progress} />
  );
};
