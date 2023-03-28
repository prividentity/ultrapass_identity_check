import useEnrollOneFa2 from "../../hooks/useEnrollOneFa2";
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
} from "@mui/material";
import { useStyles, styles } from "./styles";
import React, { useEffect, useState } from "react";
import homeStyles from "../../styles/Home.module.css";
import Camera from "../Camera";
import { theme as Theme } from "../../theme";
import { UserContext } from "../../context/UserContext";
import {
  closeCamera,
  updateUser,
  uploadPortrait,
} from "@privateid/cryptonets-web-sdk-alpha";
import shield from "../../assets/shield.png";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import STEPS from "../../pages/register/steps";
import { stopCamera } from "../../utils";
import SpinnerLoader from "../SpinnerLoader";
import {convertBase64ToImageData} from "../../utils/base64ToImageData";

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

  const {
    enrollUserOneFa,
    progress: enrollOneFaProgress,
    enrollStatus,
    enrollGUID,
    enrollUUID,
    enrollPortrait,
  } = useEnrollOneFa2("userVideo", (e: any) => console.log(e), 4);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleUserUpdate = async (guid: string, uuid: string) => {
    setGUID(guid);
    setUUID(uuid);
    await convertBase64ToImageData(enrollPortrait, setEnrollImageData)

    const uploadResult = await uploadPortrait({
      id,
      portrait: enrollPortrait
    });
    console.log("upload portrait:", uploadResult);

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
      await closeCamera(undefined);
      setTimeout(async () => {
        setDlAction("frontscan");
        setStep(STEPS.DRIVERLICENSE);
      }, 1000);
    }
  };
  useEffect(() => {
    if (enrollGUID && enrollUUID) {
      handleUserUpdate(enrollGUID, enrollUUID);
    }
  }, [enrollStatus, enrollGUID, enrollUUID]);

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
          sx={{ paddingTop: 4, paddingBottom: 2 }}
          className={classes.cardHeading}
        >
          CONFIRM YOUR IDENTITY
        </Typography>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Box position={"relative"} padding={"10px 10px"} mt={0} pr={"12px"}>
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
                onSwitchCamera={enrollUserOneFa}
                onCameraFail={onCameraFail}
                message={enrollStatus}
                onWasmLoadFail={onWasmLoadFail}
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
