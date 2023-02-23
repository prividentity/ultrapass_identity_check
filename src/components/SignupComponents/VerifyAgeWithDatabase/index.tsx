import {
  Button,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import smallLock from "../../../assets/smallLock.png";
import { theme as Theme } from "../../../theme";
import { styles, useStyles } from "../../../pages/signup/styles";
import STEPS from "../../../pages/register/steps";

interface props {
  skin: string;
  setStep: (e: string) => void;
  setPrevStep: (e: string) => void;
  name?: string;
}

const VerifyAgeWithDatabase = (props: props) => {
  const { skin, setStep, setPrevStep, name = "google" } = props;
  const mainTheme = Theme;
  const palette: { [key: string]: any } = mainTheme.palette;
  const muiTheme = useTheme();
  const matchesSM = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const classes = useStyles();
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
          <img src={smallLock} alt="smallLock" className={classes.smallLock} />{" "}
          IDENTITY VERIFICATION
        </Typography>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Grid style={styles.cardGrid} className={classes.cardGridMobile}>
        <Typography
          component="p"
          textAlign="center"
          fontSize={24}
          fontWeight={700}
          mt={3}
          color={"#333"}
        >
            Verify Your Identity
        </Typography>
        <Typography
          component="p"
          textAlign={matchesSM ? "center" : "left"}
          fontSize={15}
          fontWeight={500}
          mt={5}
        >
          AllpassTrust needs your personal details to validate your identity. All
          personal details will be deleted immediately after processing. No
          images or personal details will be shared with {name}.
        </Typography>
        <Typography
          component="p"
          textAlign={matchesSM ? "center" : "left"}
          fontSize={15}
          fontWeight={500}
          mt={3}
          mb={1}
        >
          Learn how AllpassTrust works
        </Typography>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Button
        variant="contained"
        color={"inherit"}
        style={styles.continueButton}
        onClick={() => setStep(STEPS.REGISTER_CONSENT)}
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
          Accept and continue
        </Typography>
      </Button>
      <Button
        variant="text"
        color={"inherit"}
        style={styles.textButton}
        onClick={() => {
          setStep(STEPS.CONSENT_FAIL);
          setPrevStep(STEPS.PRE_REGISTER);
        }}
      >
        <Typography
          component="p"
          color={palette?.[skin]?.listText}
          textAlign="center"
          fontWeight={500}
          display="flex"
          alignItems="center"
          justifyContent={"center"}
          textTransform="capitalize"
          fontSize={14}
          className={classes.textButtonUnderline}
        >
          No, I do not consent
        </Typography>
      </Button>
    </>
  );
};

export default VerifyAgeWithDatabase;
