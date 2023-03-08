import React from "react";
import {
  Box,
  Card,
  CardContent,
  Dialog,
  Grid,
  Link,
  ListItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import centralLogo from "../../../assets/centralLogo.png";
import { useStyles } from "./styles";
import { logos } from "../../../theme";
import { useSkinContext } from "../../../context/SkinContext";

interface props {
  open: boolean;
  handleClose?: () => void;
  theme?: string;
  children?: React.ReactNode;
  skin?: string;
}

const HomeModal = (props: props) => {
  const { open, handleClose } = props;
  const classes = useStyles();
  const muiTheme = useTheme();

  const { skin } = useSkinContext();
  const logoDark = skin === "c1" ? (logos as any)[skin].dark : centralLogo;
  const matchesSM = useMediaQuery(muiTheme.breakpoints.down("sm"));
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      hideBackdrop
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      id="homeModal"
      className={classes.modal}
      fullScreen={true}
      sx={{
        "& .MuiDialog-paper": {
          boxShadow: "none",
        },
      }}
    >
      <Box
        mt={matchesSM ? 0 : 3}
        className={classes.homeModalCover}
        sx={{ position: "relative", flexDirection: "column" }}
      >
        <Card
          sx={{ position: "relative", padding: 0 }}
          className={classes.cardInner}
        >
          {matchesSM ? null : (
            <div style={{ backgroundColor: "#ffffff" }}>
              <img
                src={logoDark}
                alt=""
                width={100}
                height={40}
                className={classes.modalBoxLogo}
              />
            </div>
          )}
          <CloseIcon className={classes.closeIcon} onClick={handleClose} />
          <CardContent className={classes.cardChild} style={{ padding: 0 }}>
            {props.children}
          </CardContent>
        </Card>
        <Grid sx={{ position: "absolute" }} className={classes.footer}>
          <ListItem>
            Powered by Ultrapass.
            {/* <Link color={"#000"} className={classes.linkbox}>
              Privacy
            </Link>
            <Link color={"#000"} className={classes.linkbox}>
              Terms of Service
            </Link> */}
          </ListItem>
        </Grid>
      </Box>
    </Dialog>
  );
};

export default HomeModal;
