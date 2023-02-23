import { localThemes, theme as Theme } from "../../theme";
import { makeStyles } from "@mui/styles";
const mainTheme = Theme;
const palette: { [key: string]: any } = mainTheme.palette;
const skin = localThemes?.includes(window?.location?.search?.split("skin=")[1])
  ? window?.location?.search?.split("skin=")[1]
  : "primary";

export const styles = {
  arrowIcon: {
    width: 60,
    position: "absolute",
    right: -41,
    color: palette[skin]?.text,
    zIndex: 999999999,
    cursor: "pointer",
  },
  listImage: {
    borderRadius: 15,
    height: 100,
  },
  consentCard: {
    padding: "2px 10px",
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: palette[skin]?.bacckground,
    height: "170px",
    overflow: "auto",
  },
  userImage: {
    borderRadius: 5,
  },
  lockIcon: {
    marginRight: 0,
    width: 32,
    marginTop: 2,
  },
  createAccountButton: {
    margin: "20px auto",
    display: "block",
    marginBottom: 30,
  },
  learnMoreButton: {
    display: "block",
    marginBottom: 0,
    marginTop: 5,
  },
  nextButton: {
    margin: "20px auto",
    display: "block",
    marginBottom: 0,
  },
  shield: {
    width: "217px",
    zIndex: 9999999,
  },
  overlay: {
    zIndex: "9999999",
    position: "absolute",
    left: 0,
    top: "33px",
    width: "101%",
    height: "100%",
    backgroundColor: "rgba(251, 251, 251, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
  input: {
    width: "100%",
    outline: "none",
    borderRadius: 5,
    color: palette[skin]?.listText,
    height: 50,
    padding: "10px 10px",
    boxSizing: "border-box",
    border: `1px solid ${palette[skin]?.listText}`,
    margin: "10px 0px",
    fontSize: 15,
  },
  lastNameInput: {
    width: "100%",
    outline: "none",
    borderRadius: 5,
    color: palette[skin]?.listText,
    height: 50,
    padding: "10px 10px",
    boxSizing: "border-box",
    border: `1px solid ${palette[skin]?.listText}`,
    marginBottom: 10,
    fontSize: 15,
  },
  dlFront: {
    position: "absolute",
    left: "-16px",
    top: "25%",
    width: "250px",
    zIndex: 99999999,
  },
  ageVerifiedButton: {
    fontSize: 20,
    backgroundColor: palette[skin]?.main,
    boxShadow: `0px 0px 20px -7px ${palette[skin]?.main}`,
    margin: "0 20px 5px 0",
    minWidth: 300,
    border: `3px solid ${palette[skin]?.main}`,
    color: palette[skin]?.text,
  },
  ageLearnMoreButton: {
    color: "#ccc",
    fontSize: 20,
    display: "block",
  },
  continueButton: {
    fontSize: 20,
    backgroundColor: palette[skin]?.main,
    // boxShadow: `0px 0px 20px -7px ${palette[skin]?.main}`,
    margin: "20px auto",
    minWidth: 300,
    border: `3px solid ${palette[skin]?.main}`,
    display: "block",
  },
  cardGrid: {
    minHeight: 250,
    padding: "0px 20px",
  },
  textButton: {
    margin: "10px auto",
    display: "block",
    marginTop: -10,
  },
  scanLoader: {
    width: 30,
    height: 30,
    marginBottom: "-9px",
    marginRight: "10px",
  },
  DlFront: {
    position: "absolute",
    zIndex: 999999,
    left: "-69px",
    width: "250px",
    top: "41px",
  },
};

export const useStyles = makeStyles((theme: any) => ({
  cardHeading: {
    [theme.breakpoints.between("xs", "sm")]: {
      fontSize: "14px !important",
      paddingTop: "25px !important",
      paddingBottom: "10px !important",
    },
  },
  cardInnerHeading: {
    [theme.breakpoints.between("xs", "sm")]: {
      fontSize: "20px !important",
    },
  },
  cardInnerText: {
    [theme.breakpoints.between("xs", "sm")]: {
      fontSize: "16px !important",
    },
  },
  smallLock: {
    width: "84px",
    marginBottom: "-16px",
    marginRight: "-24px",
    [theme.breakpoints.between("xs", "sm")]: {
      marginLeft: "-30px",
      width: "77px",
      marginRight: "-17px",
      marginBottom: "-15px",
    },
  },
  cardGridMobile: {
    height: "300px",
    overflow: "auto",
    minHeight: "unset !important",
    [theme.breakpoints.between("xs", "sm")]: {
      height: "calc(100% - 170px)",
      overflow: "auto",
      minHeight: "unset",
      padding: " 0 10px !important",
    },
    "& .DlBack": {
      [theme.breakpoints.between("xs", "sm")]: {
        left: "-10px !important",
        width: "170px !important",
        top: "43px !important",
      },
    },
  },
  cardGridForm: {
    height: "350px",
    overflow: "auto",
    minHeight: "unset !important",
    [theme.breakpoints.between("xs", "sm")]: {
      height: "calc(100% - 150px)",
      overflow: "auto",
      minHeight: "unset",
      padding: " 0 10px !important",
    },
    "& .DlBack": {
      [theme.breakpoints.between("xs", "sm")]: {
        left: "-10px !important",
        width: "170px !important",
        top: "43px !important",
      },
    },
    "& p": {
      [theme.breakpoints.between("xs", "sm")]: {
        paddingTop: "20px !important",
        paddingBottom: "10px !important",
      },
    },
  },
  textButtonUnderline: {
    "&:hover": {
      textDecoration: "underline",
    },
  },
  consentCard: {
    padding: "10px",
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: palette[skin]?.bacckground,
    height: "190px",
    overflow: "auto !important",
    boxShadow: `0px 0px 28px -16px ${palette[skin]?.listText}  !important`,
    [theme.breakpoints.between("xs", "sm")]: {
      height: "calc(100% - 100px)",
    },
  },
  checkFlowContinueButton: {
    height: "43px",
  },
  homeLoader: {
    color: `${palette[skin]?.text} !important`,
    height: "35px !important",
    width: "35px !important",
    marginTop: "-6px !important",
  },
  otherOptions: {
    position: "absolute",
    top: -35,
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
    [theme.breakpoints.between("xs", "sm")]: {
      top: -38,
    },
  },
  optionsOverlay: {
    position: "fixed",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
  },
  optionsWrap: {
    position: "absolute",
    top: 47,
    zIndex: "99999",
    backgroundColor: palette[skin]?.text,
    borderRadius: "10px",
    boxShadow: `0px 0px 14px -3px ${palette[skin]?.listText}`,
    left: -4,
  },
  listText: {
    display: "list-item !important",
    padding: "0 16px !important",
    fontSize: "9px !important",
    color: palette[skin]?.listText,
    lineHeight: "22px",
    [theme.breakpoints.between("xs", "sm")]: {
      fontSize: "12px !important",
      padding: "10px 16px !important",
    },
  },
  checkIcon: {
    color: palette[skin]?.main,
    fontSize: '61px !important',
    margin: '0 auto !important',
    display: 'block !important',
    marginTop: '30px !important',
  },
  errorIcon: {
    color: 'red',
    fontSize: '61px !important',
    margin: '0 auto !important',
    display: 'block !important',
    marginTop: '30px !important',
  }
}));
