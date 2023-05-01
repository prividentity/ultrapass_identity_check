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

const DatabaseConsent = (props: props) => {
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
          USER CONSENT
        </Typography>
        <Card className={classes.consentCard}>
          <List
            sx={{
              listStyleType: "disc",
              pl: 2,
            }}
          >
            {skin === "c1" ? (
              <>
                <ListItem className={classes.listText}>
                  I acknowledge I am over 18 years of age and all information I
                  provided is accurate.
                </ListItem>
                <ListItem className={classes.listText}>
                  Capital One and our third-party enrollment and identity
                  proofing service provider Private ID and its contract
                  providers may share, use and maintain the images and
                  information you provide, and the information on file with
                  other third-party service providers or governments, to further
                  verify your age or identity, to protect against or prevent
                  actual or potential fraud or unauthorized use of the Service
                  for the duration of our business relationship.
                </ListItem>
                <ListItem className={classes.listText}>
                  I have read and agreed to the Capital One Terms of Service and
                  Privacy Policy.
                </ListItem>
              </>
            ) : (
              <>
                <ListItem className={classes.listText}>
                  This Station Casinos-CAMS Private ID® app protects your
                  privacy by immediately encrypting your selfie into anonymized
                  data on your device, in compliance with IEEE 2410 Standard for
                  Biometric Privacy. No biometric template is created,
                  processed, stored, transmitted, or received.
                </ListItem>
                <ListItem className={classes.listText}>
                  I acknowledge I am over 18 years of age, all information I
                  provided is accurate, and I am prohibited from allowing any
                  other person to access or use my verified digital identity
                  account.
                </ListItem>
                <ListItem className={classes.listText}>
                  Station Casinos, and our third-party enrollment and identity
                  proofing service providers CentralAMS and Private ID, may
                  share, use and maintain the images and information you
                  provide, and the information on file with other third-party
                  service providers to further verify your identity, to protect
                  against or prevent actual or potential fraud or unauthorized
                  use of the Service, and to establish, maintain and
                  authenticate your verified digital identity, for the duration
                  of our business relationship.
                </ListItem>
                <ListItem className={classes.listText}>
                  I agree to receive email and SMS messages for the purpose of
                  registering and maintaining an account.
                </ListItem>
                <ListItem className={classes.listText}>
                  I agree to enroll using my face images and my driving license.
                  Each face image is one-way FHE encrypted in compliance with
                  the IEEE 2410-2021 Standard for Biometric Privacy, and
                  completely transformed into anonymized data. Only anonymized
                  data is used to authenticate you, or transmitted to, stored by
                  or used by CentralAMS or Private Identity LLC.
                </ListItem>
                <ListItem className={classes.listText}>
                  I have read and accepted the Stations{" "}
                  <a
                    href="https://www.stationcasinos.com/terms-of-use/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of Use
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://www.stationcasinos.com/privacy-policy/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                  , the CentralAMS{" "}
                  <a
                    href="https://www.centralams.com/terms-of-use/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of Use
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://www.centralams.com/privacy-policy/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                  , and the Private Identity LLC{" "}
                  <a
                    href="https://github.com/openinfer/PrivateIdentity/wiki/Terms-of-Use"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of Use
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://github.com/openinfer/PrivateIdentity/wiki/Privacy-Policy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                  .
                </ListItem>
              </>
            )}
          </List>
        </Card>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Button
        variant="contained"
        color={"inherit"}
        style={styles.continueButton}
        onClick={() => {
          setStep(STEPS.REGISTER_FORM);
          setPrevStep(STEPS.REGISTER_CONSENT);
        }}
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

export default DatabaseConsent;
