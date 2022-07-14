import { LinearProgress } from "@mui/material";

const ProgressBar = (props: {
  title: string;
  completed: number;
  objective: number;
  expected?: number;
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-1 text-base text-gray-700">
      <span>{props.title}</span>
      <span>
        {props.completed} / {props.objective}
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
