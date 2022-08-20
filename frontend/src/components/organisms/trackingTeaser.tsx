import { useMatch, useNavigate } from "react-router-dom";
import { IconButton, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";

import { GoalTypes } from "types";
import { goalService, socialService } from "services";
import { useActiveUser } from "store";
import { dateUtils } from "utils";

import { Card } from "components/atoms";
import { GoalTeaserReduced, UserTeaserReduced } from "components/organisms";

const TrackingTeaser = (tracking: GoalTypes.Tracking) => {
  const navigate = useNavigate();
  const { activeUser } = useActiveUser();

  const { data: user } = socialService.useUser(tracking.createdBy);
  const isOwner = activeUser?.id === tracking.createdBy;

  const { data: goal } = goalService.useGoal(tracking.goal);
  const isInGoalPage = useMatch("/goals/:id/trackings/*");

  return (
    <div className="flex flex-col gap-2">
      {!isInGoalPage && goal && <GoalTeaserReduced {...goal} />}
      <Card className="cursor-pointer">
        <header className="flex cursor-pointer items-center justify-between">
          <div className="flex items-end gap-2 text-primary">
            <Typography variant="h4" className="!font-bold">
              +{tracking.amount}
            </Typography>
            <Typography variant="body1" className="!font-bold">
              {goal?.unit.slice(0, 3)}
            </Typography>
          </div>
          {user && <UserTeaserReduced {...user} />}
        </header>

        <footer className="flex items-center justify-between gap-3">
          <Typography variant="body1">
            {dateUtils.beautifyDate(tracking.date)}
          </Typography>
          {isOwner && (
            <IconButton
              onClick={() => navigate("delete-tracking/" + tracking.id)}
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
