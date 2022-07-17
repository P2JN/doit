import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import { Chip, IconButton, Typography } from "@mui/material";

import { GoalTypes } from "types";

import { Card } from "components/atoms";
import { ProgressBar } from "components/molecules";

const GoalTeaser = (goal: GoalTypes.Goal) => {
  const navigate = useNavigate();
  return (
    <Card>
      <header className="flex items-center justify-between">
        <div className="text-xl font-bold">{goal.title}</div>
        <IconButton
          color="primary"
          size="large"
          onClick={() => navigate(goal.id + "/track")}
        >
          <Add />
        </IconButton>
      </header>
      <section className="flex flex-col gap-3">
        {goal.objectives?.map((obj) => (
          <ProgressBar
            title={obj.frequency}
            completed={
              goal.progress?.[obj.frequency as GoalTypes.Frequency] || 0
            }
            expected={undefined}
            objective={obj.quantity}
          />
        ))}
      </section>
    </Card>
  );
};

const GoalTeaserInfo = (goal: GoalTypes.Goal) => {
  return (
    <Card>
      <header className="flex items-center justify-between">
        <Typography variant="h4">{goal.title}</Typography>
        {goal.type && <Chip label={goal.type} color="info" />}
      </header>
      {goal.description && (
        <Typography variant="body1">{goal.description}</Typography>
      )}
    </Card>
  );
};

export { GoalTeaser, GoalTeaserInfo };
