import { ReactNode } from "react";
import { Typography } from "@mui/material";

import { Card } from "components/atoms";

const StatCounter = (props: {
  value?: number;
  label: string;
  icon?: ReactNode;
}) => {
  return (
    <Card className="!h-full">
      <div className="my-auto flex h-full items-center gap-2 md:flex-col md:justify-center md:justify-between">
        {props.icon}
        <Typography variant="h3" className="!mr-auto md:!mr-0">
          {props.value || 0}
        </Typography>
        <Typography variant="h6" className="text-right leading-tight">
          {props.label}
        </Typography>
      </div>
    </Card>
  );
};

const HorizontalStatCounters = (props: {
  items: { value?: number; label: string }[];
}) => {
  const isBig = props.items.length > 3;
  return (
    <Card className="!h-full">
      <div
        className={
          "flex h-full flex-col justify-center " + (isBig ? "gap-2" : "gap-3")
        }
      >
        {props.items.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <Typography variant={isBig ? "h5" : "h4"}>
              {item.value || 0}
            </Typography>
            <Typography variant="h6" className="text-right leading-tight">
              {item.label}
            </Typography>
          </div>
        ))}
      </div>
    </Card>
  );
};

export { StatCounter, HorizontalStatCounters };
