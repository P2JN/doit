import { Navigate, Route, Routes } from "react-router-dom";

import { useActiveUser } from "store";
import {
  ErrorPage,
  ExplorePage,
  FeedPage,
  HomePage,
  LandingPage,
  AuthPage,
  NotificationsPage,
  LoadingPage,
} from "pages";

const AppPages = () => {
  const { activeUser } = useActiveUser();

  return (
    <Routes>
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/auth/:action" element={<AuthPage />} />
      <Route path="/loading" element={<LoadingPage />} />
      <Route path="/logout" element={<Navigate to="/auth/login" />} />

      {activeUser && (
        <>
          <Route path="/home/*" element={<HomePage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </>
      )}
      <Route path="*" element={<Navigate to="/auth/login" />} />

      <Route
        path="/404"
        element={<ErrorPage errorMessage="404!, not found!" />}
      />
    </Routes>
  );
};

export default AppPages;
