import { makeStyles } from "@mui/styles";
import { localThemes, theme as Theme } from "../../theme";

const mainTheme = Theme;
const palette: { [key: string]: any } = mainTheme.palette;
const skin = localThemes?.includes(window?.location?.search?.split("skin=")[1])
  ? window?.location?.search?.split("skin=")[1]
  : "primary";

export const useStyles = makeStyles((theme: any) => ({
  homeHeading: {
    textAlign: "left",
    [theme.breakpoints.between("xs", "sm")]: {
      fontSize: "28px !important",
      lineHeight: "40px  !important",
      textAlign: "center",
    },
  },
  homeSubHeading: {
    textAlign: "left",
    [theme.breakpoints.between("xs", "sm")]: {
      fontSize: "16px !important",
      lineHeight: "40px",
      textAlign: "center",
      padding: "10px 8px",
      paddingBottom: "0px",
      marginTop: "0px !important",
      marginBottom: "4rem !important",
    },
  },
  buttonsGrid: {
    [theme.breakpoints.between("xs", "sm")]: {
      paddingTop: "20px !important",
    },
  },
  buttonsWrap: {
    justifyContent: "flex-start",
    [theme.breakpoints.between("xs", "sm")]: {
      justifyContent: "center",
    },
  },
  buttonsWrapButton: {
    fontWeight: "500 !important",
    marginBottom: "12px !important",
    [theme.breakpoints.between("xs", "sm")]: {
      marginRight: "0 !important",
      width: "100%",
      marginBottom: "9px !important",
    },
    "& p": {
      [theme.breakpoints.between("xs", "sm")]: {
        position: "absolute",
        right: 8,
        bottom: 0,
        margin: 0,
        fontSize: 12,
      },
    },
  },
  flowdropDown: {
    width: "300px",
    [theme.breakpoints.between("xs", "sm")]: {
      width: "100%",
    },
    "& fieldset": {
      width: "281px",
      border: `1px solid ${palette[skin]?.text} !important`,
      [theme.breakpoints.between("xs", "sm")]: {
        width: "96%",
      },
    },
    "& .MuiInputBase-input": {
      color: palette[skin]?.text,
    },
    "& svg": {
      color: palette[skin]?.text,
    },
  },
  menuPaper: {
    maxHeight: "250px !important",
    [theme.breakpoints.between("xs", "sm")]: {
      bottom: '12rem !important',
      top: 'unset !important',
    },
  },
  homeLoader: {
    color: `${palette[skin]?.text} !important`,
    height: "35px  !important",
    width: "35px  !important",
  },
  buttonsBox: {
    display: "flex",
    flexDirection: "column",
    width: "200px",
    [theme.breakpoints.between("xs", "sm")]: {
      width: "100%",
    },
  },
  redTubeButton: {
    backgroundColor: "#b70000 !important",
    borderColor: "#b70000 !important",
    color: `${palette[skin]?.text} !important`,
    boxShadow: "unset !important",
  },
  mainWrap: {
    [theme.breakpoints.between("xs", "sm")]: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
    },
  },
  innerWrap: {
    [theme.breakpoints.between("xs", "sm")]: {
      flex: 1,
    },
  },
}));
