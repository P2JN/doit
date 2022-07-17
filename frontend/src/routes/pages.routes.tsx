import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CircularProgress } from "@mui/material";

import { useActiveUser } from "store";
import {
  ErrorPage,
  ExplorePage,
  FeedPage,
  HomePage,
  LandingPage,
  AuthPage,
  NotificationsPage,
} from "pages";

const AppPages = () => {
  const { activeUser } = useActiveUser();

  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <CircularProgress />
        </div>
      }
    >
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/auth/:action" element={<AuthPage />} />

        {activeUser && (
          <>
            <Route path="/home/*" element={<HomePage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </>
        )}

        <Route
          path="/404"
          element={<ErrorPage errorMessage="404!, not found!" />}
        />
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </Suspense>
  );
};

export default AppPages;
