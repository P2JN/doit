import { BrowserRouter as Router } from "react-router-dom";
import { QueryClientProvider } from "react-query";
import { createTheme, responsiveFontSizes, ThemeProvider } from "@mui/material";

import { AppPages } from "routes";
import { AppNavbar, AppSidebar } from "layout";
import { StoreProvider } from "store";
import { queryClient } from "services/config";
import { AuthProvider } from "auth";

import { NotificationProvider, ErrorHandler } from "components/organisms";

import theme from "styles/theme.config.json";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <ThemeProvider theme={responsiveFontSizes(createTheme(theme))}>
          <Router>
            <AuthProvider>
              <ErrorHandler>
                <NotificationProvider>
                  <div className="container mx-auto flex h-screen w-screen flex-col justify-center md:flex-row">
                    <AppNavbar />
                    <AppPages />
                    <AppSidebar />
                  </div>
                </NotificationProvider>
              </ErrorHandler>
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}

export default App;
