import { BrowserRouter as Router } from "react-router-dom";
import { QueryClientProvider } from "react-query";
import { createTheme, responsiveFontSizes, ThemeProvider } from "@mui/material";

import { AppPages } from "routes";
import { AppNavbar } from "layout";
import { StoreProvider } from "store";
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
            <div className="container mx-auto flex h-full w-full justify-center">
              <AppNavbar />
              <AppPages />
            </div>
          </Router>
        </ThemeProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}

export default App;
