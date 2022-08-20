import { CheckCircleOutline } from "@mui/icons-material";
import { LinearProgress } from "@mui/material";

const ProgressBar = (props: {
  title?: string;
  completed: number;
  objective: number;
  expected?: number;
  unit?: string;
}) => {
  const isCompleted = props.completed >= props.objective;

  return (
    <div className="flex flex-wrap items-center justify-between gap-1 text-base text-gray-700">
      {props.title && (
        <span className="flex items-center gap-3">
          {isCompleted && <CheckCircleOutline color="primary" />} {props.title}
        </span>
      )}
      <span>
        {props.completed} / {props.objective} {props.unit?.slice(0, 3)}{" "}
      </span>
      <LinearProgress
        className="!h-2 w-full rounded-full"
        variant={props.expected ? "buffer" : "determinate"}
        value={Math.min((props.completed * 100) / props.objective, 100)}
        valueBuffer={
          props.expected ? (props?.expected * 100) / props.objective : undefined
        }
      />
    </div>
  );
};

export default ProgressBar;
