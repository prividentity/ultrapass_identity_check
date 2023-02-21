import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  Typography,
  useTheme,
  useMediaQuery,
  TextField as MuiTextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router";
import smallLock from "../../assets/smallLock.png";
import phoneImage from "../../assets/face-id.png";
import shield from "../../assets/shield.png";
import { styles, useStyles } from "./styles";
import PredictAge from "../../components/PredictAge";
import { theme as Theme, nameMap } from "../../theme";
import {
  calculateAgeFromDate,
  FAILURE,
  getDateFromString,
  REQUIRES_INPUT,
  stopCamera,
  SUCCESS,
} from "../../utils";
import useEnrollOneFa from "../../hooks/useEnrollOneFa";
import { useWasm } from "../../hooks";
import ScanFrontDocument from "../../components/DocumentCamera/ScanFrontDocument";
import ScanBackDocument from "../../components/DocumentCamera/ScanBackDocument";
import { payload } from "../../interface";
import {
  createUser,
  deleteUserApi,
  getUser,
  updateUserApi,
  verifyAge,
  verifyTokenApi,
} from "../../services/api";
import womenImg from "../../assets/Kimiko-S3.png";
import DlFront from "../../assets/dl-front.png";
import DlBack from "../../assets/Hand-DL-Back.png";
import HomeModal from "../../components/Modal/homeModal";
import useDelete from "../../hooks/useDelete";
import { useSearchParams } from "react-router-dom";
import useToast from "../../utils/useToast";
import { CircularProgress } from "@mui/material";
import MonthPicker from "../../components/DatePicker";
import Header from "../../components/Header";
import { headerVisible } from "../../theme";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import FullWidthTabs from "../../components/OptionsTab";
import dayjs from "dayjs";
import useCameraPermissions from "../../hooks/useCameraPermissions";

interface props {
  theme: string;
  skin: string;
}

// this text field will be smaller on mobile
const TextField = styled(MuiTextField)(({ theme }) => ({
  "& .MuiOutlinedInput-input": {
    [theme.breakpoints.down("sm")]: {
      height: "1.2rem",
    },
  },
}));

const Signup = ({ theme, skin }: props) => {
  useWasm();
  const localUser = JSON.parse(localStorage.getItem("user") || "{}");
  const muiTheme = useTheme();
  const [searchParams] = useSearchParams();
  const skinQueryParam = searchParams.get("skin") as string;
  const name = nameMap[skinQueryParam || "up"] || skinQueryParam;

  const matchesSM = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const { showToast } = useToast();
  const token = searchParams.get("token"); // "testCode"
  const overideAge = searchParams.get("age");
  const ageCreditCheck = searchParams.get("ageCreditCheck");
  const paramStep = searchParams.get("step");
  const { isCameraGranted } = useCameraPermissions();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [prevStep, setPrevStep] = useState(0);

  const [isScanning, setIsScanning] = useState(true);
  const [isUserVerify, setIsUserVerify] = useState(false);
  const [isBackScan, setIsBackScan] = useState(false);
  const [enrollData, setEnrollData] = useState<payload>();
  const [enrolling, setEnrolling] = useState(true);
  const [user, setUser] = useState({} as { uuid?: string; guid?: string });
  const [sessionData, setSessionData] = useState<any>({});

  const classes = useStyles();
  const mainTheme = Theme;
  const palette: { [key: string]: any } = mainTheme.palette;
  const verifyToken = async () => {
    const result: any = await verifyTokenApi(token);
    setSessionData(result);
    if (result?.status === SUCCESS) {
      const userDetails: any = await getUser({ token });
      if (userDetails?.token) {
        localStorage.setItem("user", JSON.stringify(result));
      }
      navigate("/");
    } else if (result?.status === FAILURE) {
      showToast("Invalid Token", "error");
      navigate("/");
    } else if (result?.status === REQUIRES_INPUT && isCameraGranted) {
      setStep(7);
    } else if (result?.status === REQUIRES_INPUT && !isCameraGranted) {
      setStep(9);
    }
  };

  useEffect(() => {
    if (paramStep) {
      setStep(Number(paramStep));
    } else if (ageCreditCheck === "true") {
      setStep(3);
    }
  }, [ageCreditCheck, paramStep]);

  useEffect(() => {
    if (localUser?.token) {
      navigate("/");
    } else if (token && !sessionData?.token) {
      verifyToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isCameraGranted]);

  const onChange = (e: { target: { name: string; value: string } }) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    if (name === "zip" && value?.length > 5) return;
    setEnrollData({
      ...enrollData,
      [name]: value,
    });
  };

  const useEnrollSuccess = async (e: any) => {
    setIsUserVerify(true);
    setEnrolling(false);
    setUser(e.PI);
    const payload = {
      guid: e?.PI?.guid,
      uuid: e?.PI?.uuid,
      token: token,
    };
    if (e?.PI?.guid && e?.PI?.uuid) {
      await createUser(payload);
      const data: any = await verifyTokenApi(token);
      if (data?.status === SUCCESS) {
        setSessionData(data);
        // localStorage.setItem("user", JSON.stringify(data));
      }
    }
    setIsUserVerify(false);
    stopCamera();
  };

  const navigateFunc = () => {
    if (ageCreditCheck === "true") {
      setStep(9);
    } else if (sessionData?.status === REQUIRES_INPUT) {
      setStep(7);
    } else {
      setStep(5);
    }
  };

  useEffect(() => {
    if (user?.uuid) {
      setTimeout(() => {
        navigateFunc();
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uuid]);

  const {
    enrollUserOneFa,
    progress: enrollOneFaProgress,
    enrollStatus,
  } = useEnrollOneFa("userVideo", useEnrollSuccess, 4);

  const updateUser = async (e: any, flow?: number) => {
    const payload =
      flow === 1
        ? {
            barcode: e,
            token,
          }
        : e;
    updateUserApi(payload as any);
  };
  // For Enroll

  const onAgeChange = async (e?: number) => {
    const roundedAge = Math.round(e || 0);
    enrollUserOneFa();
    if (roundedAge) {
      const response = await checkAgeFlow(roundedAge, 0);
      setSessionData(response?.sessionInfo);
    }
  };

  const onContinue = async (e?: boolean) => {
    setLoading(true);
    const response = await checkAgeFlow(0, 2);
    if (response?.sessionInfo?.status === SUCCESS) {
      setSessionData(response?.sessionInfo);
      // localStorage.setItem("user", JSON.stringify(response?.sessionInfo));
      const payload = {
        firstName: enrollData?.firstName,
        lastName: enrollData?.lastName,
        dob: dayjs(enrollData?.dob).format("MM/YYYY"),
        ssn: enrollData?.ssn,
        zip: enrollData?.zip,
      };
      if (user?.guid && user?.uuid) {
        const attributes = { preferred: payload };
        await updateUser({ attributes, token }, 2);
      } else {
        setSessionData(response?.sessionInfo);
        return navigateToUrl(response?.sessionInfo?.successUrl);
      }
      setLoading(false);
      setStep(5);
    } else if (response?.sessionInfo?.status === FAILURE) {
      setLoading(false);
      showToast("Verification failed", "error");
      navigateToUrl(response?.sessionInfo?.failureUrl);
    }
  };

  // Back Document Success
  const onBackSuccess = async (e: any) => {
    if (e) {
      setIsScanning(false);
      const birthDate = getDateFromString(e.dateOfBirth);
      const calculatedAge = calculateAgeFromDate(birthDate);
      const response = await checkAgeFlow(Math.round(calculatedAge), 1);
      if (response.sessionInfo.status === SUCCESS) {
        setSessionData(response?.sessionInfo);
        // localStorage.setItem("user", JSON.stringify(response?.sessionInfo));
        setIsUserVerify(true);
        await updateUser(e?.barcode_key_string, 1);
        setIsUserVerify(false);
        stopCamera();
        setStep(5);
        // setTimeout(() => {
        //
        // }, 4000);
      } else if (response?.sessionInfo?.status === FAILURE) {
        showToast("Verification failed", "error");
        navigateToUrl(response?.sessionInfo?.failureUrl);
      } else {
        showToast("User Age Verification Failed.", "error");
        navigateToUrl(response?.sessionInfo?.failureUrl);
      }
    }
  };

  // Back Front Success
  const onFrontSuccess = (e: any) => {
    if (e?.op_status === 0) {
      setIsScanning(false);
      setIsUserVerify(true);
      setTimeout(() => {
        setIsBackScan(true);
        setIsUserVerify(false);
        setIsScanning(true);
      }, 2000);
    }
  };

  const checkAgeFlow = async (e: number, flow?: any): Promise<any> => {
    let payload;
    if (flow === 0) {
      payload = {
        flow,
        inputs: {
          age: parseInt(overideAge || "") || e,
        },
      };
    } else if (flow === 1) {
      payload = {
        flow,
        inputs: {
          calculatedAge: parseInt(overideAge || "") || e,
        },
      };
    } else {
      payload = {
        flow,
        inputs: {
          firstName: enrollData?.firstName,
          lastName: enrollData?.lastName,
          dobMonth: dayjs(enrollData?.dob).format("MM"),
          dobYear: dayjs(enrollData?.dob).format("YYYY"),
          ssn: enrollData?.ssn,
          zip: enrollData?.zip,
        },
      };
    }
    const result: any = await verifyAge({ id: token, payload });
    if (result?.data?.error) {
      showToast(result?.data?.message, "error");
      navigate("/");
    } else {
      return result;
    }
  };

  const navigateToUrl = (
    url: string,
    timeoutMilliseconds = 1000,
    token = ""
  ) => {
    setTimeout(() => {
      window.open(`${url}?token=${token || sessionData?.token}`, "_self");
    }, timeoutMilliseconds);
  };

  const useDeleteCallback = (deleteStatus: any) => {
    navigateToUrl(sessionData?.successUrl);
  };
  const handleDelete = async () => {
    if (sessionData?.token) {
      const payload: { [x: string]: string | undefined | null } = {
        token,
      };
      if (user?.uuid) {
        onDeleteUser(user?.uuid);
        payload.guid = user?.guid;
        payload.uuid = user?.uuid;
      }
      deleteUserApi(payload as any);
      localStorage.removeItem("user");
      localStorage.removeItem("uuid");
      showToast("Redirecting...", "success");
      if (!user?.uuid) {
        navigateToUrl(sessionData?.successUrl);
      }
    } else {
      setStep(12);
      setPrevStep(5);
    }
  };

  const { onDeleteUser } = useDelete(useDeleteCallback);

  const onCameraNotGranted = (e: boolean) => {
    if (!e) {
      setStep(11);
    }
  };

  const onCloseModal = () => {
    return [5, 6].includes(step)
      ? navigateToUrl(sessionData?.successUrl)
      : navigate("/");
  };

  const _renderChildren = () => {
    switch (step as number) {
      case 1:
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
                <img
                  src={smallLock}
                  alt="smallLock"
                  className={classes.smallLock}
                />{" "}
                ANONYMOUS AGE VERIFICATION
              </Typography>
            </Grid>
            {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
            <Grid style={styles.cardGrid} className={classes.cardGridMobile}>
              <Typography
                component="p"
                textAlign={matchesSM ? "center" : "left"}
                fontSize={17}
                fontWeight={700}
                lineHeight={1.5}
                mt={2}
                className={classes.cardInnerHeading}
              >
                {name} partners with AllpassTrust for
                <br /> secure, anonymous age verification.
              </Typography>
              <Typography
                component="p"
                textAlign={matchesSM ? "center" : "left"}
                fontSize={17}
                fontWeight={500}
                mt={2}
                className={classes.cardInnerHeading}
              >
                Get ready to take a selfie.
                <br /> No images will leave your device.
              </Typography>
              <Typography
                component="p"
                textAlign={matchesSM ? "center" : "left"}
                fontSize={14}
                fontWeight={700}
                mt={3}
                color={"#333"}
                className={classes.cardInnerText}
              >
                How AllpassTrust will verify your identity ?
              </Typography>
              <Typography
                component="p"
                textAlign={matchesSM ? "center" : "left"}
                fontSize={13}
                fontWeight={500}
                mt={2}
                className={classes.cardInnerText}
              >
                AllpassTrust will use your selfie to estimate your age. Your
                image will be deleted immediately after processing. No images or
                information will be shared with {name}. Data will be strictly
                processed according to the AllpassTrust Privacy Policy. Learn
                how AllpassTrust works.
              </Typography>
            </Grid>
            <Grid>
              {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
              <Button
                variant="contained"
                color={theme as "inherit"}
                style={styles.continueButton}
                onClick={() => setStep(3)}
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
                  Agree and continue
                </Typography>
              </Button>
              <Button
                variant="text"
                color={theme as "inherit"}
                style={styles.textButton}
                onClick={() => {
                  setStep(12);
                  setPrevStep(1);
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
            </Grid>
          </>
        );
      case 3:
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
                Verify your age with a selfie
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
              <img src={phoneImage} alt="scan" width={"180px"} />
            </Grid>
            {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
            <Button
              variant="contained"
              color={theme as "inherit"}
              style={styles.continueButton}
              onClick={() => setStep(4)}
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
            <Button
              variant="text"
              color={theme as "inherit"}
              style={styles.textButton}
              onClick={() => setStep(9)}
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
          </>
        );
      case 4:
        return (
          <>
            <Box position={"relative"} padding={"10px 10px"} mt={4} pr={"12px"}>
              {isUserVerify && (
                <Box style={styles.overlayCamera as React.CSSProperties}>
                  <img
                    src={shield}
                    alt="shield"
                    style={styles.shield as React.CSSProperties}
                  />
                </Box>
              )}
              <Box className={classes.otherOptions}>
                <Typography
                  component="p"
                  textAlign={matchesSM ? "center" : "left"}
                  fontSize={15}
                  fontWeight={500}
                  mt={2}
                  onClick={() => {
                    setStep(14);
                    stopCamera();
                  }}
                >
                  <PhoneIphoneIcon /> Switch to other device
                </Typography>
              </Box>
              <PredictAge
                enrollAge={onAgeChange}
                onReadyCallback={onCameraNotGranted}
                message={enrollStatus}
              />
              <Box style={{ height: 50 }}>
                <Box style={{ height: 14 }}>
                  {enrollOneFaProgress > 0 && (
                    <LinearProgress
                      variant="determinate"
                      value={enrollOneFaProgress}
                    />
                  )}
                </Box>
                {enrollOneFaProgress === 100 && enrolling ? (
                  <Typography
                    component="p"
                    textAlign="center"
                    fontSize={14}
                    fontWeight={700}
                    mt={1}
                    mb={1}
                    color={"#333"}
                  >
                    <CircularProgress style={styles.scanLoader} /> Verifying
                    User, this might take some minutes…
                  </Typography>
                ) : null}
              </Box>
            </Box>
          </>
        );
      case 5:
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
                style={{ marginLeft: "-34px" }}
                className={`${classes.cardHeading} cardHeadingNoMargin`}
              >
                <img
                  src={smallLock}
                  alt="smallLock"
                  className={classes.smallLock}
                />
                FACE UNLOCK
              </Typography>
            </Grid>
            {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
            <Grid style={styles.cardGrid} className={classes.cardGridMobile}>
              <Typography
                component="p"
                textAlign={matchesSM ? "center" : "left"}
                fontSize={20}
                fontWeight={900}
                mt={3}
                color={palette?.[skin]?.listText}
              >
                Enhance Your Experience
              </Typography>
              <Typography
                component="p"
                textAlign={matchesSM ? "center" : "left"}
                fontSize={20}
                fontWeight={500}
                mt={0}
                color={"#333"}
              >
                Sign up for Face Unlock for Free
              </Typography>
              <Typography
                component="p"
                textAlign={matchesSM ? "center" : "left"}
                fontSize={16}
                fontWeight={500}
                mt={4}
                color={"#333"}
              >
                Use your face to bypass age verification!
                <br /> No images or personal information leave your device.
                <br /> Certified to IEEE Standard for Biometric Privacy.
              </Typography>
              <Typography
                component="p"
                textAlign={matchesSM ? "center" : "left"}
                fontSize={14}
                fontWeight={500}
                mt={4}
                color={"#333"}
              >
                Learn how Face Unlock works
              </Typography>
            </Grid>
            {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
            <Button
              variant="contained"
              color={theme as "inherit"}
              style={styles.continueButton}
              onClick={() => setStep(6)}
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
                Accept and continue
              </Typography>
            </Button>
            <Button
              variant="text"
              color={theme as "inherit"}
              style={styles.textButton}
              onClick={handleDelete}
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
                className={classes.textButtonUnderline}
              >
                No, I do not consent
              </Typography>
            </Button>
          </>
        );
      case 6:
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
                <img
                  src={smallLock}
                  alt="smallLock"
                  className={classes.smallLock}
                />
                FACE UNLOCK
              </Typography>
            </Grid>
            {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
            <Grid style={styles.cardGrid} className={classes.cardGridMobile}>
              {isUserVerify && (
                <Box style={styles.overlayCamera as React.CSSProperties}>
                  <img
                    src={shield}
                    alt="shield"
                    style={styles.shield as React.CSSProperties}
                  />
                </Box>
              )}
              <Typography
                component="p"
                textAlign="center"
                fontSize={20}
                fontWeight={900}
                mt={3}
                color={"#333"}
              >
                YES, CREATE MY ACCOUNT
              </Typography>
              <Card className={classes.consentCard}>
                <List
                  sx={{
                    listStyleType: "disc",
                    pl: 2,
                  }}
                >
                  <ListItem className={classes.listText}>
                    I acknowledge I am over 18 years of age, all information I
                    provided is accurate, and I am prohibited from allowing any
                    person under the age of 18 to access or use my account.
                  </ListItem>
                  <ListItem className={classes.listText}>
                    I agree to enroll in Face Unlock using my facial biometrics.
                    Each biometric is safely encrypted in compliance with the
                    IEEE 2410-2021 Standard for Biometric Privacy, completely
                    transformed into anonymized data and then deleted. Biometric
                    information is never transmitted to, stored by or used by
                    AllpassTrust. Only anonymized data is used to authenticate
                    you.
                  </ListItem>
                  <ListItem className={classes.listText}>
                    I have read the AllpassTrust Terms of Service and Privacy
                    Policy.
                  </ListItem>
                </List>
              </Card>
            </Grid>
            {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
            <Button
              variant="contained"
              color={theme as "inherit"}
              style={styles.continueButton}
              onClick={() => {
                setIsUserVerify(true);
                localStorage.setItem("user", JSON.stringify(sessionData));
                localStorage.setItem("uuid", JSON.stringify(user?.uuid));
                navigateToUrl(sessionData?.successUrl);
              }}
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
                Accept and finish
              </Typography>
            </Button>
            <Button
              variant="text"
              color={theme as "inherit"}
              style={styles.textButton}
              onClick={handleDelete}
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
                className={classes.textButtonUnderline}
              >
                No, I do not consent
              </Typography>
            </Button>
          </>
        );
      case 7:
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
                <img
                  src={smallLock}
                  alt="smallLock"
                  className={classes.smallLock}
                />
                ANONYMOUS AGE VERIFICATION
              </Typography>
            </Grid>
            {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
            <Grid style={styles.cardGrid} className={classes.cardGridMobile}>
              <Typography
                component="p"
                textAlign="center"
                fontSize={18}
                fontWeight={700}
                mt={3}
                color={"#555"}
              >
                Use your Driver’s License
                <br /> to verify your age
              </Typography>
              <Typography
                component="p"
                textAlign={matchesSM ? "center" : "center"}
                fontSize={14}
                fontWeight={500}
                mt={5}
              >
                AllpassTrust needs to use your Driver’s License to validate your
                age. All images and personal details remain on your device and
                are deleted immediately after processing. No images or personal
                details are shared with {name}.
              </Typography>
              <Typography
                component="p"
                textAlign={matchesSM ? "center" : "center"}
                fontSize={12}
                fontWeight={500}
                mt={3}
                mb={1}
              >
                Learn how AllpassTrust works
              </Typography>
            </Grid>
            {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
            <Button
              variant="contained"
              color={theme as "inherit"}
              style={styles.continueButton}
              onClick={() => setStep(8)}
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
                Accept and continue
              </Typography>
            </Button>
            <Button
              variant="text"
              color={theme as "inherit"}
              style={styles.textButton}
              onClick={() => setStep(9)}
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
          </>
        );
      case 8:
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
                <img
                  src={smallLock}
                  alt="smallLock"
                  className={classes.smallLock}
                />
                ANONYMOUS AGE VERIFICATION
              </Typography>
            </Grid>
            {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
            <Grid
              style={styles.cardGrid}
              className={`cardGridMobile overflowUnset`}
            >
              <Box position={"relative"}>
                <Box position={"relative"}>
                  <img
                    src={isBackScan ? DlBack : DlFront}
                    alt="DlFront"
                    style={styles.DlFront as React.CSSProperties}
                    className="DlBack"
                  />
                  {isUserVerify && (
                    <Box style={styles.overlay as React.CSSProperties}>
                      <img
                        src={shield}
                        alt="shield"
                        style={styles.shield as React.CSSProperties}
                      />
                    </Box>
                  )}
                  {isBackScan ? (
                    <ScanBackDocument
                      onSuccess={onBackSuccess}
                      onReadyCallback={onCameraNotGranted}
                    />
                  ) : (
                    <ScanFrontDocument
                      onSuccess={onFrontSuccess}
                      onReadyCallback={onCameraNotGranted}
                    />
                  )}
                </Box>
              </Box>
            </Grid>
            <Box style={{ height: 106 }}>
              {isScanning ? (
                <Typography
                  component="p"
                  textAlign="center"
                  fontSize={14}
                  fontWeight={500}
                  mt={1}
                  mb={2}
                >
                  <CircularProgress style={styles.scanLoader} /> Scanning...
                </Typography>
              ) : null}

              <Typography
                component="p"
                textAlign="center"
                fontSize={14}
                fontWeight={500}
                mt={1}
                mb={2}
              >
                {isBackScan
                  ? "Place the back of the Driver’s License above"
                  : "Place the front of the Driver’s License above"}
              </Typography>
            </Box>
          </>
        );
      case 9:
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
                <img
                  src={smallLock}
                  alt="smallLock"
                  className={classes.smallLock}
                />{" "}
                ANONYMOUS AGE VERIFICATION
              </Typography>
            </Grid>
            {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
            <Grid style={styles.cardGrid} className={classes.cardGridMobile}>
              <Typography
                component="p"
                textAlign="center"
                fontSize={24}
                fontWeight={700}
                mt={3}
                color={"#333"}
              >
                Use the Age Check <br />
                Database to Verify Your Age
              </Typography>
              <Typography
                component="p"
                textAlign={matchesSM ? "center" : "left"}
                fontSize={15}
                fontWeight={500}
                mt={5}
              >
                AllpassTrust needs your personal details to validate your age.
                All personal details will be deleted immediately after
                processing. No images or personal details will be shared with
                {name}.
              </Typography>
              <Typography
                component="p"
                textAlign={matchesSM ? "center" : "left"}
                fontSize={15}
                fontWeight={500}
                mt={3}
                mb={1}
              >
                Learn how AllpassTrust works
              </Typography>
            </Grid>
            {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
            <Button
              variant="contained"
              color={theme as "inherit"}
              style={styles.continueButton}
              onClick={() => setStep(13)}
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
                Accept and continue
              </Typography>
            </Button>
            <Button
              variant="text"
              color={theme as "inherit"}
              style={styles.textButton}
              onClick={() => {
                setStep(12);
                setPrevStep(9);
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
          </>
        );
      case 10:
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
                <img
                  src={smallLock}
                  alt="smallLock"
                  className={classes.smallLock}
                />
                ANONYMOUS AGE VERIFICATION
              </Typography>
            </Grid>
            {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
            <Grid style={styles.cardGrid} className={classes.cardGridMobile}>
              <Typography
                component="p"
                textAlign="center"
                fontSize={18}
                fontWeight={700}
                mt={2}
                color={"#333"}
              >
                USER CONSENT
              </Typography>
              <Card className={classes.consentCard}>
                <List
                  sx={{
                    listStyleType: "disc",
                    pl: 2,
                  }}
                >
                  <ListItem className={classes.listText}>
                    I acknowledge I am over 18 years of age and all information
                    I provided is accurate.
                  </ListItem>
                  <ListItem className={classes.listText}>
                    AllpassTrust and our third-party enrollment and identity
                    proofing service provider Central Account Management
                    Services LLC and its contract providers may share, use and
                    maintain the images and information you provide, and the
                    information on file with other third-party service providers
                    or governments, to further verify your age or identity, to
                    protect against or prevent actual or potential fraud or
                    unauthorized use of the Service for the duration of our
                    business relationship.
                  </ListItem>
                  <ListItem className={classes.listText}>
                    I have read and agreed to the AllpassTrust Terms of Service
                    and Privacy Policy and Ultrapass Terms of Service and
                    Privacy Policy.
                  </ListItem>
                </List>
              </Card>
            </Grid>
            {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
            <Button
              variant="contained"
              color={theme as "inherit"}
              style={styles.continueButton}
              onClick={() => setStep(11)}
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
                Accept and continue
              </Typography>
            </Button>
            <Button
              variant="text"
              color={theme as "inherit"}
              style={styles.textButton}
              onClick={() => {
                setStep(12);
                setPrevStep(10);
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
                className={classes.textButtonUnderline}
              >
                No, don’t verify
              </Typography>
            </Button>
          </>
        );
      case 11:
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
                <img
                  src={smallLock}
                  alt="smallLock"
                  className={classes.smallLock}
                />
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
      case 12:
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
                <img
                  src={smallLock}
                  alt="smallLock"
                  className={classes.smallLock}
                />{" "}
                ANONYMOUS AGE VERIFICATION
              </Typography>
            </Grid>
            {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
            <Grid style={styles.cardGrid} className={classes.cardGridMobile}>
              <Typography
                component="p"
                textAlign="center"
                fontSize={25}
                fontWeight={700}
                mt={4}
              >
                ARE YOU SURE <br />
                YOU WANT TO EXIT?
              </Typography>
              <Typography
                component="p"
                textAlign="center"
                fontSize={20}
                fontWeight={500}
                mt={7}
              >
                AllpassTrust cannot verify your age
                <br /> without your consent.
              </Typography>
            </Grid>
            {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
            <Button
              variant="contained"
              color={theme as "inherit"}
              style={styles.continueButton}
              onClick={() => setStep(prevStep)}
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
                Back to consent
              </Typography>
            </Button>
            <Button
              variant="text"
              color={theme as "inherit"}
              style={styles.textButton}
              onClick={() => navigateToUrl(sessionData?.failureUrl)}
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
                Exit
              </Typography>
            </Button>
          </>
        );
      case 13:
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
                <img
                  src={smallLock}
                  alt="smallLock"
                  className={classes.smallLock}
                />{" "}
                ANONYMOUS AGE VERIFICATION
              </Typography>
            </Grid>
            <Divider color="#000" />
            <Grid style={styles.cardGrid} className={classes.cardGridMobile}>
              <Typography
                component="p"
                textAlign="center"
                fontSize={24}
                fontWeight={700}
                mt={3}
                color={"#333"}
              >
                Use the Age Check <br />
                Database to Verify Your Age
              </Typography>
              <Typography
                component="p"
                textAlign={"center"}
                fontSize={22}
                fontWeight={700}
                color={"#999"}
                mt={7}
              >
                Please prepare to enter your <br /> Name, Birthday and Zipcode
              </Typography>
            </Grid>
            <Divider color="#000" />
            <Button
              variant="contained"
              color={theme as "inherit"}
              style={styles.continueButton}
              onClick={() => setStep(10)}
            >
              <Typography
                component="p"
                color={`#000`}
                textAlign="center"
                fontWeight={600}
                display="flex"
                alignItems="center"
                justifyContent={"center"}
                textTransform="capitalize"
              >
                Accept and continue
              </Typography>
            </Button>
            <Button
              variant="text"
              color={theme as "inherit"}
              style={styles.textButton}
              onClick={() => {
                setStep(12);
                setPrevStep(13);
              }}
            >
              <Typography
                component="p"
                color={`#000`}
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
          </>
        );
      case 14:
        return (
          <>
            <FullWidthTabs />
          </>
        );
      default:
        break;
    }
  };
  const themeName = skin || "primary";

  return (
    <>
      {headerVisible?.includes(skin) && <Header theme={themeName} />}
      <div className="homePageWrapper">
        {[5, 6].includes(step) ? (
          <div className="green-border">
            <p>FACE UNLOCK</p>
          </div>
        ) : null}
        <div className="homeSidebarImg">
          <img src={womenImg} alt="women" />
        </div>

        <HomeModal handleClose={onCloseModal} open={true}>
          {_renderChildren()}
        </HomeModal>
      </div>
    </>
  );
};

export default Signup;
