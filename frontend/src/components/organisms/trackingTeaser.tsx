import { useMatch, useNavigate } from "react-router-dom";
import { IconButton, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";

import { GoalTypes } from "types";
import { goalService, socialService } from "services";
import { useActiveUser, useNotificationStore } from "store";
import { dateUtils } from "utils";

import { Card } from "components/atoms";
import { GoalTeaserReduced, UserTeaserReduced } from "components/organisms";

const TrackingTeaser = (tracking: GoalTypes.Tracking) => {
  const navigate = useNavigate();
  const { activeUser } = useActiveUser();
  const { addNotification } = useNotificationStore();

  const { data: user } = socialService.useUser(tracking.createdBy);
  const isOwner = activeUser?.id === tracking.createdBy;

  const { data: goal } = goalService.useGoal(tracking.goal);
  const isInGoalPage = useMatch("/goals/:id/trackings/*");

  const { mutate: removeTracking } = goalService.useRemoveTracking();

  const onRemoveTracking = () => {
    if (tracking.id)
      removeTracking(tracking.id, {
        onSuccess: () => {
          addNotification({
            title: "Se ha eliminado el registro",
            content: "Dejará de contar el progreso en este objetivo.",
            type: "transient",
          });
          navigate(
            "/goals/" + tracking.goal + "/trackings?refresh=" + tracking.goal
          );
        },
      });
  };

  return (
    <div className="flex flex-col gap-2">
      {!isInGoalPage && goal && <GoalTeaserReduced {...goal} />}
      <Card className="cursor-pointer">
        <header className="flex cursor-pointer items-center justify-between">
          <Typography variant="h4" className="!font-bold text-primary">
            +{tracking.amount}
          </Typography>
          {user && <UserTeaserReduced {...user} />}
        </header>

        <footer className="flex items-center justify-between gap-3">
          <Typography variant="body1">
            {dateUtils.beautifyDate(tracking.date)}
          </Typography>
          {isOwner && (
            <IconButton
              onClick={onRemoveTracking}
              className="!-mr-2 hover:text-red-600"
            >
              <Delete />
            </IconButton>
          )}
        </footer>
      </Card>
    </div>
  );
};

export { TrackingTeaser };
