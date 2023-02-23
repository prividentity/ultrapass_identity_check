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
import {
  updateUser,
} from "@privateid/cryptonets-web-sdk-alpha/dist/apiUtils";
import STEPS from "../../pages/register/steps";
import useToast from "../../utils/useToast";

const RequestSsn = ({
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
  const palette: { [key: string]: any } = mainTheme.palette;

  const ssn4Ref = useRef<HTMLFormElement | null>(null);

  const context = useContext(UserContext);
  const { id } = context;
  const [showSSN4Error, setShowSSN4Error] = useState({
    error: false,
    message: "",
  });
  const handleCheckSSN4Input = () => {
    if (ssn4Ref?.current?.value.length < 4) {
      setShowSSN4Error({ error: true, message: "SSN4 Must be 4 digits." });
    }
  };

  const handleContinue = async () => {
    if (ssn4Ref?.current?.value.length !== 4) {
      showToast("Enter SSN4", "error");
    } else if (ssn4Ref?.current?.value.length === 4) {
      const inputSSN4 = ssn4Ref?.current?.value;
      const updateUserResult: any = await updateUser({
        id,
        attributes: { ssn4: inputSSN4 },
      });
      if (updateUserResult?.level === "error") {
        showToast(updateUserResult?.message, "error");
      } else {
        setTimeout(() => {
            setStep(STEPS.SUCCESS);
          }, 2000);
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
          PLEASE ENTER SSN4
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

export default RequestSsn;
