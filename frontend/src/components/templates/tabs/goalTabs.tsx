import { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Divider, Typography } from "@mui/material";

import { useActiveUser, useNotificationStore } from "store";
import { goalService, socialService } from "services";
import { GoalTypes } from "types";
import { texts } from "utils";

import { ParsedError } from "components/atoms";
import { DataLoader, ProgressBar } from "components/molecules";
import { GoalForm, ObjectivesForm } from "components/templates";
import { PostTeaser } from "components/organisms";

const GoalInfoTab = (goal: GoalTypes.Goal) => {
  const navigate = useNavigate();
  const [editObjectivesEnabled, setEditObjectivesEnabled] = useState(false);
  const [editGoalEnabled, setEditGoalEnabled] = useState(false);

  const { addNotification } = useNotificationStore();

  const { activeUser } = useActiveUser();
  const isOwner = useMemo(
    () => activeUser?.id === goal.createdBy,
    [activeUser?.id, goal.createdBy]
  );
  const isPersonal = useMemo(() => goal.type === "private", [goal.type]);
  const hasObjectives = useMemo(
    () => !!goal.objectives?.length,
    [goal.objectives]
  );

  const { data: participation, refetch: refetchParticipation } =
    goalService.useParticipation(activeUser?.id, goal.id);
  const isParticipating = useMemo(() => !!participation, [participation]);

  const {
    mutate: deleteGoal,
    isError: isDeleteError,
    error: deleteError,
  } = goalService.useDeleteGoal();

  const { mutate: participate } = goalService.useCreateParticipation();
  const { mutate: stopParticipating } = goalService.useStopParticipating();

  const { data: progress, refetch } = goalService.useMyGoalProgress(
    goal?.id,
    activeUser?.id
  );

  const [params, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (params.get("refresh") === goal.id) {
      refetch();
      refetchParticipation();
      setSearchParams("");
    }
  }, [goal.id, params, refetch, setSearchParams, refetchParticipation]);

  const onDelete = () => {
    if (goal?.id) {
      deleteGoal(goal.id, {
        onSuccess: () => navigate("/home?refresh=goals"),
      });
    }
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
            addNotification({
              title: "Te has unido a este objetivo",
              content: "Felicidades, comienza a registrar tu progreso!",
              type: "transient",
              variant: "success",
            });
            setSearchParams("?refresh=" + goal.id);
          },
          onError: (error: AxiosError) => {
            addNotification({
              title: "Error, no puedes participar",
              content: error.message,
              type: "transient",
              variant: "error",
            });
            setSearchParams("?refresh=" + goal.id);
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
          setSearchParams("?refresh=" + goal.id);
        },
      });
    }
  };

  return (
    <section className="mb-10 flex flex-col gap-5 animate-fade-in">
      <div className="flex justify-between">
        <Typography variant="h5">Datos</Typography>
        {isOwner && (
          <Button
            color="primary"
            size="large"
            onClick={() => setEditGoalEnabled(!editGoalEnabled)}
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
              onClick={() => setEditObjectivesEnabled(!editObjectivesEnabled)}
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
          {isDeleteError && <ParsedError {...deleteError} />}
        </>
      )}
    </section>
  );
};
const GoalFeedTab = (goal: GoalTypes.Goal) => {
  const {
    data: goalPosts,
    isLoading,
    refetch,
    error,
  } = socialService.useGoalPosts(goal.id);

  return (
    <section className="animate-fade-in">
      <DataLoader
        isLoading={isLoading}
        hasData={!!goalPosts?.length}
        retry={refetch}
        error={error}
      />
      <div className="flex flex-col gap-10">
        {goalPosts?.map((post) => (
          <PostTeaser {...post} />
        ))}
      </div>
    </section>
  );
};
const GoalTrackingsTab = () => {
  return (
    <section className="animate-fade-in">
      <p>Goal Trackings Content</p>
    </section>
  );
};
const GoalLeaderboardTab = () => {
  return (
    <section className="animate-fade-in">
      <p>Goal Leaderboard Content</p>
    </section>
  );
};
const GoalStatsTab = () => {
  return (
    <section className="animate-fade-in">
      <p>Goal Stats Content</p>
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
