import useEnrollOneFa2 from "../../hooks/useEnrollOneFa2";
import {
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useStyles, styles } from "./styles";
import React, { useEffect, useState } from "react";
import homeStyles from "../../styles/Home.module.css";
import Camera from "../Camera";
import { UserContext } from "../../context/UserContext";
import { updateUser } from "@privateid/cryptonets-web-sdk-alpha";
import shield from "../../assets/shield.png";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import STEPS from "../../pages/register/steps";
import { stopCamera } from "../../utils";

const Enroll = ({
  onReadyCallback,
  message,
  setStep,
}: {
  onReadyCallback?: (e: boolean) => void;
  onSwitchCamera?: () => void;
  message?: string;
  setStep: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();
  const context = React.useContext(UserContext);
  const { id, setGUID, setUUID } = context;
  const [enrolling, setEnrolling] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    enrollUserOneFa,
    progress: enrollOneFaProgress,
    enrollStatus,
    enrollGUID,
    enrollUUID,
  } = useEnrollOneFa2("userVideo", (e: any) => console.log(e), 4);

  const handleUserUpdate = async (guid: string, uuid: string) => {
    setGUID(guid);
    setUUID(uuid);
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
      stopCamera();
    }
    setStep(STEPS.PRE_DRIVERLICENSE);
  };
  useEffect(() => {
    if (enrollGUID && enrollUUID) {
      handleUserUpdate(enrollGUID, enrollUUID);
    }
  }, [enrollStatus, enrollGUID, enrollUUID]);

  return (
    <Box position={"relative"} padding={"10px 10px"} mt={4} pr={"12px"}>
      {showSuccess && (
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
            setStep(STEPS.SWITCH_DEVICE);
            stopCamera();
          }}
        >
          <PhoneIphoneIcon /> Switch to other device
        </Typography>
      </Box>

      <>
        <div id="canvasInput" className={homeStyles.container}>
          <Camera
            onReadyCallback={enrollUserOneFa}
            onSwitchCamera={enrollUserOneFa}
            message={message}
          />
        </div>
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
              align="center"
              fontSize={14}
              fontWeight={700}
              mt={1}
              mb={1}
            >
              <CircularProgress /> Verifying User, this might take some minutes…
            </Typography>
          ) : null}
        </Box>
      </>
    </Box>
  );
};
export default Enroll;
