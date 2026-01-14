import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { DeviceDataProvider } from "./context/DeviceDataContext";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={createTheme()}>
      <CssBaseline />
      <DeviceDataProvider>
        <App />
      </DeviceDataProvider>
    </ThemeProvider>
  </React.StrictMode>
);
