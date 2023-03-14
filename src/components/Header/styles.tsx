import { makeStyles } from "@mui/styles";
import { localThemes, theme as Theme } from "../../theme";

const mainTheme = Theme;
const palette: { [key: string]: any } = mainTheme.palette;
const skin = localThemes?.includes(window?.location?.search?.split("skin=")[1])
  ? window?.location?.search?.split("skin=")[1]
  : "primary";
export const styles = {
  appBar: { zIndex: 9999999, backgroundColor: "skyblue" },
  loginButton: { marginRight: 10 },
  homelogo: { marginLeft: 20, marginRight: 20 },
  homeBar: {
    backgroundColor: "transparent",
    borderBottom: "1px solid rgb(118 115 115)",
    boxShadow: "none",
  },
  signupButton: {
    background: "transparent",
    border: "2px solid rgb(100 98 98)",
    marginRight: 5,
    minWidth: "100px",
    lineHeight: 1.25,
    marginBottom: 0,
  },
};

export const useStyles = makeStyles((theme: any) => ({
  dropdownWrap: {
    position: "absolute",
    right: "0px",
    top: "32px",
    backgroundColor: "#fff",
    width: "150px",
    display: "none",
    "& .AgeItem": {
      color: "#000",
      textAlign: "left",
      justifyContent: "flex-start",
      borderBottom: "1px solid #000",
      padding: "10px 20px",
    },
    "&:hover": {
      display: "block",
    },
  },
  headerButton: {
    color: `${palette[skin]?.text} !important`,
    "&:hover > div": {
      display: "block",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      padding: "4px 0px !important",
      minWidth: "70px !important",
    },
  },
  headerButtonMobile: {
    [theme.breakpoints.between("xs", "sm")]: {
      fontSize: 20,
      backgroundColor: `${palette[skin]?.main} !important`,
      margin: "0 20px 5px 0",
      minWidth: 300,
      border: `3px solid ${palette[skin]?.main} !important`,
      color: `white !important`,
    },
  },
  scanLoader: {
    width: "16px !important",
    height: "16px !important",
    marginBottom: "2px",
    marginRight: "0px",
    [theme.breakpoints.between("xs", "sm")]: {
      color: `${palette[skin]?.text} !important`,
    },
  },
}));
