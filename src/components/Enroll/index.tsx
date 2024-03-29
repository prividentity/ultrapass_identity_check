import {
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
  useTheme,
  useMediaQuery,
  Stack,
  Grid,
  Divider,
  Alert,
} from "@mui/material";
import { useStyles, styles } from "./styles";
import React, { useEffect, useState } from "react";
import homeStyles from "../../styles/Home.module.css";
import { convertCroppedImage } from "@privateid/cryptonets-web-sdk";
import Camera from "../Camera";
import { theme as Theme } from "../../theme";
import { UserContext } from "../../context/UserContext";
import {
  closeCamera,
  updateUser,
  uploadPortrait,
} from "@privateid/cryptonets-web-sdk";
import shield from "../../assets/shield.png";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import STEPS from "../../pages/register/steps";
import { cameraDelay, stopCamera } from "../../utils";
import SpinnerLoader from "../SpinnerLoader";
import { convertBase64ToImageData } from "../../utils/base64ToImageData";
import { ELEMENT_ID } from "../../constants";
import useEnrollOneFaWithLiveness from "../../hooks/useEnrollOneFaWithLiveness";

// import sound from "../../assets/sound/success.mp3";

const Enroll = ({
  onReadyCallback,
  message,
  setStep,
  skin,
}: {
  onReadyCallback?: (e: boolean) => void;
  onSwitchCamera?: () => void;
  message?: string;
  setStep: React.Dispatch<React.SetStateAction<string>>;
  skin: string;
}) => {
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();
  const context = React.useContext(UserContext);
  const { id, setGUID, setUUID, setEnrollImageData, setDlAction } = context;
  const [showSuccess, setShowSuccess] = useState(false);
  const mainTheme = Theme;
  const palette: { [key: string]: any } = mainTheme.palette;
  const [hasNoCamera, setHasNoCamera] = useState(false);
  const [isScanningFailed, setIsScanningFailed] = useState(false);

  const {
    enrollUserOneFa,
    progress: enrollOneFaProgress,
    enrollStatus,
    enrollGUID,
    enrollUUID,
    enrollPortrait,
    livenessCheckStatus,
  } = useEnrollOneFaWithLiveness("userVideo", (e: any) => console.log(e), 4);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleUserUpdate = async (guid: string, uuid: string) => {
    // const audio = new Audio(sound);
    // await audio.play();
    // console.log("play");
    setGUID(guid);
    setUUID(uuid);
    if (enrollPortrait) {
      setEnrollImageData(enrollPortrait);
      const enrollPortraitBase64 = await convertCroppedImage(
        enrollPortrait.data,
        enrollPortrait.width,
        enrollPortrait.height
      );
      // console.log({ enrollPortraitBase64 });
      await uploadPortrait({
        id,
        portrait: enrollPortraitBase64,
      });
      // console.log("upload portrait:", uploadResult);

      const params = {
        id,
        attributes: {
          guid,
          uuid,
        },
      };
      const updateRes = (await updateUser(params)) as any;
      if (updateRes.guid && updateRes.uuid) {
        setShowSuccess(true);
        await closeCamera(ELEMENT_ID);
        setTimeout(async () => {
          setDlAction("frontscan");
          setStep(STEPS.DRIVERLICENSE);
        }, 1000);
      }
    }
  };
  useEffect(() => {
    if (enrollGUID && enrollUUID) {
      handleUserUpdate(enrollGUID, enrollUUID);
    }
  }, [enrollStatus, enrollGUID, enrollUUID]);

  useEffect(() => {
    setTimeout(() => {
      setIsScanningFailed(true);
    }, cameraDelay);
  }, []);

  const onCameraFail = async () => {
    setHasNoCamera(true);
  };

  const cameraPermissionCheckAndEnroll = (e: boolean) => {
    if (e) {
      enrollUserOneFa();
    } else {
      setStep(STEPS.CAMERA_PERMISSION_FAIL);
    }
  };

  const onWasmLoadFail = () => {
    setStep(STEPS.NOT_SUPPORTED);
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
          sx={{
            paddingTop: matchesSM ? "10px !important" : 4,
            paddingBottom: 2,
          }}
          className={classes.cardHeading}
        >
          CONFIRM YOUR IDENTITY
        </Typography>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      {enrollOneFaProgress === 0 && isScanningFailed && (
        <Alert
          severity="info"
          onClick={() => {
            setStep(STEPS.SWITCH_DEVICE);
            stopCamera();
          }}
          className={classes.alertWrap}
        >
          You can try switching to other device.
        </Alert>
      )}
      <Box
        position={"relative"}
        padding={matchesSM ? "0px 10px" : "10px 10px"}
        mt={0}
        pr={"12px"}
      >
        {(showSuccess || enrollOneFaProgress === 100) && (
          <Box style={styles.overlayCamera as React.CSSProperties}>
            {showSuccess ? (
              <img
                src={shield}
                alt="shield"
                style={styles.shield as React.CSSProperties}
              />
            ) : (
              <SpinnerLoader />
            )}
          </Box>
        )}
        <>
          <div id="canvasInput" className={homeStyles.container}>
            {hasNoCamera ? (
              <Stack
                width={"100%"}
                height={"400px"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Typography variant="h5" color={"#000000"}>
                  No Camera Detected.
                </Typography>
                <Typography variant="subtitle1" color={"#000000"}>
                  Please switch device.
                </Typography>
              </Stack>
            ) : (
              <Camera
                onReadyCallback={cameraPermissionCheckAndEnroll}
                onSwitchCamera={()=>{}}
                onCameraFail={onCameraFail}
                message={enrollStatus}
                onWasmLoadFail={onWasmLoadFail}
                otherDevice={true}
                setStep={() => {
                  setStep(STEPS.SWITCH_DEVICE);
                  stopCamera();
                }}
              />
            )}
          </div>
          <Box className={classes.otherOptions}>
            <Typography
              component="p"
              textAlign={matchesSM ? "center" : "left"}
              fontSize={15}
              fontWeight={500}
              mt={2}
              onClick={() => {
                setStep(STEPS.SWITCH_DEVICE);
                stopCamera();
              }}
            >
              <PhoneIphoneIcon /> Switch to other device
            </Typography>
          </Box>
          <Box style={{ height: 50 }}>
            <Box style={{ height: 14 }}>
              {enrollOneFaProgress > 0 && (
                <LinearProgress
                  variant="determinate"
                  value={enrollOneFaProgress}
                />
              )}
            </Box>
            {enrollOneFaProgress === 100 ? (
              <Typography
                align="center"
                fontSize={14}
                fontWeight={700}
                mt={1}
                mb={1}
                display={"flex"}
                alignItems="center"
                justifyContent={"center"}
              >
                <CircularProgress className={classes.progressBar} /> Verifying
                User, this might take some minutes…
              </Typography>
            ) : enrollOneFaProgress === 0 ? (
              <Typography
                align="center"
                fontSize={14}
                fontWeight={700}
                mt={1}
                mb={1}
              >
                Please look at the camera to enroll
              </Typography>
            ) : null}
          </Box>
        </>
      </Box>
    </>
  );
};
export default Enroll;
