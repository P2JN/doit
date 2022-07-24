import { useEffect } from "react";
import {
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
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

import { GoalTypes } from "types";
import { Page } from "layout";
import { goalService } from "services";

import { ModalDrawer } from "components/organisms";
import {
  GoalFeedTab,
  GoalInfoTab,
  GoalLeaderboardTab,
  GoalStatsTab,
  GoalTrackingsTab,
  ObjectivesForm,
  TrackingForm,
} from "components/templates";

type GoalTabsType = "info" | "feed" | "trackings" | "leaderboard" | "stats";

const GoalDetailPage = () => {
  const { goalId, activeTab } = useParams();

  const {
    data: goal,
    isLoading: loadingGoal,
    refetch,
  } = goalService.useGoal(goalId);

  const navigate = useNavigate();

  const [params, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (params.get("refresh") === "goal") {
      refetch();
      setSearchParams("");
    }
  }, [goalId, params, refetch, setSearchParams]);

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
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <Typography variant="h5">
            {labels[activeTab as GoalTabsType]}
          </Typography>

          <Tabs
            value={activeTab}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
          >
            <Tab value={"info"} icon={<Info />} />
            <Tab value={"feed"} icon={<Feed />} />
            <Tab value={"leaderboard"} icon={<Leaderboard />} />
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
        {activeTab && goal && <GoalTabs activeTab={activeTab} goal={goal} />}
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

const GoalTabs = (props: { activeTab: string; goal: GoalTypes.Goal }) => {
  const { activeTab, goal } = props;
  return (
    <section>
      {activeTab === "info" && <GoalInfoTab {...goal} />}
      {activeTab === "feed" && <GoalFeedTab />}
      {activeTab === "trackings" && <GoalTrackingsTab />}
      {activeTab === "leaderboard" && <GoalLeaderboardTab />}
      {activeTab === "stats" && <GoalStatsTab />}
    </section>
  );
};
