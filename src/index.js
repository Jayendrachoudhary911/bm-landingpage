import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#ffffff",
      paper: "#f5f5f5"
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif"
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={lightTheme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);