/* eslint-disable */
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useRef, useContext } from "react";
import PhoneIcon from "@mui/icons-material/Phone";
import Input from "react-phone-number-input/input";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { useStyles, styles } from "../../pages/signup/styles";
import { theme as Theme } from "../../theme";
import { UserContext } from "../../context/UserContext";
import { createUserID } from "../../utils";
import { createUser } from "@privateid/cryptonets-web-sdk-alpha/dist/apiUtils";
import STEPS from "../../pages/register/steps";

import { componentsParameterInterface } from "../../interface";
import { parsePhoneNumber } from "react-phone-number-input";

import useToast from "../../utils/useToast";

import PhoneInputComponent from "../PhoneInput";
import { updateUserToken } from "../../services/api";
import { Email } from "@mui/icons-material";

const RegisterInputs = ({
  setStep,
  skin,
  matchesSM,
  setToken,
  setPrevStep,
}: {
  setStep: any;
  skin: string;
  matchesSM: boolean;
  setToken: (e: string) => void;
  setPrevStep: (e: string) => void;
}) => {
  const classes = useStyles();
  const mainTheme = Theme;
  const { showToast } = useToast();
  const [loader, setLoader] = useState(false);
  const [autoFocus, setAutoFocus] = useState(true);
  const [country, setCountry] = useState<any>("US");
  const palette: { [key: string]: any } = mainTheme.palette;

  const [phoneInput, setPhoneInput] = useState("+1");

  const ssn4Ref = useRef<HTMLFormElement | null>(null);

  const emailRef = useRef<HTMLFormElement | null>(null);

  const context = useContext(UserContext);

  const { setPhoneNumber, setSSN4, setId, tokenParams } = context;
  const validateEmail = (email: string) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
  const [showSSN4Error, setShowSSN4Error] = useState({
    error: false,
    message: "",
  });
  const handleCheckSSN4Input = () => {
    if (ssn4Ref?.current?.value.length < 4) {
      setShowSSN4Error({ error: true, message: "SSN4 Must be 4 digits." });
    } else {
      setShowSSN4Error({ error: false, message: "" });
    }
  };

  const [showPhoneError, setShowPhoneError] = useState({
    error: false,
    message: "",
  });


  const handleCheckPhoneInput = () => {
    if (phoneInput.length < 10) {
      setShowPhoneError({ error: true, message: "Invalid Phone Number." });
    } else {
      setShowPhoneError({ error: false, message: "" });
    }
  };

  const handleContinue = async () => {
    setPrevStep(STEPS.REGISTER_FORM);
    setAutoFocus(false);
    const validatePhone = (phone: string) =>
      /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/.test(
        phone
      );

    if (!validateEmail(emailRef?.current?.value)) {
      showToast("Enter valid email", "error");
    } else if (!validatePhone(phoneInput)) {
      showToast("Enter mobile number", "error");
    } else if (ssn4Ref?.current?.value.length !== 4) {
      showToast("Enter SSN4", "error");
    } else if (ssn4Ref?.current?.value.length === 4) {
      setLoader(true);
      const inputSSN4 = ssn4Ref?.current?.value;
      // setPhoneNumber(phoneInput);
      setSSN4(inputSSN4);
      const newID = await createUserID();
      setId(newID);

      const result: any = await createUser({
        id: newID,
        userConsent: true,
        userConsentDate: Date.now().toString(),
        ssn4: inputSSN4,
        email: emailRef?.current?.value || "",
        phone: phoneInput,
      });

      const updateToken = await updateUserToken(
        { customerId: newID },
        tokenParams
      );
      if (result.user) {
        setToken(result?.user?.customerId);
        setStep(STEPS.PRE_ENROLL);
      }
      setLoader(false);
    }
  };

  const handlePhoneChange = (e: any) => {
    if (!autoFocus) setAutoFocus(true);
    setCountry(parsePhoneNumber(e?.toString() || "")?.country);
    setPhoneInput(e);
  };

  const [showEmailError, setShowEmailError] = useState({
    error: false,
    message: "",
  });

  const handleCheckEmailOnBlur = (e: any) => {
    const emailInput = e.target.value;
   
    if (validateEmail(emailInput)) {
      setShowEmailError({ error: false, message: "" });
    } else {
      setShowEmailError({
        error: true,
        message: "Please enter a valid Email.",
      });
    }
  };

  enum FocusHandlerEnum {
    email="email",
    ssn4="ssn4",
    phone="phone",
  }

  const handleOnFocus = (handle:FocusHandlerEnum) => {
    setAutoFocus(false);
    switch(handle){
      case FocusHandlerEnum.email:
        setShowEmailError({ error: false, message: "" });
        return;
      case FocusHandlerEnum.ssn4:
        setShowSSN4Error({ error: false, message: "" });
        return;
      case FocusHandlerEnum.phone:
        setShowPhoneError({ error: false, message: "" });
        return
      default:
        return;
    }
  }

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
          VERIFIED IDENTITY
        </Typography>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Grid style={styles.cardGrid} className={classes.cardGridMobile}>
        <Typography
          component="p"
          textAlign={"center"}
          fontSize={16}
          fontWeight={700}
          lineHeight={1.5}
          mt={3}
          mb={5}
          className={classes.cardInnerHeading}
        >
          PLEASE ENTER THE REQUIRED INFORMATION
        </Typography>

        <Box width={"100%"}>
        <Grid container>
            <Input
              style={{ width: "100%" }}
              value={phoneInput}
              autoFocus={autoFocus}
              // country={country || "US"}
              onChange={handlePhoneChange}
              // onBlur={handleCheckPhoneInput}
              helperText={showPhoneError.error ? showPhoneError.message : ""}
              sx={{
                "& .MuiFormHelperText-contained": {
                  color: "red",
                },
              }}
              placeholder="Mobile number"
              inputComponent={React.forwardRef((props, ref) => (
                <PhoneInputComponent
                  {...props}
                  inputRef={ref}
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ pr: 1 }} />,
                  }}
                  inputProps={{
                    maxLength: phoneInput?.startsWith("+1") ? 15 : 11,
                  }}
                />
              ))}
            />
          </Grid>


          <TextField
            fullWidth
            id="outlined-basic"
            label="EMAIL"
            type="email"
            placeholder="Email"
            name="Email"
            InputProps={{
              startAdornment: <Email sx={{ pr: 1 }} />,
            }}
            inputRef={emailRef}
            onBlur={handleCheckEmailOnBlur}
            onFocus={()=>{handleOnFocus(FocusHandlerEnum.email)}}
            color={showEmailError.error ? "error" : "primary"}
            helperText={showEmailError.error ? showEmailError.message : ""}
            sx={{
              "& .MuiFormHelperText-contained": {
                color: "red",
              },
              mb:2,
              mt:2,
            }}
          />

          <TextField
            fullWidth
            id="outlined-basic"
            label="SSN4"
            type="tel"
            placeholder="SSN4 – Social Security Number"
            name="SSN4"
            InputProps={{
              startAdornment: <AccountBoxIcon sx={{ pr: 1 }} />,
            }}
            inputProps={{
              maxLength: 4,
            }}
            inputRef={ssn4Ref}
            onBlur={handleCheckSSN4Input}
            onFocus={()=>{handleOnFocus(FocusHandlerEnum.ssn4)}}
            color={showSSN4Error.error ? "error" : "primary"}
            helperText={showSSN4Error.error ? showSSN4Error.message : ""}
            sx={{
              "& .MuiFormHelperText-contained": {
                color: "red",
              },
            }}
          />
        </Box>
      </Grid>

      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Box mb={"52px"}>
        <Button
          variant="contained"
          color={"inherit"}
          style={styles.continueButton}
          onClick={handleContinue}
          type="submit"
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
            {loader ? (
              <CircularProgress className={classes.scanLoader} />
            ) : (
              "Continue"
            )}
          </Typography>
        </Button>
      </Box>
    </>
  );
};

export default RegisterInputs;

