import { Typography } from "@mui/material";

import { StatsTypes } from "types";
import { mediaUtils } from "utils";

import { Card } from "components/atoms";

const Achievement = (achievement: StatsTypes.Achievement) => {
  return (
    <Card className="!h-full">
      <div
        className={
          "flex h-full flex-col gap-2 !text-primary" +
          (achievement.completed ? "" : "fill-gray-400 opacity-20 grayscale")
        }
      >
        <img
          src={mediaUtils.sanitizeMediaUrl(achievement.urlMedia)}
          alt={achievement.title}
          className="mx-auto w-[100px]"
        />
        <Typography variant="h5" className="mb-4 text-center !font-bold">
          {achievement.title}
        </Typography>
        <Typography
          variant="body1"
          className="!mt-auto text-left leading-tight"
        >
          {achievement.description}
        </Typography>
      </div>
    </Card>
  );
};

export default Achievement;
