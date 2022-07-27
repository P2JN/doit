import { CircularProgress } from "@mui/material";

const Loader = () => {
  return (
    <div className="flex w-full justify-center p-3">
      <CircularProgress />
    </div>
  );
};

export default Loader;
