import { DEFAULT_THEME, localThemes, theme as Theme } from "../../theme";
import { makeStyles } from "@mui/styles";

const mainTheme = Theme;
const palette: { [key: string]: any } = mainTheme.palette;
const skin = localThemes?.includes(window?.location?.search?.split("skin=")[1])
  ? window?.location?.search?.split("skin=")[1]
  : DEFAULT_THEME;

export const useStyles = makeStyles((theme: any) => ({
  documentBarCodeOverlay: {
    // position: "absolute",
    // top: 47,
    // width: "100%",
    // height: "343px",
    // background: "rgba(0,0,0,0.5)",
    // // clipPath:
    // //   "polygon(0% 0%, 0% 100%, 25% 100%, 25% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 100%, 100% 100%, 100% 0%)",
    // clipPath: "polygon(0% 0%, 0% 100%, 0% 100%, 0% 30%, 100% 30%, 100% 72%, 0% 72%, 0% 100%, 100% 100%, 100% 0%)",
    // zIndex: 999,
    // left: 2,
    // borderRadius: "7px",
  },
  otherOptions: {
    marginBottom: "10px !important",
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
}));
