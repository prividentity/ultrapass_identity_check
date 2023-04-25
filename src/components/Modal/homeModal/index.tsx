import React from "react";
import {
  Box,
  Card,
  CardContent,
  Dialog,
  Grid,
  Link,
  ListItem,
  Typography,
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
  onBack?: () => void;
  onFeedback?: () => void;
  showFeedback?: boolean;
}

const HomeModal = (props: props) => {
  const { open, handleClose, onBack, onFeedback, showFeedback } = props;
  const children: any = props?.children;
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
            {children}
          </CardContent>
          {children?.props?.skin && showFeedback && (
            <Grid
              display={"flex"}
              alignItems={"center"}
              mb={"-25px"}
              justifyContent={matchesSM ? 'center' : "flex-end"}
              pt={1}
              pl={matchesSM ? 2 : ""}
              pr={matchesSM ? 2 : ""}
            >
              <Link
                color={"#fff"}
                className={classes.linkbox}
                onClick={onFeedback}
                ml={"0px !important"}
              >
                Feedback
              </Link>
            </Grid>
          )}
        </Card>
        <Grid
          sx={{ position: "absolute", bottom: matchesSM ? -25 : "" }}
          className={classes.footer}
        >
          <ListItem>
            <Typography
              component="p"
              textAlign="center"
              fontSize={16}
              color={matchesSM ? "#000" : "#fff"}
            >
              Powered by Ultrapass.
            </Typography>

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
