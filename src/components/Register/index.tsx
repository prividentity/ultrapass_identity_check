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

const RegisterInputs = ({
  setStep,
  skin,
  matchesSM,
  setToken,
}: {
  setStep: any;
  skin: string;
  matchesSM: boolean;
  setToken: (e: string) => void;
}) => {
  const classes = useStyles();
  const mainTheme = Theme;
  const { showToast } = useToast();
  const [loader, setLoader] = useState(false);
  const [autoFocus, setAutoFocus] = useState(true);
  const [country, setCountry] = useState<any>("US")
  const palette: { [key: string]: any } = mainTheme.palette;

  const [phoneInput, setPhoneInput] = useState("+1");

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
    setAutoFocus(false);
    const validatePhone = (phone: string) =>
      /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/.test(
        phone
      );
    console.log(
      validatePhone(phoneInput) && ssn4Ref?.current?.value.length === 4
    );

    if (!validatePhone(phoneInput)) {
      showToast("Enter mobile number", "error");
    } else if (ssn4Ref?.current?.value.length !== 4) {
      showToast("Enter SSN4", "error");
    } else if (
      validatePhone(phoneInput) &&
      ssn4Ref?.current?.value.length === 4
    ) {
      setLoader(true);
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
        setToken(result?.user?.customerId);
        setStep(STEPS.PRE_ENROLL);
      }
      setLoader(false);
    }
  };

  const handlePhoneChange = (e: any) => {
    setAutoFocus(true);
    setCountry(parsePhoneNumber(e?.toString() || "")?.country)
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
          VERIFIED IDENTITY
        </Typography>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Grid
        style={styles.cardGrid}
        className={classes.cardGridMobile}
      >
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
            PLEASE ENTER YOUR PERSONAL DETAILS
          </Typography>
        <Box width={"100%"}>

          <Grid container pb={2}>
            <Input
              style={{ width: "100%" }}
              value={phoneInput}
              autoFocus={autoFocus}
              // country={country || "US"}
              onChange={handlePhoneChange}
              // onBlur={handleCheckPhoneInput}
              helperText={showPhoneError.error? showPhoneError.message :""}
              sx={{
                "& .MuiFormHelperText-contained": {
                  color:"red"
                }
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

// const PhoneInputComponent = (props: any, ref: React.Ref<HTMLInputElement>) => {
//   return (
//     <TextField
//       id="outlined-basic"
//       label="Phone"
//       inputRef={ref}
//       variant="outlined"
//       fullWidth
//       InputProps={{
//         startAdornment: <PhoneIcon sx={{pr:1}}/>,
//       }}
//       {...props}
//     />
//   );
// };
