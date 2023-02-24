import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme: any) => ({
  documentBarCodeOverlay: {
    position: "absolute",
    top: 47,
    width: "100%",
    height: "343px",
    background: "rgba(0,0,0,0.5)",
    // clipPath:
    //   "polygon(0% 0%, 0% 100%, 25% 100%, 25% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 100%, 100% 100%, 100% 0%)",
    clipPath: "polygon(0% 0%, 0% 100%, 0% 100%, 0% 30%, 100% 30%, 100% 72%, 0% 72%, 0% 100%, 100% 100%, 100% 0%)",
    zIndex: 999,
    left: 2,
    borderRadius: "7px",
  },
}));
