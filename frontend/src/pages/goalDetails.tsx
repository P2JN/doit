import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Button,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import {
  Feed,
  Info,
  Leaderboard,
  Timeline,
  TrackChanges,
} from "@mui/icons-material";

import { Page } from "layout";
import { goalService } from "services";

import {
  ModalDrawer,
  ObjectivesForm,
  TrackingForm,
} from "components/organisms";

type GoalTabs = "info" | "feed" | "trackings" | "leaderboard" | "stats";

const GoalDetailPage = () => {
  const { goalId, activeTab } = useParams();

  const {
    data: goal,
    isLoading: loadingGoal,
    refetch,
  } = goalService.useGoal(goalId);

  const navigate = useNavigate();

  const handleChange = (_: any, tab: string) => {
    navigate(`/goals/${goalId}/${tab}`);
  };

  const labels = {
    info: "Información",
    feed: "Feed",
    trackings: "Mis registros",
    leaderboard: "Leaderboard",
    stats: "Estadísticas",
  };

  return (
    <Page title={goal?.title || "Objetivo sin título"}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Typography variant="h5">{labels[activeTab as GoalTabs]}</Typography>

          <Tabs
            value={activeTab}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
          >
            <Tab value={"info"} icon={<Info />} />
            <Tab value={"feed"} icon={<Feed />} />
            <Tab value={"leaders"} icon={<Leaderboard />} />
            <Tab value={"trackings"} icon={<TrackChanges />} />
            <Tab value={"stats"} icon={<Timeline />} />
          </Tabs>
        </div>
        {loadingGoal && <CircularProgress />}
        {!loadingGoal && !goal && (
          <Alert
            severity="info"
            className="my-7"
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                Reintentar
              </Button>
            }
          >
            No se ha encontrado el objetivo
          </Alert>
        )}
      </div>
      <GoalModals />
    </Page>
  );
};

export default GoalDetailPage;

const GoalModals = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="track"
        element={
          <ModalDrawer title="Registrar progreso" onClose={() => navigate(-1)}>
            <TrackingForm />
          </ModalDrawer>
        }
      />
      <Route
        path="objectives"
        element={
          <ModalDrawer
            title="Objetivos temporales"
            onClose={() => navigate("/home?refresh=goals")}
          >
            <ObjectivesForm />
          </ModalDrawer>
        }
      />
      <Route path="/:goalId" element={<></>} />
    </Routes>
  );
};
