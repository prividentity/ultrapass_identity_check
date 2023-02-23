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
  handleDelete: () => void;
}

const FaceUnlockForFree = (props: props) => {
  const { theme, skin, palette, setStep, handleDelete } = props;
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
          style={{ marginLeft: "-34px" }}
          className={`${classes.cardHeading} cardHeadingNoMargin`}
        >
          <img src={smallLock} alt="smallLock" className={classes.smallLock} />
          FACE UNLOCK
        </Typography>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Grid style={styles.cardGrid} className={classes.cardGridMobile}>
        <Typography
          component="p"
          textAlign={matchesSM ? "center" : "left"}
          fontSize={20}
          fontWeight={900}
          mt={3}
          color={palette?.[skin]?.listText}
        >
          Enhance Your Experience
        </Typography>
        <Typography
          component="p"
          textAlign={matchesSM ? "center" : "left"}
          fontSize={20}
          fontWeight={500}
          mt={0}
          color={"#333"}
        >
          Sign up for Face Unlock for Free
        </Typography>
        <Typography
          component="p"
          textAlign={matchesSM ? "center" : "left"}
          fontSize={16}
          fontWeight={500}
          mt={4}
          color={"#333"}
        >
          Use your face to bypass age verification!
          <br /> No images or personal information leave your device.
          <br /> Certified to IEEE Standard for Biometric Privacy.
        </Typography>
        <Typography
          component="p"
          textAlign={matchesSM ? "center" : "left"}
          fontSize={14}
          fontWeight={500}
          mt={4}
          color={"#333"}
        >
          Learn how Face Unlock works
        </Typography>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Button
        variant="contained"
        color={theme as "inherit"}
        style={styles.continueButton}
        onClick={() => setStep(6)}
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

export default  FaceUnlockForFree;
