import {
  Box,
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
import shield from "../../../assets/shield.png";
import { styles, useStyles } from "../../../pages/signup/styles";

interface props {
  theme: string;
  skin: string;
  palette: { [key: string]: any };
  isUserVerify: boolean;
  handleDelete: () => void;
  setIsUserVerify: (e: boolean) => void;
  sessionData: { successUrl: string };
  user: { uuid?: string };
  navigateToUrl: (e: string) => void;
}

const CreateAccountConsent = (props: props) => {
  const {
    theme,
    skin,
    palette,
    isUserVerify,
    handleDelete,
    setIsUserVerify,
    sessionData,
    user,
    navigateToUrl,
  } = props;
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
          FACE UNLOCK
        </Typography>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Grid style={styles.cardGrid} className={classes.cardGridMobile}>
        {isUserVerify && (
          <Box style={styles.overlayCamera as React.CSSProperties}>
            <img
              src={shield}
              alt="shield"
              style={styles.shield as React.CSSProperties}
            />
          </Box>
        )}
        <Typography
          component="p"
          textAlign="center"
          fontSize={20}
          fontWeight={900}
          mt={3}
          color={"#333"}
        >
          YES, CREATE MY ACCOUNT
        </Typography>
        <Card className={classes.consentCard}>
          <List
            sx={{
              listStyleType: "disc",
              pl: 2,
            }}
          >
            <ListItem className={classes.listText}>
              I acknowledge I am over 18 years of age, all information I
              provided is accurate, and I am prohibited from allowing any person
              under the age of 18 to access or use my account.
            </ListItem>
            <ListItem className={classes.listText}>
              I agree to enroll in Face Unlock using my facial biometrics. Each
              biometric is safely encrypted in compliance with the IEEE
              2410-2021 Standard for Biometric Privacy, completely transformed
              into anonymized data and then deleted. Biometric information is
              never transmitted to, stored by or used by AllpassTrust. Only
              anonymized data is used to authenticate you.
            </ListItem>
            <ListItem className={classes.listText}>
              I have read the AllpassTrust Terms of Service and Privacy Policy.
            </ListItem>
          </List>
        </Card>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Button
        variant="contained"
        color={theme as "inherit"}
        style={styles.continueButton}
        onClick={() => {
          setIsUserVerify(true);
          localStorage.setItem("user", JSON.stringify(sessionData));
          localStorage.setItem("uuid", JSON.stringify(user?.uuid));
          navigateToUrl(sessionData?.successUrl);
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
          Accept and finish
        </Typography>
      </Button>
      <Button
        variant="text"
        color={theme as "inherit"}
        style={styles.textButton}
        onClick={handleDelete}
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
          No, I do not consent
        </Typography>
      </Button>
    </>
  );
};

export default CreateAccountConsent;
