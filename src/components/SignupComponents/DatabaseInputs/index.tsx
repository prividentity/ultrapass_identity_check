import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  TextField as MuiTextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import smallLock from "../../../assets/smallLock.png";
import shield from "../../../assets/shield.png";
import { styles, useStyles } from "../../../pages/signup/styles";
import MonthPicker from "../../DatePicker";
import { payload } from "../../../interface";

interface props {
  theme: string;
  skin: string;
  palette: { [key: string]: any };
  isUserVerify: boolean;
  onChange: (e: { target: { name: string; value: string } }) => void;
  setEnrollData: (e: any) => void;
  enrollData?: payload;
  onContinue: (e: boolean) => void;
  loading: boolean;
}

// this text field will be smaller on mobile
const TextField = styled(MuiTextField)(({ theme }) => ({
  "& .MuiOutlinedInput-input": {
    [theme.breakpoints.down("sm")]: {
      height: "1.2rem",
    },
  },
}));

const DatabaseInputs = (props: props) => {
  const {
    theme,
    skin,
    palette,
    isUserVerify,
    onChange,
    setEnrollData,
    enrollData,
    onContinue,
    loading,
  } = props;
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
          className={classes.cardHeading}
        >
          <img src={smallLock} alt="smallLock" className={classes.smallLock} />
          ANONYMOUS AGE VERIFICATION
        </Typography>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Grid style={styles.cardGrid} className={classes.cardGridForm}>
        <Box style={{ position: "relative" }}>
          <Typography
            component="p"
            textAlign="center"
            fontSize={16}
            fontWeight={500}
            letterSpacing={"0.5px"}
            sx={{ paddingTop: 1, paddingBottom: 0 }}
          >
            Use the Age Check Database to Verify Your Age
          </Typography>
          {isUserVerify && (
            <Box style={styles.overlay as React.CSSProperties}>
              <img
                src={shield}
                alt="shield"
                style={styles.shield as React.CSSProperties}
              />
            </Box>
          )}
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <TextField
                fullWidth
                type="text"
                placeholder="First name"
                name="firstName"
                onChange={onChange}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                type="text"
                placeholder="Last name"
                name="lastName"
                onChange={onChange}
              />
            </Grid>
            <Grid item container>
              <Box className="datePickerWrap" width="100%">
                <MonthPicker
                  value={enrollData?.dob}
                  setEnrollData={(newValue: any) => {
                    setEnrollData({
                      ...enrollData,
                      dob: newValue,
                    });
                  }}
                />
              </Box>
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                type="number"
                placeholder="SSN"
                name="ssn"
                onChange={onChange}
                value={enrollData?.ssn}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                type="number"
                placeholder="Zipcode"
                name="zip"
                onChange={onChange}
                value={enrollData?.zip}
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Button
        variant="contained"
        color={theme as "inherit"}
        style={styles.continueButton}
        onClick={() => onContinue(true)}
        disabled={loading}
        className={classes.checkFlowContinueButton}
      >
        {loading ? (
          <CircularProgress className={classes.homeLoader} />
        ) : (
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
            Verify and continue
          </Typography>
        )}
      </Button>
      {/* <Button
              variant="text"
              color={theme as "inherit"}
              style={styles.textButton}
              onClick={() => {
                setStep(12);
                setPrevStep(11);
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
                fontSize={13}
              >
                No, don’t verify
              </Typography>
            </Button> */}
    </>
  );
};

export default DatabaseInputs;
