import { red } from "@material-ui/core/colors";
import { createTheme } from "@material-ui/core/styles";

// Create a theme instance.
const theme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#FFB886",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#057A68",
    },
    info: {
      main: red.A400,
    },
  },
});

export default theme;
