import { useEffect } from "react";
import { Route, Routes, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Skeleton, Typography } from "@mui/material";

import { Page } from "layout";
import { goalService } from "services";
import { GoalTypes } from "types";
import { useActiveUser } from "store";

import { DataLoader } from "components/molecules";
import { GoalTeaser, ModalDrawer } from "components/organisms";
import { GoalForm, ObjectivesForm, TrackingForm } from "components/templates";

const HomePage = () => {
  const { activeUser } = useActiveUser();

  const {
    data: goalList,
    isLoading: loadingGoals,
    refetch,
  } = goalService.useGoalsByParticipant(activeUser?.id);

  const navigate = useNavigate();

  const [params, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (params.get("refresh") === "goals") {
      refetch();
      setSearchParams("");
    }
  }, [params, refetch, setSearchParams]);

  return (
    <Page title="Home">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Typography variant="h5">Mis objetivos</Typography>
          <Button onClick={() => navigate("/home/new-goal")}>
            <strong>Nuevo</strong>
          </Button>
        </div>

        <DataLoader
          isLoading={loadingGoals}
          hasData={!!goalList?.results?.length}
          retry={refetch}
        />

        {goalList?.results?.map((goal) => (
          <GoalTeaserProvider {...goal} />
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
          <ModalDrawer
            title="Crear nuevo objetivo"
            onClose={() => navigate("/home?refresh=goals")}
          >
            <GoalForm />
          </ModalDrawer>
        }
      />
      <Route
        path="/:goalId/track"
        element={
          <ModalDrawer
            title="Registrar progreso"
            onClose={() => navigate("/home?refresh=goals")}
          >
            <TrackingForm />
          </ModalDrawer>
        }
      />
      <Route
        path="/:goalId/objectives"
        element={
          <ModalDrawer
            title="Objetivos temporales"
            onClose={() => navigate("/home?refresh=goals")}
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

  const [params, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (params.get("refresh") === goal?.id) refetch();
    setSearchParams("");
  }, [goal?.id, params, refetch, setSearchParams]);

  return loadingProgress ? (
    <Skeleton />
  ) : (
    <GoalTeaser {...goal} progress={progress} />
  );
};
