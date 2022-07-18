import { CircularProgress } from "@mui/material";

import { CustomPage } from "layout";

const LoadingPage = () => {
  return (
    <CustomPage>
      <section className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <CircularProgress />
      </section>
    </CustomPage>
  );
};

export default LoadingPage;
