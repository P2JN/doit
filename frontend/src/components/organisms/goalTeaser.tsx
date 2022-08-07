import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import { Chip, IconButton, Typography } from "@mui/material";

import { GoalTypes } from "types";
import { texts } from "utils";

import { Card } from "components/atoms";
import { GoalCounters, ProgressBar } from "components/molecules";

const GoalTeaser = (goal: GoalTypes.Goal) => {
  const navigate = useNavigate();
  const onOpenGoal = () => navigate("/goals/" + goal.id + "/info");

  return (
    <Card>
      <header className="flex items-center justify-between">
        <Typography
          variant="h5"
          className="cursor-pointer !font-bold"
          onClick={onOpenGoal}
        >
          {goal.title}
        </Typography>
        <IconButton
          color="primary"
          size="large"
          onClick={() => navigate(goal.id + "/track")}
        >
          <Add />
        </IconButton>
      </header>
      <section
        className="flex cursor-pointer flex-col gap-3"
        onClick={onOpenGoal}
      >
        {goal.objectives?.map((obj) => (
          <ProgressBar
            key={obj.id}
            title={texts.objectiveLabels[obj.frequency as GoalTypes.Frequency]}
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
  const navigate = useNavigate();
  const onOpenGoal = () => navigate("/goals/" + goal.id + "/info");

  return (
    <Card className="cursor-pointer" onClick={onOpenGoal}>
      <header className="flex items-center justify-between">
        <Typography variant="h5" className="!font-bold">
          {goal.title}
        </Typography>
        {goal.type && (
          <Chip
            label={texts.goalTypes[goal.type as GoalTypes.GoalType]}
            color="info"
          />
        )}
      </header>
      {goal.description && (
        <Typography variant="body1">{goal.description}</Typography>
      )}
      <footer className="flex justify-end">
        <GoalCounters
          participants={goal.numParticipants}
          posts={goal.numPosts}
        />
      </footer>
    </Card>
  );
};

const GoalTeaserReduced = (goal: GoalTypes.Goal) => {
  const navigate = useNavigate();
  const onOpenGoal = () => navigate("/goals/" + goal.id + "/info");

  return (
    <Card
      className="min-h-[calc(32px+40px)] cursor-pointer"
      onClick={onOpenGoal}
    >
      <header className="flex items-center justify-between gap-3">
        <Typography variant="h6" className="!font-bold leading-tight">
          {goal.title}
        </Typography>
        {goal.type && (
          <Chip
            className="ml-auto -mr-2"
            label={texts.goalTypes[goal.type as GoalTypes.GoalType]}
            color="info"
          />
        )}
      </header>
    </Card>
  );
};

const GoalSearchResult = (goal: GoalTypes.Goal) => {
  const navigate = useNavigate();
  const onOpenGoal = () => navigate("/goals/" + goal.id + "/info");

  return (
    <article onClick={onOpenGoal}>
      <section>
        <Typography variant="h6" className=" !font-bold leading-tight">
          {goal.title}
        </Typography>
      </section>
      <section className="flex cursor-pointer items-center gap-4 py-1">
        <Chip
          label={texts.goalTypes[goal.type as GoalTypes.GoalType]}
          color="info"
          className="!mr-auto"
        />
        <GoalCounters
          participants={goal.numParticipants}
          posts={goal.numPosts}
        />
      </section>
    </article>
  );
};

export { GoalTeaser, GoalTeaserInfo, GoalTeaserReduced, GoalSearchResult };
