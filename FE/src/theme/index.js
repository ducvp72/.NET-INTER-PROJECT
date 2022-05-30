import { createTheme } from "@material-ui/core/styles";

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 720,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    primary: {
      main: "#0E1E40",
    },
    secondary: {
      main: "#f50057",
    },
  },
  typography: {
    fontFamily: ['"Roboto"', "sans-serif"].join(","),
    h1: {
      fontSize: "24px",
      fontWeight: 500,
    },
    h2: {
      fontSize: "20px",
      fontWeight: 500,
    },
    h3: {
      fontSize: "16px",
      fontWeight: 500,
    },
    h4: {
      fontSize: "14px",
      fontWeight: 500,
    },
    h5: {
      fontSize: "13px",
      fontWeight: 500,
    },
    h6: {
      fontSize: "12px",
      fontWeight: 400,
    },
  },
});
