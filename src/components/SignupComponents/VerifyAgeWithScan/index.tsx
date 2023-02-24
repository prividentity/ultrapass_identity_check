import {
  Button,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import phoneImage from "../../../assets/face-id.png";
import { styles, useStyles } from "../../../pages/signup/styles";
import { theme as Theme } from "../../../theme";
import STEPS from "../../../pages/register/steps";

interface props {
  theme: string;
  skin: string;
  setPrevStep: (e: string) => void;
  setStep: (e: string) => void;
}

const VerifyAgeWithScan = (props: props) => {
  const { skin, setStep, setPrevStep } = props;
  const muiTheme = useTheme();
  const mainTheme = Theme;
  const palette: { [key: string]: any } = mainTheme.palette;
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
          sx={{ paddingTop: 4, paddingBottom: 2 }}
          className={classes.cardHeading}
        >
          CONFIRM YOUR IDENTITY
        </Typography>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Grid
        container
        alignItems={"center"}
        justifyContent={"center"}
        style={styles.cardGrid}
        className={classes.cardGridMobile}
      >
        <img src={phoneImage} alt="scan" width={"180px"} />
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Button
        variant="contained"
        color={"inherit"}
        style={styles.continueButton}
        onClick={() => setStep(STEPS.ENROLL)}
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
          Continue
        </Typography>
      </Button>
      <Button
        variant="text"
        color={"inherit"}
        style={styles.textButton}
        onClick={() => {
          setStep(STEPS.CONSENT_FAIL);
          setPrevStep(STEPS.PRE_ENROLL);
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

export default VerifyAgeWithScan;
