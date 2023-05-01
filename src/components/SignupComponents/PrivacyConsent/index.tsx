import {
  Button,
  Card,
  Divider,
  Grid,
  List,
  ListItem,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import smallLock from "../../../assets/smallLock.png";
import { styles, useStyles } from "../../../pages/signup/styles";
import { theme as Theme } from "../../../theme";
import STEPS from "../../../pages/register/steps";

interface props {
  theme: string;
  skin: string;
  setStep: (e: string) => void;
  setPrevStep: (e: string) => void;
}

const PrivacyConsent = (props: props) => {
  const { skin, setStep, setPrevStep } = props;
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
          <img src={smallLock} alt="smallLock" className={classes.smallLock} />
          VERIFIED IDENTITY
        </Typography>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Grid style={styles.cardGrid} className={classes.cardGridMobile}>
        <Typography
          component="p"
          textAlign="center"
          fontSize={18}
          fontWeight={700}
          mt={2}
          color={"#333"}
        >
          Station Casinos Values Your Privacy
        </Typography>
        <Card className={classes.consentCard}>
          <List
            sx={{
              listStyleType: "disc",
              pl: 2,
            }}
          >
            <ListItem className={classes.listText}>
              Station Casinos never captures, collects, stores or manages your
              biometric data. Your biometric data will be stored locally on your
              device, encrypted, and deleted within one second.
            </ListItem>
            <ListItem className={classes.listText}>
              Station Casinos will never disclose your biometric data, as
              provided in the retention schedule set forth in the Station
              Casinos Biometric Information Policy, a copy of which is posted
              online at: LINK.
            </ListItem>
            <ListItem className={classes.listText}>
              Only anonymized data, fully homomorphic encrypted and certified
              compliant with IEEE 2410 Standard for Biometric Privacy, is used
              by Station Casinos or its Third Party Agent to register your
              account, authenticate you online, or control access to physical
              facilities.
            </ListItem>
            <ListItem className={classes.listText}>
              By clicking the “Agree and continue” button below, you acknowledge
              that you have read the Station Casinos Biometric Information
              Privacy Policy and you consent to Station Casinos collection, use,
              and storage of your biometric for the above stated purpose.
            </ListItem>
          </List>
        </Card>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Button
        variant="contained"
        color={"inherit"}
        style={styles.continueButton}
        onClick={() => setStep(STEPS.REGISTER_FORM)}
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
          Agree and continue
        </Typography>
      </Button>
      <Button
        variant="text"
        color={"inherit"}
        style={styles.textButton}
        onClick={() => {
          setStep(STEPS.CONSENT_FAIL);
          setPrevStep(STEPS.REGISTER_CONSENT);
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
          fontSize={13}
          className={classes.textButtonUnderline}
        >
          No, don’t verify
        </Typography>
      </Button>
    </>
  );
};

export default PrivacyConsent;
