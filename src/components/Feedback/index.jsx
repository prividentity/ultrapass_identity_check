import {
  Box,
  Button,
  Divider,
  Grid,
  ListItem,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import { useStyles, styles } from "../../pages/register/styles";
import { theme as Theme } from "../../theme";

import smallLock from "../../assets/smallLock.png";
import STEPS from "../../pages/register/steps";
import { useState } from "react";
// import FeedbackImage from "../../assets/feedback.png";
import DelightIcon from "../../assets/delight.svg";
import FrustrationIcon from "../../assets/frustration.svg";
import { feedback } from "../../services/api";
import useToast from "../../utils/useToast";
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [textArea, setTextArea] = useState('');
  const [emoji, setEmoji] = useState('');
  const [loader, setLoader] = useState(false);
  const emojiColor = (currentEmoji, isImage) => {
    if (isImage) {
      return emoji === currentEmoji
        ? "invert(55%) sepia(63%) saturate(462%) hue-rotate(83deg) brightness(100%) contrast(90%)"
        : null;
    } else {
      return emoji === currentEmoji
        ? palette?.[skin]?.main
        : palette?.[skin]?.feedBack;
    }
  };
  const onSubmit = async () => {
    setLoader(true);
    const payload = {
      type: "email",
      email: "mailto:shiven@private.id",
      endpoint: "feedback",
      subject: "Private ID",
      message: `${emoji} - ${textArea}`,
    };
    const result = await feedback(payload);
    if (result?.success) {
      showToast("Feedback submitted successfully", "success");
      navigate("/");
    }
    setLoader(false);
  };
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
        <Box className={classes.feedbackIconsWrap}>
          <ListItem
            className={classes.feedBackIcon}
            onClick={() => setEmoji("Delight")}
          >
            <img
              src={DelightIcon}
              alt=""
              className={classes.feedBackIconImage}
              style={{
                filter: emojiColor("Delight", true),
              }}
            />
            <Typography component="p" color={emojiColor("Delight")}>
              Delight
            </Typography>
          </ListItem>
          <ListItem
            className={classes.feedBackIcon}
            onClick={() => setEmoji("Happy")}
          >
            <InsertEmoticonIcon style={{ color: emojiColor("Happy") }} />
            <Typography component="p" color={emojiColor("Happy")}>
              Happy
            </Typography>
          </ListItem>
          <ListItem
            className={classes.feedBackIcon}
            onClick={() => setEmoji("Sad")}
          >
            <SentimentVeryDissatisfiedIcon
              style={{ color: emojiColor("Sad") }}
            />
            <Typography component="p" color={emojiColor("Sad")}>
              Sad
            </Typography>
          </ListItem>
          <ListItem
            className={classes.feedBackIcon}
            onClick={() => setEmoji("Frustration")}
          >
            <img
              src={FrustrationIcon}
              alt=""
              className={classes.feedBackIconImage}
              style={{
                filter: emojiColor("Frustration", true),
              }}
            />
            <Typography component="p" color={emojiColor("Frustration")}>
              Frustration
            </Typography>
          </ListItem>
        </Box>
        {/* <img src={FeedbackImage} alt="" className={classes.feedBackImage} /> */}
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
        <TextareaAutosize
          minRows={5}
          className={classes.textArea}
          onChange={(e) => setTextArea(e?.target?.value)}
        />
      </Grid>
      <Grid>
        {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
        <Button
          variant="contained"
          color={"inherit"}
          style={styles.continueButton}
          onClick={() => onSubmit()}
          disabled={loader}
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
            setStep(STEPS.START);
            setPrevStep(STEPS.FEEDBACK);
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
