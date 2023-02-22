import {
  Button,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import smallLock from "../../../assets/smallLock.png";
import { styles, useStyles } from "../../../pages/signup/styles";
import {theme as Theme} from "../../../theme";

interface props {
  theme: string;
  skin: string;
  navigateToUrl: (e: string) => void;
  setStep: (e: string) => void;
  prevStep: string;
}

const CannotVerify = (props: props) => {
  const {
    skin,
    navigateToUrl,
    setStep,
    prevStep,
  } = props;
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
          fontSize={25}
          fontWeight={700}
          mt={4}
        >
          ARE YOU SURE <br />
          YOU WANT TO EXIT?
        </Typography>
        <Typography
          component="p"
          textAlign="center"
          fontSize={20}
          fontWeight={500}
          mt={7}
        >
          AllpassTrust cannot verify your identity
          <br /> without your consent.
        </Typography>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Button
        variant="contained"
        color={"inherit"}
        style={styles.continueButton}
        onClick={() => setStep(prevStep)}
      >
        <Typography
          component="p"
          color={palette?.[skin]?.listText}
          textAlign="center"
          fontWeight={600}
          display="flex"
          alignItems="center"
          justifyContent={"center"}
          textTransform="capitalize"
        >
          Back to consent
        </Typography>
      </Button>
      <Button
        variant="text"
        color={"inherit"}
        style={styles.textButton}
        onClick={() => navigateToUrl( 'someFailureUrl')}
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
          Exit
        </Typography>
      </Button>
    </>
  );
};

export default CannotVerify;
