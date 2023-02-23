/* eslint-disable */
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useRef, useContext } from "react";
import "react-phone-input-2/lib/material.css";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { useStyles, styles } from "../../pages/signup/styles";
import { theme as Theme } from "../../theme";
import { UserContext } from "../../context/UserContext";
import { updateUser } from "@privateid/cryptonets-web-sdk-alpha/dist/apiUtils";
import STEPS from "../../pages/register/steps";
import useToast from "../../utils/useToast";
import { states } from "../../utils";

const RequestAddress = ({
  setStep,
  skin,
  matchesSM,
  onVerifyId,
}: {
  setStep: any;
  skin: string;
  matchesSM: boolean;
  onVerifyId: () => void;
}) => {
  const classes = useStyles();
  const mainTheme = Theme;
  const { showToast } = useToast();
  const [addressData, setAddressData] = useState<any>();
  const [state, setState] = useState<any>();
  const [country, setCountry] = useState<any>();
  const palette: { [key: string]: any } = mainTheme.palette;

  const ssn4Ref = useRef<HTMLFormElement | null>(null);

  const context = useContext(UserContext);
  const { id } = context;
  const [showSSN4Error, setShowSSN4Error] = useState({
    error: false,
    message: "",
  });

  const handleContinue = async () => {
    const address = {
      addressLine1: addressData?.addressLine1,
      addressLine2: addressData?.addressLine2,
      city: addressData?.city,
      state: state,
      zipCode: addressData?.zipCode,
      country: country,
    };
    const updateUserResult: any = await updateUser({
      id,
      attributes: address as any,
    });
    if (updateUserResult?.level === "error") {
      showToast(updateUserResult?.message, "error");
    } else {
      setTimeout(() => {
        onVerifyId();
      }, 2000);
    }
  };

  const onChange = (e: { target: { name: string; value: string } }) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    setAddressData({
      ...addressData,
      [name]: value,
    });
  };

  console.log(addressData, "setAddressData", state);

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
      <Grid style={styles.cardGrid} className={classes.cardGridMobile}>
        <Box width={"100%"}>
          <TextField
            fullWidth
            id="outlined-basic"
            placeholder="Address Line 1"
            name="addressLine1"
            inputProps={{
              maxLength: 4,
            }}
            inputRef={ssn4Ref}
            onChange={onChange}
            className={classes.inputStyle}
          />
          <TextField
            fullWidth
            id="outlined-basic"
            placeholder="Address Line 2"
            name="addressLine2"
            inputProps={{
              maxLength: 4,
            }}
            inputRef={ssn4Ref}
            onChange={onChange}
            className={classes.inputStyle}
          />
          <TextField
            fullWidth
            id="outlined-basic"
            placeholder="City"
            name="city"
            inputProps={{
              maxLength: 4,
            }}
            inputRef={ssn4Ref}
            onChange={onChange}
            className={classes.inputStyle}
          />
          <FormControl fullWidth style={{ marginTop: 10, marginBottom: 10 }}>
            <InputLabel id="demo-simple-select-label">State</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={state}
              label="State"
              onChange={(e) => setState(e?.target?.value)}
            >
              {states?.map((state: any) => (
                <MenuItem value={state?.abbreviation}>{state?.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            id="outlined-basic"
            placeholder="ZipCode"
            name="zipCode"
            inputProps={{
              maxLength: 4,
            }}
            inputRef={ssn4Ref}
            onChange={onChange}
            className={classes.inputStyle}
          />
          <FormControl fullWidth style={{ marginTop: 10, marginBottom: 10 }}>
            <InputLabel id="demo-simple-select-label">Country</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={country}
              label="Country"
              onChange={(e) => setCountry(e?.target?.value)}
            >
              <MenuItem value={"USA"}>USA</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Box mb={"52px"}>
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
      </Box>
    </>
  );
};

export default RequestAddress;
