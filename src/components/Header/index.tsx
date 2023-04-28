import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Grid,
  Divider,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router";
import logoBlack from "../../assets/centralLogo.png";
import { styles, useStyles } from "./styles";
import useDelete from "../../hooks/useDelete";
import { createVerificationSession, deleteUserApi } from "../../services/api";
import useToast from "../../utils/useToast";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import config from "../../config";
import { createSearchParams } from "react-router-dom";
import { logos } from "../../theme";
import useCameraPermissions from "../../hooks/useCameraPermissions";
import { useSkinContext } from "../../context/SkinContext";
import StationLogo from "../../assets/stations.png";

interface props {
  theme?: string;
}
const Header = (props: props) => {
  const { isCameraGranted } = useCameraPermissions();
  const { theme } = props;
  const muiTheme = useTheme();
  const matchesSM = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const Logos: { [key: string]: any } = logos;
  const { skin } = useSkinContext();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const uuid = JSON.parse(localStorage.getItem("uuid") || "{}");
  const { showToast } = useToast();
  const navigate = useNavigate();
  const classes = useStyles();
  const [loader, setLoader] = useState(true);
  const isStncharms = skin === "stncharms";
  const renderHeaderImage = () => {
    const isAtHomePage =
      window.location.pathname === "/" ||
      window?.location?.pathname === "/register" ||
      window?.location?.pathname === "/signin";
    if (isAtHomePage) {
      return (
        <img
          src={
            window.location.pathname === "/" && isStncharms
              ? Logos?.[skin].dark
              : !matchesSM
              ? Logos?.[skin].dark
              : Logos?.[skin].light
          }
          alt=""
          width={isStncharms ? 100 : skin === "c1" ? 120 : 140}
          onClick={() => navigate("/")}
          style={{ cursor: "pointer", marginTop: 20 }}
          className="headerLogo"
        />
      );
    }
  };

  const onSignInClick = async () => {
    if (isCameraGranted) {
      navigate("/signin");
    } else {
      await createVerification("9");
    }
  };

  const createVerification = async (step?: string) => {
    const payload = config.clientConfig;
    const result: any = await createVerificationSession(payload);
    if (result?.token) {
      navigate({
        pathname: "/register",
        search: createSearchParams({
          token: result?.token || "",
          step: step || "",
        }).toString(),
      });
    }
  };

  let wrapper =
    window.location.pathname === "/" ||
    window?.location?.pathname === "/register" ||
    window?.location?.pathname === "/signin"
      ? styles.homeBar
      : styles.appBar;

  const onLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("uuid");
    navigate("/");
  };

  const onDeleteAccount = () => {
    const payload = {
      guid: user?.guid,
    };
    onDeleteUser(uuid || user?.uuid);
    deleteUserApi(payload as any);
    showToast("Deleted Successfully", "success");
    localStorage.removeItem("user");
    localStorage.removeItem("uuid");
    navigate("/");
  };

  const useDeleteCallback = (deleteStatus: any) => {
    // console.log("delete callback");
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { onDeleteUser } = useDelete(useDeleteCallback);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        style={{
          ...wrapper,
          borderBottom: skin === "c1" ? "none" : "inherit",
          backgroundColor: skin === "c1" ? "white" : "inherit",
          zIndex: 9999999,
        }}
      >
        <Toolbar>
          {renderHeaderImage()}
          <Grid container alignItems="center" justifyContent={"flex-end"}>
            {window.location.pathname === "/" ||
            window?.location?.pathname === "/register" ||
            window?.location?.pathname === "/signin" ? (
              <img
                src={
                  isStncharms ? StationLogo : matchesSM ? logoBlack : logoBlack
                }
                alt=""
                width={isStncharms ? 120 : 80}
                height={isStncharms ? "" : 40}
                style={styles.homelogo}
                className="headerLogo centralLogo"
              />
            ) : null}
          </Grid>
          <Grid
            container
            alignItems="center"
            justifyContent={"flex-end"}
            style={{ flex: 1 }}
          >
            {user?._id ? (
              <>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    <Avatar sx={{ width: 32, height: 32 }} />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 99999991,
                      },
                      ul: {
                        paddingBottom: 0,
                        paddingTop: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  {" "}
                  <MenuItem
                    className="AgeItem"
                    onClick={() => onDeleteAccount()}
                  >
                    Delete account
                  </MenuItem>
                  <Divider color="#000" style={{ margin: 0 }} />
                  <MenuItem className="AgeItem" onClick={() => onLogout()}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                {" "}
                {window.location.pathname === "/" ||
                window?.location?.pathname === "/register" ? (
                  <Button
                    color={theme as "inherit"}
                    variant="contained"
                    style={styles.signupButton}
                    className={`${classes.headerButton} ${
                      matchesSM ? classes.headerButtonMobile : ""
                    }`}
                    onClick={onSignInClick}
                    sx={{
                      textTransform: "unset",
                      color: skin === "c1" ? "black" : undefined,
                    }}
                  >
                    Sign in
                  </Button>
                ) : (
                  <Button
                    color={theme as "inherit"}
                    variant="contained"
                    sx={{ textTransform: "unset" }}
                    style={styles.signupButton}
                    className={`${classes.headerButton} ${
                      matchesSM ? classes.headerButtonMobile : ""
                    }`}
                    onClick={() => createVerification()}
                  >
                    {loader ? (
                      <CircularProgress className={classes.scanLoader} />
                    ) : (
                      "Register"
                    )}
                  </Button>
                )}
              </>
            )}
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
