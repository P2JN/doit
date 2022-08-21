import { useEffect, useState } from "react";
import axios from "axios";
import { Typography } from "@mui/material";

import { StatsTypes } from "types";
import { mediaUtils } from "utils";

import { Card } from "components/atoms";

const Achievement = (achievement: StatsTypes.Achievement) => {
  const getColor = (type: string) => {
    switch (type) {
      case "bronze":
        return "!text-yellow-800 !fill-yellow-800";
      case "silver":
        return "!text-gray-500 !fill-gray-500";
      case "gold":
        return "!text-yellow-400 !fill-yellow-400";
      case "special":
        return "!text-primary !fill-primary";
      default:
        return "!text-primary !fill-primary";
    }
  };

  const [svg, setSvg] = useState<string>("");
  useEffect(() => {
    axios
      .get(mediaUtils.sanitizeMediaUrl(achievement.urlMedia) || "")
      .then((response) => {
        setSvg(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [achievement.urlMedia]);

  return (
    <Card className="!h-full">
      <div
        className={
          "flex h-full flex-col gap-3 " +
          (achievement.completed ? "" : "fill-gray-400 opacity-20 grayscale")
        }
      >
        <div
          className={
            "flex items-center justify-center " + getColor(achievement.type)
          }
          dangerouslySetInnerHTML={{ __html: svg }}
        ></div>
        <Typography
          variant="h5"
          className={
            "mb-4 text-center !font-bold " + getColor(achievement.type)
          }
        >
          {achievement.title}
        </Typography>
        <Typography
          variant="body1"
          className="!mt-auto text-center leading-tight"
        >
          {achievement.description}
        </Typography>
      </div>
    </Card>
  );
};

export default Achievement;
