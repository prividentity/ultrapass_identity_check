import { Button, Divider, Grid, Typography } from "@mui/material";
import smallLock from "../../../assets/smallLock.png";
import { styles, useStyles } from "../../../pages/signup/styles";
import STEPS from "../../../pages/register/steps";

interface props {
  theme: string;
  setPrevStep: (e: string) => void;
  setStep: (e: string) => void;
}

const AgeCheckDatabase = (props: props) => {
  const { theme, setPrevStep, setStep } = props;
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
      <Divider color="#000" />
      <Grid style={styles.cardGrid} className={classes.cardGridMobile}>
        <Typography
          component="p"
          textAlign="center"
          fontSize={24}
          fontWeight={700}
          mt={3}
          color={"#333"}
        >
          Verify your Identity
        </Typography>
        <Typography
          component="p"
          textAlign={"center"}
          fontSize={22}
          fontWeight={700}
          color={"#999"}
          mt={7}
        >
          Please prepare to enter your <br /> SSN and Phone Number
        </Typography>
      </Grid>
      <Divider color="#000" />
      <Button
        variant="contained"
        color={theme as "inherit"}
        style={styles.continueButton}
        onClick={() => setStep(STEPS.REGISTER_FORM)}
      >
        <Typography
          component="p"
          color={`#fff`}
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
        color={theme as "inherit"}
        style={styles.textButton}
        onClick={() => {
          setStep(STEPS.CONSENT_FAIL);
          setPrevStep(STEPS.PRE_REGISTER_FORM);
        }}
      >
        <Typography
          component="p"
          color={`#000`}
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

export default AgeCheckDatabase;
