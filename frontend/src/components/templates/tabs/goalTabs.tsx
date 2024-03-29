import { useEffect, useMemo, useState } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate,
} from "react-router-dom";
import { Alert, Button, Divider, Tab, Tabs, Typography } from "@mui/material";

import { useActiveUser, useNotificationStore } from "store";
import { goalService, socialService } from "services";
import { GoalTypes } from "types";
import { dateUtils, paginationUtils, texts } from "utils";

import { DataLoader, ProgressBar } from "components/molecules";
import {
  LeaderboardTable,
  PostTeaserWithoutComments,
  TrackingTeaser,
  WeekChart,
} from "components/organisms";
import { GoalForm, ObjectivesForm } from "components/templates";

const GoalInfoTab = (goal: GoalTypes.Goal) => {
  const navigate = useNavigate();
  const editObjectivesEnabled = useMatch("/goals/:id/info/edit-objectives");
  const editGoalEnabled = useMatch("/goals/:id/info/edit");

  const { addNotification } = useNotificationStore();

  const { activeUser } = useActiveUser();
  const isOwner = useMemo(
    () => activeUser?.id === goal.createdBy,
    [activeUser?.id, goal.createdBy]
  );
  const isPersonal = useMemo(() => goal.type === "private", [goal.type]);
  const hasObjectives = useMemo(
    () => !!goal?.objectives?.length,
    [goal.objectives]
  );

  const { data: participation, refetch: refetchParticipation } =
    goalService.useParticipation(activeUser?.id, goal.id);
  const isParticipating = useMemo(() => !!participation, [participation]);

  const { mutate: participate } = goalService.useCreateParticipation();
  const { mutate: stopParticipating } = goalService.useStopParticipating();

  const { data: progress, refetch } = goalService.useMyGoalProgress(
    goal?.id,
    activeUser?.id
  );

  const location = useLocation();
  useEffect(() => {
    refetch();
    refetchParticipation();
  }, [goal.id, refetch, location, refetchParticipation]);

  const onDelete = () => {
    navigate(`/goals/${goal.id}/info/delete`);
  };

  const onParticipate = () => {
    if (goal?.id && activeUser?.id) {
      participate(
        {
          createdBy: activeUser.id,
          goal: goal.id,
        },
        {
          onSuccess: () => {
            refetch();
            refetchParticipation();
          },
        }
      );
    }
  };

  const onStopParticipating = () => {
    if (participation?.id) {
      stopParticipating(participation.id, {
        onSuccess: () => {
          addNotification({
            title: "Has dejado de participar en este objetivo",
            content: "Puedes buscar otros o crear los tuyos propios.",
            type: "transient",
            variant: "success",
          });
          refetch();
          refetchParticipation();
        },
      });
    }
  };

  return (
    <section className="mb-10 flex animate-fade-in flex-col gap-5">
      <div className="flex justify-between">
        <Typography variant="h5">Datos</Typography>
        {isOwner && (
          <Button
            color="primary"
            size="large"
            onClick={() =>
              navigate(
                `/goals/${goal.id}/info${editGoalEnabled ? "" : "/edit"}`
              )
            }
          >
            {editGoalEnabled ? "Cerrar" : "Editar"}
          </Button>
        )}
      </div>
      <GoalForm initial={goal} disabled={!editGoalEnabled} />
      <Divider />
      <div className="flex justify-between">
        <Typography variant="h5">Objetivos</Typography>
        <div className="flex gap-2">
          {isOwner && (
            <Button
              color="primary"
              size="large"
              onClick={() =>
                navigate(
                  `/goals/${goal.id}/info${
                    editObjectivesEnabled ? "" : "/edit-objectives"
                  }`
                )
              }
            >
              {editObjectivesEnabled ? "Cerrar" : "Editar"}
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {!editObjectivesEnabled ? (
          hasObjectives && (
            <>
              {goal.objectives?.map((obj) => (
                <ProgressBar
                  key={obj.id}
                  title={
                    texts.objectiveLabels[obj.frequency as GoalTypes.Frequency]
                  }
                  completed={
                    progress?.[obj.frequency as GoalTypes.Frequency] || 0
                  }
                  expected={undefined}
                  objective={obj.quantity}
                  unit={goal.unit}
                />
              ))}
              {(isOwner || isParticipating) && (
                <div className="flex justify-center">
                  <Button
                    color="primary"
                    size="large"
                    onClick={() => navigate("track")}
                  >
                    Nuevo progreso
                  </Button>
                </div>
              )}
            </>
          )
        ) : (
          <ObjectivesForm initial={goal.objectives} />
        )}
      </div>
      {!isOwner && (
        <>
          <Divider />
          <div className="flex items-center justify-between">
            <Typography variant="h5">
              {!isPersonal
                ? isParticipating
                  ? "Estás participando"
                  : "Aún no estas participando en este objetivo"
                : "Este objetivo es personal"}
            </Typography>
            {!isPersonal && !isParticipating && (
              <Button onClick={onParticipate}>Participar</Button>
            )}
            {!isPersonal && isParticipating && (
              <Button color="error" onClick={onStopParticipating}>
                No Participar
              </Button>
            )}
          </div>
        </>
      )}
      {isOwner && (
        <>
          <Divider />
          <div className="flex items-center justify-between">
            <Typography variant="h5" className="text-red-600">
              Precaución
            </Typography>
            <Button color="error" onClick={onDelete}>
              Eliminar
            </Button>
          </div>
        </>
      )}
    </section>
  );
};
const GoalFeedTab = (goal: GoalTypes.Goal) => {
  const navigate = useNavigate();
  const {
    data: goalPages,
    isLoading,
    refetch,
    error,
    hasNextPage,
    fetchNextPage,
  } = socialService.useGoalPosts(goal.id);
  const goals = useMemo(
    () => paginationUtils.combinePages(goalPages),
    [goalPages]
  );

  const location = useLocation();
  useEffect(() => {
    refetch();
  }, [refetch, location]);

  return (
    <section className="animate-fade-in">
      <div className="mb-3 flex justify-between">
        <Typography variant="h5">Últimos Posts</Typography>
        <div className="flex gap-2">
          <Button
            color="primary"
            size="large"
            onClick={() => navigate("new-post")}
          >
            Nuevo
          </Button>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {goals?.map((post) => (
          <PostTeaserWithoutComments key={post.id} {...post} />
        ))}
      </div>
      <DataLoader
        isLoading={isLoading}
        hasData={!!goals?.length}
        retry={refetch}
        error={error}
        hasNextPage={hasNextPage}
        loadMore={fetchNextPage}
      />
    </section>
  );
};
const GoalTrackingsTab = (goal: GoalTypes.Goal) => {
  const navigate = useNavigate();

  const {
    data: trackingPages,
    isLoading,
    error,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = goalService.useGoalTrackings(goal.id);
  const trackings = useMemo(
    () => paginationUtils.combinePages(trackingPages),
    [trackingPages]
  );

  const location = useLocation();
  useEffect(() => {
    refetch();
  }, [goal.id, refetch, location]);

  return (
    <section className="animate-fade-in">
      <div className="mb-3 flex justify-between">
        <Typography variant="h5">Últimos Registros</Typography>
        <div className="flex gap-2">
          <Button
            color="primary"
            size="large"
            onClick={() => navigate("track")}
          >
            Nuevo
          </Button>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {trackings?.map((tracking) => (
          <TrackingTeaser key={tracking.id} {...tracking} />
        ))}
      </div>
      <DataLoader
        isLoading={isLoading}
        hasData={!!trackings?.length}
        retry={refetch}
        error={error}
        hasNextPage={hasNextPage}
        loadMore={fetchNextPage}
      />
    </section>
  );
};
const GoalLeaderboardTab = (goal: GoalTypes.Goal) => {
  const [objective, setObjective] = useState<GoalTypes.Objective | undefined>(
    goal?.objectives?.[0]
  );

  const {
    data: leaderboardPages,
    isLoading,
    error,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = goalService.useGoalLeaderboard(
    goal.id,
    objective?.frequency as GoalTypes.Frequency
  );
  const leaderboard = useMemo(
    () => paginationUtils.combinePages(leaderboardPages),
    [leaderboardPages]
  );

  const location = useLocation();
  useEffect(() => {
    refetch();
  }, [refetch, location]);

  return (
    <section className="animate-fade-in">
      {!!goal?.objectives?.length ? (
        <>
          <Tabs
            value={objective?.frequency}
            onChange={(_: any, tab: GoalTypes.Frequency) =>
              setObjective(goal.objectives?.find((o) => o.frequency === tab))
            }
            variant="scrollable"
          >
            {goal?.objectives?.map((objective) => (
              <Tab
                key={objective.id}
                value={objective.frequency}
                label={
                  texts.objectiveLabels[
                    objective.frequency as GoalTypes.Frequency
                  ]
                }
              />
            ))}
          </Tabs>
          {leaderboard && (
            <LeaderboardTable
              users={leaderboard}
              objective={objective?.quantity}
              goalUnit={goal.unit}
            />
          )}
          <DataLoader
            isLoading={isLoading}
            hasData={!!leaderboard?.length}
            retry={refetch}
            error={error}
            hasNextPage={hasNextPage}
            loadMore={fetchNextPage}
          />
        </>
      ) : (
        <Alert severity="info">
          No hay objetivos para esta meta, configuralos en la{" "}
          <Link
            className="underline hover:font-bold"
            to={`/goals/${goal.id}/info`}
          >
            tab de información
          </Link>
        </Alert>
      )}
    </section>
  );
};

const GoalStatsTab = (goal: GoalTypes.Goal) => {
  return (
    <section className="animate-fade-in">
      <Routes>
        <Route
          path="/"
          element={<Navigate to={dateUtils.ISODateOnly(new Date())} />}
        />
        <Route path="/:day" element={<WeekChart {...goal} />} />
      </Routes>
    </section>
  );
};

export {
  GoalInfoTab,
  GoalFeedTab,
  GoalTrackingsTab,
  GoalLeaderboardTab,
  GoalStatsTab,
};
