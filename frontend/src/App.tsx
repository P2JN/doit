import { BrowserRouter as Router } from "react-router-dom";
import { QueryClientProvider } from "react-query";
import { createTheme, responsiveFontSizes, ThemeProvider } from "@mui/material";

import { AppPages } from "routes";
import { AppNavbar } from "layout";
import { StoreProvider, useActiveUser } from "store";
import { queryClient } from "services/config";

import { NotificationProvider } from "components/organisms";

import theme from "styles/theme.config.json";
import { ReactNode, useEffect } from "react";
import { socialService } from "services";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <ThemeProvider theme={responsiveFontSizes(createTheme(theme))}>
          <AuthProvider>
            <NotificationProvider />
            <Router>
              <div className="container mx-auto flex h-full w-full justify-center">
                <AppNavbar />
                <AppPages />
              </div>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}

const AuthProvider = (props: { children: ReactNode }) => {
  const { setActiveUser } = useActiveUser();

  const { data: user, isLoading } = socialService.useActiveUser();
  useEffect(() => {
    console.log(user);
    user && setActiveUser(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return <>{!isLoading && props.children}</>;
};

export default App;
