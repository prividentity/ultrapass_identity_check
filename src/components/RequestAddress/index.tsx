/* eslint-disable */
import {
  Autocomplete,
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
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { useStyles, styles } from "../../pages/signup/styles";
import { theme as Theme } from "../../theme";
import { UserContext } from "../../context/UserContext";
import { updateUser } from "@privateid/cryptonets-web-sdk/dist/apiUtils";
import STEPS from "../../pages/register/steps";
import useToast from "../../utils/useToast";
import { states } from "../../utils";

const RequestAddress = ({
  setStep,
  skin,
  matchesSM,
  onSuccess,
  setPrevStep
}: {
  setStep: any;
  skin: string;
  matchesSM: boolean;
  onSuccess: () => void;
  setPrevStep: (e: string) => void;
}) => {
  const classes = useStyles();
  const mainTheme = Theme;
  const { showToast } = useToast();
  const [addressData, setAddressData] = useState<any>();
  const [state, setState] = useState<any>();
  const palette: { [key: string]: any } = mainTheme.palette;

  const context = useContext(UserContext);
  const { id } = context;

  const handleContinue = async () => {
    const address = {
      addressLine1: addressData?.addressLine1,
      addressLine2: addressData?.addressLine2,
      city: addressData?.city,
      state,
      zipCode: addressData?.zipCode,
      country: "USA",
    };

    const updateUserResult: any = await updateUser({
      id,
      attributes: { govId: {address} } as any,
    });
    if (updateUserResult?.level === "error") {
      showToast(updateUserResult?.message, "error");
    } else {
      onSuccess();
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
          PLEASE ENTER ADDRESS
        </Typography>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Grid style={styles.cardGrid} className={classes.cardGridMobile}>
        <Typography
          component="p"
          textAlign={matchesSM ? "center" : "left"}
          fontSize={16}
          fontWeight={500}
          lineHeight={1.5}
          mt={1}
          className={classes.cardInnerHeading}
          mb={0}
        >
          We are only able to process residential addresses.
          <br />
          Please try again with your home address.
        </Typography>
        <Box width={"100%"}>
          <TextField
            fullWidth
            id="outlined-basic"
            placeholder="Address Line 1"
            name="addressLine1"
            onChange={onChange}
            className={classes.inputStyle}
          />
          <TextField
            fullWidth
            id="outlined-basic"
            placeholder="Address Line 2"
            name="addressLine2"
            onChange={onChange}
            className={classes.inputStyle}
          />
          <TextField
            fullWidth
            id="outlined-basic"
            placeholder="City"
            name="city"
            onChange={onChange}
            className={classes.inputStyle}
          />
          <FormControl fullWidth style={{ marginTop: 10, marginBottom: 10 }}>
            <Autocomplete
              id="combo-box-demo"
              options={states}
              fullWidth
              renderInput={(params) => <TextField {...params} label="State or province" />}
              onChange={(i, e) => setState(e?.abbreviation)}
            />
          </FormControl>
          <TextField
            fullWidth
            id="outlined-basic"
            placeholder="Zip Code"
            name="zipCode"
            inputProps={{
              maxLength: 5,
            }}
            onChange={onChange}
            className={classes.inputStyle}
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
            setPrevStep?.(STEPS.ADDITIONAL_REQUIREMENTS);
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

export default RequestAddress;
