import { ReactNode, useEffect, useState } from "react";
import { BrowserRouter as Router, useMatch } from "react-router-dom";
import { QueryClientProvider } from "react-query";
import { createTheme, responsiveFontSizes, ThemeProvider } from "@mui/material";

import { socialService } from "services";
import { AppPages } from "routes";
import { AppNavbar } from "layout";
import { StoreProvider, useActiveUser } from "store";
import { queryClient } from "services/config";

import { NotificationProvider } from "components/organisms";

import theme from "styles/theme.config.json";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <ThemeProvider theme={responsiveFontSizes(createTheme(theme))}>
          <NotificationProvider />
          <Router>
            <AuthProvider>
              <div className="container mx-auto flex h-full w-full justify-center">
                <AppNavbar />
                <AppPages />
              </div>
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}

const AuthProvider = (props: { children: ReactNode }) => {
  const { setActiveUser } = useActiveUser();
  const loggedOut = useMatch("/auth/login");
  const loggedIn = useMatch("/loading");

  const [isReady, setIsReady] = useState(false);

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = socialService.useActiveUser();

  useEffect(() => {
    if (isError) setActiveUser(undefined);
    else setActiveUser(user?.mongoUser);
    if (isError || user?.mongoUser) setIsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isError]);

  useEffect(() => {
    (loggedOut || loggedIn) && refetch();
  }, [loggedOut, loggedIn, refetch]);

  return <>{!isLoading && isReady && props.children}</>;
};

export default App;
