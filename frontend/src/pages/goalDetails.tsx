import { useEffect } from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Tab, Tabs, Typography } from "@mui/material";
import {
  ImageOutlined,
  InfoOutlined,
  LeaderboardOutlined,
  TimelineOutlined,
  TrackChangesOutlined,
} from "@mui/icons-material";

import { GoalTypes } from "types";
import { Page } from "layout";
import { goalService } from "services";

import { DataLoader } from "components/molecules";
import { ModalDrawer } from "components/organisms";
import {
  GoalFeedTab,
  GoalInfoTab,
  GoalLeaderboardTab,
  GoalStatsTab,
  GoalTrackingsTab,
  TrackingForm,
  PostForm,
  DeleteGoalConfirmation,
  DeleteTrackingConfirmation,
} from "components/templates";

type GoalTabsType = "info" | "feed" | "trackings" | "leaderboard" | "stats";

const GoalDetailPage = () => {
  const { goalId, activeTab } = useParams();

  const {
    data: goal,
    isLoading: loadingGoal,
    refetch,
    error,
  } = goalService.useGoal(goalId);

  const navigate = useNavigate();

  const location = useLocation();
  useEffect(() => {
    refetch();
  }, [goalId, refetch, location]);

  const handleChange = (_: any, tab: string) => {
    navigate(`/goals/${goalId}/${tab}`);
  };

  const labels = {
    info: "Información",
    feed: "Contenido",
    trackings: "Progreso",
    leaderboard: "Líderes",
    stats: "Estadísticas",
  };

  return (
    <Page
      title={goal?.title || (loadingGoal ? "Buscando..." : "No encontrado")}
    >
      <div className="flex flex-col gap-3">
        {goal && (
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <Typography
              variant="h5"
              className="order-2 !text-center md:-order-1 md:text-left"
            >
              {labels[activeTab as GoalTabsType]}
            </Typography>

            <Tabs
              value={activeTab}
              onChange={handleChange}
              variant="scrollable"
              allowScrollButtonsMobile
            >
              <Tab value={"info"} icon={<InfoOutlined />} />
              <Tab value={"trackings"} icon={<TrackChangesOutlined />} />
              <Tab value={"feed"} icon={<ImageOutlined />} />
              <Tab value={"leaderboard"} icon={<LeaderboardOutlined />} />
              <Tab value={"stats"} icon={<TimelineOutlined />} />
            </Tabs>
          </div>
        )}
        <DataLoader
          isLoading={loadingGoal}
          hasData={!!goal}
          retry={refetch}
          error={error}
        />
        {activeTab && goal && <GoalTabs activeTab={activeTab} goal={goal} />}
      </div>
      {goal && <GoalModals {...goal} />}
    </Page>
  );
};

export default GoalDetailPage;

const GoalModals = (goal: GoalTypes.Goal) => {
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
        path="/new-post"
        element={
          <ModalDrawer title="Nuevo post" onClose={() => navigate(-1)}>
            <PostForm relatedGoal={goal} />
          </ModalDrawer>
        }
      />
      <Route
        path="/delete"
        element={
          <ModalDrawer title="Eliminar objetivo" onClose={() => navigate(-1)}>
            <DeleteGoalConfirmation {...goal} />
          </ModalDrawer>
        }
      />
      <Route
        path="/delete-tracking/:trackingId"
        element={
          <ModalDrawer title="Eliminar progreso" onClose={() => navigate(-1)}>
            <DeleteTrackingConfirmation />
          </ModalDrawer>
        }
      />
    </Routes>
  );
};

const GoalTabs = (props: { activeTab: string; goal: GoalTypes.Goal }) => {
  const { activeTab, goal } = props;
  return (
    <section>
      {activeTab === "info" && <GoalInfoTab {...goal} />}
      {activeTab === "trackings" && <GoalTrackingsTab {...goal} />}
      {activeTab === "feed" && <GoalFeedTab {...goal} />}
      {activeTab === "leaderboard" && <GoalLeaderboardTab {...goal} />}
      {activeTab === "stats" && <GoalStatsTab {...goal} />}
    </section>
  );
};
