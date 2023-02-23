import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useStyles, styles } from "../../pages/register/styles";
import { theme as Theme, theme } from "../../theme";

import smallLock from "../../assets/smallLock.png";
import STEPS from "../../pages/register/steps";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import { CameraAlt } from "@mui/icons-material";
import { componentsParameterInterface } from "../../interface";

const CameraPermissionFail = ({
  setStep,
  setPrevStep,
  skin,
  matchesSM,
}: componentsParameterInterface) => {
  const classes = useStyles();
  const mainTheme = Theme;
  const palette: { [key: string]: any } = mainTheme.palette;
  return (
    <>
      <Grid container alignItems="center" justifyContent={"center"}>
        <Typography
          component="p"
          textAlign="center"
          fontSize={16}
          fontWeight={900}
          letterSpacing={"1px"}
          sx={{ paddingTop: 3, paddingBottom: 2 }}
          className={classes.cardHeading}
        >
          <img src={smallLock} alt="smallLock" className={classes.smallLock} />
          ANONYMOUS AGE VERIFICATION
        </Typography>
      </Grid>
      <Grid style={styles.cardGrid} className={classes.cardGridMobile}>
        <Box className={classes.allowCameraBox}>
          <CameraAlt />
        </Box>
        <Typography
          id="modal-modal-description"
          sx={{ mt: 2 }}
          color={palette?.[skin]?.listText}
          textAlign="center"
          fontWeight={700}
          fontSize={22}
        >
          Camera permission needed
        </Typography>
        <Typography
          component="p"
          textAlign={"center"}
          fontSize={16}
          fontWeight={500}
          color={"#333"}
          mt={2}
        >
          To update permissions, see the instructions{" "}
          <span
            onClick={() =>
              window.open(
                "https://support.google.com/chrome/answer/2693767?co=GENIE.Platform%3DDesktop"
              )
            }
            style={{
              color: palette[skin]?.main,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            here
          </span>
          .
        </Typography>
      </Grid>
      <Box className={classes.otherOptionsBottom}>
        <Typography
          component="p"
          textAlign={matchesSM ? "center" : "left"}
          fontSize={15}
          fontWeight={500}
          mt={2}
          onClick={() => {
            setStep(STEPS.SWITCH_DEVICE);
          }}
        >
          <PhoneIphoneIcon /> Switch to other device
        </Typography>
      </Box>
    </>
  );
};

export default CameraPermissionFail;
