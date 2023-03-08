import { useEffect, useContext } from "react";
import { Button, Divider, Grid, Typography } from "@mui/material";
import { useStyles, styles } from "../../pages/register/styles";
import { theme as Theme, nameMap } from "../../theme";
import { useNavigate } from "react-router";
import ErrorIcon from "@mui/icons-material/Error";
import { getStatusFromUser, SUCCESS } from "../../utils";
import { UserContext } from "../../context/UserContext";

const VerificationNotCompleted = ({
  setStep,
  skin,
  matchesSM,
}: {
  setStep: any;
  skin: string;
  matchesSM: boolean;
}) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const mainTheme = Theme;
  const palette: { [key: string]: any } = mainTheme.palette;
  const context = useContext(UserContext);
  useEffect(() => {
    setTimeout(() => {
      const status = getStatusFromUser(window.localStorage.getItem("user"));
      const { successUrl } = context.verificationSession;
      if (successUrl && status === SUCCESS) {
        window.location.href = successUrl;
      }
    }, 2000);
  }, []);

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
          Verification Not Completed
        </Typography>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Grid style={styles.cardGrid} className={classes.cardGridMobile}>
        <ErrorIcon className={classes.errorIcon} />
        <Typography
          component="p"
          textAlign={"center"}
          fontSize={20}
          fontWeight={900}
          lineHeight={1.5}
          mt={2}
          className={classes.cardInnerHeading}
        >
          Please visit a {nameMap[skin]} location to complete your registration.
        </Typography>
      </Grid>
      <Grid style={{ marginBottom: 50 }}>
        {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
        <Button
          variant="contained"
          color={"inherit"}
          style={styles.continueButton}
          onClick={() => navigate("/")}
        >
          <Typography
            component="p"
            color={palette?.[skin]?.text}
            textAlign="center"
            fontWeight={600}
            display="flex"
            alignItems="center"
            justifyContent={"center"}
            textTransform="capitalize"
          >
            Close
          </Typography>
        </Button>
      </Grid>
    </>
  );
};

export default VerificationNotCompleted;
