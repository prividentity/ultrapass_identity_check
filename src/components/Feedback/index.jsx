import {
  Button,
  Divider,
  Grid,
  TextareaAutosize,
  Typography,
} from "@mui/material";

import { useStyles, styles } from "../../pages/register/styles";
import { theme as Theme } from "../../theme";

import smallLock from "../../assets/smallLock.png";
import STEPS from "../../pages/register/steps";
import FeedbackImage from '../../assets/feedback.png'

const Feedback = ({
  setStep,
  setPrevStep,
  skin,
  matchesSM,
}: {
  setStep: any,
  setPrevStep: any,
  skin: string,
  matchesSM: boolean,
}) => {
  const classes = useStyles();
  const mainTheme = Theme;
  const palette: { [key: string]: any } = mainTheme.palette;
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
          textAlign={"center"}
          fontSize={18}
          fontWeight={700}
          lineHeight={1.5}
          mt={2}
          className={classes.cardInnerHeading}
        >
          How do you rate your user registration experience?
        </Typography>
        <img
          src={FeedbackImage}
          alt=""
          className={classes.feedBackImage}
        />
        <Typography
          component="p"
          textAlign={"center"}
          fontSize={18}
          fontWeight={700}
          lineHeight={1.5}
          mt={1}
          mb={1}
          className={classes.cardInnerHeading}
        >
          Tell us how we can improve?
        </Typography>
        <TextareaAutosize minRows={5} className={classes.textArea} />
      </Grid>
      <Grid>
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
            Send and continue
          </Typography>
        </Button>
        <Button
          variant="text"
          color={"inherit"}
          style={styles.textButton}
          onClick={() => {
            setStep(STEPS.CONSENT_FAIL);
            setPrevStep(STEPS.START);
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
            Cancel
          </Typography>
        </Button>
      </Grid>
    </>
  );
};

export default Feedback;
