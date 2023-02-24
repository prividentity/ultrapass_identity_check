import { localThemes, theme as Theme } from "../../theme";
import { makeStyles } from "@mui/styles";
const mainTheme = Theme;
const palette: { [key: string]: any } = mainTheme.palette;
const skin = localThemes?.includes(window?.location?.search?.split("skin=")[1])
  ? window?.location?.search?.split("skin=")[1]
  : "primary";

export const styles = {
  shield: {
    width: "217px",
    zIndex: 9999999,
  },
  overlayCamera: {
    zIndex: "9999999",
    position: "absolute",
    left: 0,
    top: "56px",
    width: "100%",
    height: "82%",
    backgroundColor: "rgba(251, 251, 251, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
export const useStyles = makeStyles((theme: any) => ({
  otherOptions: {
    margin: "0px !important",
    "& p": {
      cursor: "pointer",
      color: palette[skin]?.main,
      margin: "0px !important",
      marginLeft: "-4px !important",
    },
    "& p:hover": {
      textDecoration: "underline",
    },
    "& svg": {
      position: "relative",
      top: 6.5,
      color: palette[skin]?.main,
      width: "21px",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      top: -38,
    },
  },
  otherDevice: {
    position: "relative",
    "& p": {
      cursor: "pointer",
      color: palette[skin]?.main,
      marginLeft: -4,
    },
    "& p:hover": {
      textDecoration: "underline",
    },
    "& svg": {
      position: "relative",
      top: 6.5,
      color: palette[skin]?.main,
      width: "21px",
    },
  },
  cardHeading: {
    [theme.breakpoints.between("xs", "sm")]: {
      fontSize: "14px !important",
      paddingTop: "25px !important",
      paddingBottom: "10px !important",
    },
  },
  progressBar: {
    width: "25px !important",
    height: "25px !important",
    marginRight: "10px !important",
  }
}));
