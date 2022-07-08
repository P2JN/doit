import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CircularProgress } from "@mui/material";

import {
  ErrorPage,
  ExplorePage,
  FeedPage,
  HomePage,
  LandingPage,
  NotificationsPage,
} from "pages";

const AppPages = () => (
  <Suspense
    fallback={
      <div className="flex h-full w-full items-center justify-center">
        <CircularProgress />
      </div>
    }
  >
    <Routes>
      <Route path="/landing" element={<LandingPage />} />

      <Route path="/home" element={<HomePage />} />
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/notifications" element={<NotificationsPage />} />

      <Route
        path="/404"
        element={<ErrorPage errorMessage="404!, not found!" />}
      />
      <Route path="*" element={<Navigate to="/landing" />} />
    </Routes>
  </Suspense>
);

export default AppPages;
