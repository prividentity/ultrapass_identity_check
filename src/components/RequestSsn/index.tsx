/* eslint-disable */
import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useRef, useContext } from "react";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { useStyles, styles } from "../../pages/signup/styles";
import { theme as Theme } from "../../theme";
import { UserContext } from "../../context/UserContext";
import { updateUser } from "@privateid/cryptonets-web-sdk/dist/apiUtils";
import STEPS from "../../pages/register/steps";
import useToast from "../../utils/useToast";
import { formatPhoneInput } from "../../utils";

const RequestSsn = ({
  setStep,
  skin,
  matchesSM,
  onSuccess,
  setPrevStep
}: {
  setStep: any;
  setPrevStep?: (e: string) => void;
  skin: string;
  matchesSM: boolean;
  onSuccess: () => void;
}) => {
  const classes = useStyles();
  const mainTheme = Theme;
  const { showToast } = useToast();
  const [ssn, setSnn] = useState("");
  const palette: { [key: string]: any } = mainTheme.palette;

  const ssn9Ref = useRef<HTMLFormElement | null>(null);

  const context = useContext(UserContext);
  const { id } = context;
  const [showSSN9Error, setShowSSN9Error] = useState({
    error: false,
    message: "",
  });
  const handleCheckSSN4Input = () => {
    if (ssn9Ref?.current?.value.length < 9) {
      setShowSSN9Error({ error: true, message: "SSN9 Must be 9 digits." });
    }
  };
  // console.log(ssn9Ref?.current?.value,'ssn9Ref?.current?.value');
  
  const handleContinue = async () => {
    if (ssn9Ref?.current?.value.length !== 11) {
      showToast("Enter SSN9", "error");
    } else if (ssn9Ref?.current?.value.length === 11) {
      const inputSSN9 = ssn9Ref?.current?.value.replace(/-/g,"");
      const updateUserResult: any = await updateUser({
        id,
        attributes: { ssn9: inputSSN9 } as any,
      });

      if (updateUserResult?.level === "error") {
        showToast(updateUserResult?.message, "error");
      } else {
        onSuccess();
      }
    }
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
          sx={{ paddingTop: 4, paddingBottom: 2 }}
          className={classes.cardHeading}
        >
          PLEASE ENTER SSN9
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
        <Box width={"100%"}>
          <Typography
            component="p"
            textAlign={matchesSM ? "center" : "left"}
            fontSize={16}
            fontWeight={500}
            lineHeight={1.5}
            mt={0}
            className={classes.cardInnerHeading}
            mb={3}
          >
            We were unable to find your record. <br />
            Please try again with your full social security number.
          </Typography>
          <TextField
            fullWidth
            id="outlined-basic"
            label="SSN9"
            type="tel"
            placeholder="SSN9"
            name="SSN9"
            InputProps={{
              startAdornment: <AccountBoxIcon sx={{ pr: 1 }} />,
            }}
            inputProps={{
              // maxLength: 9,
            }}
            onChange={(e) => setSnn(e?.target?.value)}
            value={formatPhoneInput(ssn)}
            inputRef={ssn9Ref}
            onBlur={handleCheckSSN4Input}
          />
        </Box>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Box>
        <Button
          variant="contained"
          color={"inherit"}
          style={styles.continueButton}
          onClick={handleContinue}
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
            setPrevStep?.(STEPS.REQUEST_SSN);
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
      </Box>
    </>
  );
};

export default RequestSsn;
