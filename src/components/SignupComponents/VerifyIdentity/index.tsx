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

interface props {
  theme: string;
  skin: string;
  palette: { [key: string]: any };
  setStep: (e: number) => void;
  setPrevStep: (e: number) => void;
  name: string;
}

const VerifyIdentity = (props: props) => {
  const { theme, skin, palette, setStep, setPrevStep, name } = props;
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
          ANONYMOUS AGE VERIFICATION
        </Typography>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Grid style={styles.cardGrid} className={classes.cardGridMobile}>
        <Typography
          component="p"
          textAlign={matchesSM ? "center" : "left"}
          fontSize={17}
          fontWeight={700}
          lineHeight={1.5}
          mt={2}
          className={classes.cardInnerHeading}
        >
          {name} partners with AllpassTrust for
          <br /> secure, anonymous age verification.
        </Typography>
        <Typography
          component="p"
          textAlign={matchesSM ? "center" : "left"}
          fontSize={17}
          fontWeight={500}
          mt={2}
          className={classes.cardInnerHeading}
        >
          Get ready to take a selfie.
          <br /> No images will leave your device.
        </Typography>
        <Typography
          component="p"
          textAlign={matchesSM ? "center" : "left"}
          fontSize={14}
          fontWeight={700}
          mt={3}
          color={"#333"}
          className={classes.cardInnerText}
        >
          How AllpassTrust will verify your identity ?
        </Typography>
        <Typography
          component="p"
          textAlign={matchesSM ? "center" : "left"}
          fontSize={13}
          fontWeight={500}
          mt={2}
          className={classes.cardInnerText}
        >
          AllpassTrust will use your selfie to estimate your age. Your image
          will be deleted immediately after processing. No images or information
          will be shared with {name}. Data will be strictly processed according
          to the AllpassTrust Privacy Policy. Learn how AllpassTrust works.
        </Typography>
      </Grid>
      <Grid>
        {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
        <Button
          variant="contained"
          color={theme as "inherit"}
          style={styles.continueButton}
          onClick={() => setStep(3)}
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
            Agree and continue
          </Typography>
        </Button>
        <Button
          variant="text"
          color={theme as "inherit"}
          style={styles.textButton}
          onClick={() => {
            setStep(12);
            setPrevStep(1);
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
      </Grid>
    </>
  );
};

export default VerifyIdentity;
