import { BrowserRouter as Router } from "react-router-dom";
import { QueryClientProvider } from "react-query";
import { createTheme, responsiveFontSizes, ThemeProvider } from "@mui/material";

import { AppPages } from "routes";
import { AppNavbar } from "layout";

import StoreProvider from "store/provider";
import { queryClient } from "services/config";
import theme from "styles/theme.config.json";
import { NotificationProvider } from "components/3-organisms";

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
