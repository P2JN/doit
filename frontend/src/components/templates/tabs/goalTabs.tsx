import { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Divider, Typography } from "@mui/material";

import { useActiveUser, useNotificationStore } from "store";
import { goalService } from "services";
import { GoalTypes } from "types";
import { texts } from "utils";

import { ParsedError } from "components/atoms";
import { ProgressBar } from "components/molecules";
import { GoalForm, ObjectivesForm } from "components/templates";

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

  const { data: isParticipating, refetch: refetchParticipating } =
    goalService.useIsParticipating(goal.id, activeUser?.id);

  const {
    mutate: deleteGoal,
    isError: isDeleteError,
    error: deleteError,
  } = goalService.useDeleteGoal();

  const { mutate: participate } = goalService.useCreateParticipation();

  const { data: progress, refetch } = goalService.useMyGoalProgress(
    goal?.id,
    activeUser?.id
  );

  const [params, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (params.get("refresh") === goal.id) {
      refetch();
      refetchParticipating();
      setSearchParams("");
    }
  }, [goal.id, params, refetch, setSearchParams, refetchParticipating]);

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

  return (
    <section className="mb-10 flex flex-col gap-5">
      {isOwner && (
        <div className="flex justify-end">
          <Button
            color="primary"
            size="large"
            onClick={() => setEditGoalEnabled(!editGoalEnabled)}
          >
            {editGoalEnabled ? "Cerrar" : "Editar"}
          </Button>
        </div>
      )}
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
        ) : (
          <ObjectivesForm initial={goal.objectives} />
        )}
      </div>
      {!isOwner && !isParticipating && (
        <>
          <Divider />
          <div className="flex items-center justify-between">
            <Typography variant="h5">
              {!isPersonal
                ? "Aún no estas participando en este objetivo"
                : "Este objetivo es personal"}
            </Typography>
            {!isPersonal && <Button onClick={onParticipate}>Participar</Button>}
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
const GoalFeedTab = () => {
  return (
    <section>
      <p>Goal Feed Content</p>
    </section>
  );
};
const GoalTrackingsTab = () => {
  return (
    <section>
      <p>Goal Trackings Content</p>
    </section>
  );
};
const GoalLeaderboardTab = () => {
  return (
    <section>
      <p>Goal Leaderboard Content</p>
    </section>
  );
};
const GoalStatsTab = () => {
  return (
    <section>
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
