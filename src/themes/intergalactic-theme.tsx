import { createTheme } from "@mui/material";
import { common, grey } from "@mui/material/colors";

const intergalacticTheme = createTheme({
  palette: {
    buttonPallete: {
      main: grey[400],
    },
    titleGrey: {
      main: "##595c5f",
    },
  },
  typography: {
    sailBold: {
      fontSize: "18px",
      fontColor: "#414552",
      fontWeight: "bold",
      fontFamily: "roboto",
    },
    sailNormal: {
      fontSize: "16px",
      fontColor: "#414552",
      fontFamily: "roboto",
    },
    sailSmall: {
      fontSize: "14px",
      fontColor: "#414552",
      fontFamily: "roboto",
    },
  },
});


export default intergalacticTheme;