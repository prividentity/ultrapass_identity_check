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
import { useStyles } from "./styles";
import { localThemes, logos } from "../../../theme";
import { useSearchParams } from "react-router-dom";

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
  const [searchParams] = useSearchParams();
  const skin = (
    localThemes.includes(searchParams.get("skin") as string)
      ? searchParams.get("skin")
      : "up"
  ) as string;
  const logoDark = (logos as any)[skin].dark;
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
    >
      <Box
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
                width={130}
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
            <Link className={classes.linkbox}>Privacy</Link>
            <Link className={classes.linkbox}>Terms of Service</Link>
          </ListItem>
        </Grid>
      </Box>
    </Dialog>
  );
};

export default HomeModal;
