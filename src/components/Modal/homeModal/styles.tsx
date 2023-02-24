import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme: any) => ({
  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    outline: "none",
    "& .MuiDialog-paper": {
      margin: "0px",
      backgroundColor: "transparent",
      justifyContent: "center",
      [theme.breakpoints.between("xs", "sm")]: {
        backgroundColor: "#fff",
        justifyContent: "flex-start",
      },
    },
    "& .MuiDialog-scrollPaper": {
      [theme.breakpoints.between("xs", "sm")]: {
        flex: 1,
      },
    },
  },
  homeModalCover: {
    width: "100%",
    height: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "none",
    outline: "none",
    [theme.breakpoints.between("xs", "sm")]: {
      height: "calc(100vh - 35px)",
    },
  },
  modalBoxLogo: {
    left: "50%",
    top: -26,
    transform: "translate(-50%)",
    boxShadow: "5px 7px 4px rgb(56, 56, 56 , 0.2)",
    position: "absolute",
    backgroundColor: "#fffdfd",
    padding: "5px 8px",
    borderRadius: 5,
  },
  cardInner: {
    width: 500,
    backgroundColor: "#fff",
    overflow: "visible !important",
    padding: 0,
    "@media (min-width: 1200px) and (max-width: 1300px)": {
      marginTop: "25px !important",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      width: "100%",
      maxWidth: "450px",
      marginTop: "0px",
      height: " calc(100% - 115px)",
      boxShadow: "unset !important",
    },
    "& hr": {
      [theme.breakpoints.between("xs", "sm")]: {
        display: "none",
      },
    },
  },
  cardChild: {
    padding: "0px",
    [theme.breakpoints.between("xs", "sm")]: {
      overflow: "hidden",
      height: "100%",
    },
  },
  footer: {
    bottom: 20,
    color: "rgb(213, 209, 209)",
    "@media (max-width: 1400px)": {
      bottom: "-43px",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      bottom: "0px",
      fontSize: 13,
      width: 350,
      justifyContent: "center",
      marginLeft: 20,
      color: "#000",
    },
  },
  linkbox: {
    marginLeft: "15px !important",
    color: "rgb(213, 209, 209) !important",
    textDecoration: "unset  !important",
    cursor: "pointer",
    fontSize: 16,
    [theme.breakpoints.between("xs", "sm")]: {
      fontSize: 13,
      textAlign: "center",
      color: "#000 !important",
    },
  },
  closeIcon: {
    position: "absolute",
    right: 12,
    top: 10,
    cursor: "pointer",
  },
}));
