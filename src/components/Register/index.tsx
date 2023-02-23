/* eslint-disable */
import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useRef, useContext } from "react";
// import "react-phone-input-2/lib/material.css";
import PhoneIcon from "@mui/icons-material/Phone";
import PhoneInput from "react-phone-number-input";
import Input from "react-phone-number-input/input";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { useStyles, styles } from "../../pages/signup/styles";
import { theme as Theme } from "../../theme";
import { UserContext } from "../../context/UserContext";
import { createUserID } from "../../utils";
import { createUser } from "@privateid/cryptonets-web-sdk-alpha/dist/apiUtils";
import STEPS from "../../pages/register/steps";
import PhoneInputComponent from "../PhoneInput";

const RegisterInputs = ({
  setStep,
  setPrevStep,
  skin,
  matchesSM,
}: {
  setStep: any;
  setPrevStep: any;
  skin: string;
  matchesSM: boolean;
}) => {
  const classes = useStyles();
  const mainTheme = Theme;
  const palette: { [key: string]: any } = mainTheme.palette;

  const [phoneInput, setPhoneInput] = useState("");

  const ssn4Ref = useRef<HTMLFormElement | null>(null);

  const context = useContext(UserContext);

  const { setPhoneNumber, setSSN4, setId } = context;

  const handleMobileInputChange = (inputNumber: any) => {
    setPhoneInput(inputNumber);
  };

  const [showSSN4Error, setShowSSN4Error] = useState({
    error: false,
    message: "",
  });
  const handleCheckSSN4Input = () => {
    if (ssn4Ref?.current?.value.length < 4) {
      setShowSSN4Error({ error: true, message: "SSN4 Must be 4 digits." });
    }
  };

  const [showPhoneError, setShowPhoneError] = useState({
    error: false,
    message: "",
  });
  const handleCheckPhoneInput = () => {
    if (phoneInput.length < 10) {
      setShowSSN4Error({ error: true, message: "SSN4 Must be 4 digits." });
    }
  };

  const handleContinue = async () => {
    const validatePhone = (phone: string) =>
      /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/.test(
        phone
      );
    console.log(
      validatePhone(phoneInput) && ssn4Ref?.current?.value.length === 4
    );
    if (validatePhone(phoneInput) && ssn4Ref?.current?.value.length === 4) {
      const inputSSN4 = ssn4Ref?.current?.value;
      setPhoneNumber(phoneInput);
      setSSN4(inputSSN4);
      const newID = await createUserID();
      setId(newID);

      const result: any = await createUser({
        id: newID,
        userConsent: true,
        userConsentDate: Date.now().toString(),
        phone: phoneInput,
        ssn4: inputSSN4,
      });
      if (result.user) {
        setStep(STEPS.PRE_ENROLL);
      }
    }
  };

  const handlePhoneChange = (e: any) => {
    setPhoneInput(e);
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
          PLEASE ENTER REQUIRED INFORMATION
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
          <Grid container pb={2}>
            <Input
              style={{ width: "100%" }}
              value={phoneInput}
              autoFocus
              country="US"
              onChange={handlePhoneChange}
              inputComponent={React.forwardRef((props, ref) => (
                <PhoneInputComponent
                  {...props}
                  inputRef={ref}
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ pr: 1 }} />,
                  }}
                />
              ))}
            />
          </Grid>

          {/* <TextField
            fullWidth
            id="outlined-basic"
            label="Mobile Number"
            type="tel"
            placeholder="Mobile Number"
            name="Mobile Number"
            InputProps={{
              startAdornment: <PhoneIcon sx={{ pr: 1 }} />,
            }}
            inputProps={{
              maxLength: 12,
            }}
            value={phoneInput}
            onChange={handlePhoneChange}
            sx={{
              pb: 2,
            }}
          /> */}

          <TextField
            fullWidth
            id="outlined-basic"
            label="SSN4"
            type="tel"
            placeholder="SSN4"
            name="SSN4"
            InputProps={{
              startAdornment: <AccountBoxIcon sx={{ pr: 1 }} />,
            }}
            inputProps={{
              maxLength: 4,
            }}
            inputRef={ssn4Ref}
            onBlur={handleCheckSSN4Input}
          />
        </Box>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}

      <Button
        variant="contained"
        color={"inherit"}
        style={styles.continueButton}
        onClick={handleContinue}
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
          Continue
        </Typography>
      </Button>
    </>
  );
};

export default RegisterInputs;
