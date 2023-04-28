import React, { useEffect, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router";
import shield from "../../assets/shield.png";
import { styles } from "./styles";
import homeStyles from "../../styles/Home.module.css";
import {
  ERROR,
  getStatusFromUser,
  isAndroid,
  isIOS,
  osVersion,
  REQUIRES_INPUT,
  stopCamera,
  SUCCESS,
} from "../../utils";
import { CircularProgress } from "@mui/material";
import { createVerificationSession, getUser } from "../../services/api";
import womenImg from "../../assets/Kimiko-S3.png";
import HomeModal from "../../components/Modal/homeModal";
import useToast from "../../utils/useToast";
import Header from "../../components/Header";
import { DEFAULT_THEME, headerVisible } from "../../theme";
import usePredictOneFa from "../../hooks/usePredictOneFa";
import config from "../../config";
import { createSearchParams } from "react-router-dom";
import { useCamera, useWasm } from "../../hooks";
import Camera from "../../components/Camera";
import HomeComponent from "../../components/HomeComponent";
import { ELEMENT_ID } from "../../constants";

interface props {
  theme: string;
  skin: string;
}

const Signin = ({ theme, skin }: props) => {
  const { ready: wasmReady, wasmStatus } = useWasm();
  const [isInitialPredict, setInitialPredict] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { ready, init } = useCamera(ELEMENT_ID);
  const muiTheme = useTheme();
  const matchesSM = useMediaQuery(muiTheme.breakpoints.down("sm"));

  useEffect(() => {
    // console.log("=====? HERE????", { wasmStatus, wasmReady, ready });

    if (!wasmReady && wasmStatus.isChecking) return;

    if (wasmReady && !wasmStatus.isChecking && wasmStatus.support) {
      // if(ready && wasmReady && wasmStatus.support && isCameraGranted) return;
      if (!ready) {
        init();
        return;
      }
    }

    if (wasmReady && ready) {
      predictUserOneFa();
    }

    // console.log("--- wasm status ", ready);
  }, [wasmReady, ready, wasmStatus]);

  const createVerification = async () => {
    const payload = config.clientConfig;
    const result: any = await createVerificationSession(payload);
    if (result?.token) {
      stopCamera();
      navigate({
        pathname: "/register",
        search: createSearchParams({
          token: result?.token || "",
        }).toString(),
      });
    }
  };
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const themeName = skin || DEFAULT_THEME;
  const [step, setStep] = useState(0);
  const [isUserVerify, setIsUserVerify] = useState(false);
  const retryTimes = step === 1 ? 12 : 5;

  useEffect(() => {
    if (user?._id) {
      stopCamera();
      navigate("/");
    }
  }, [user]);

  const nextStep = (userParam: any) => {
    const user = userParam || JSON.parse(localStorage.getItem("user") || "{}");
    if (!user._id) return;
    const userStatus = getStatusFromUser(user);
    // console.log(userStatus, "user status\n", user, "user\n");
    setIsUserVerify(false);
    stopCamera();
    switch (userStatus) {
      case SUCCESS:
        showToast("Logged in Successfully", "success");
        navigate("/");
        break;
      case REQUIRES_INPUT:
        setStep(7);
        break;

      default:
        showToast(
          "You have not successfully completed your verification",
          "error"
        );
        localStorage.removeItem("user");
        localStorage.removeItem("uuid");
        navigate("/");
    }
  };

  const handlePredictSuccess = async (result: any) => {
    switch (result.status) {
      case -100:
        setInitialPredict(false);
        return step === 1 ? createVerification() : setStep(1);
      case 0: {
        localStorage.setItem("uuid", JSON.stringify(result?.PI?.uuid || {}));
        const payload = {
          guid: result?.PI?.guid,
        };
        const data: any = await getUser(payload);
        if (data?.data?.level === ERROR) {
          showToast(data?.data?.message, "error");
          return createVerification();
        } else {
          setIsUserVerify(true);
          localStorage.setItem("user", JSON.stringify(data || {}));
          nextStep(data);
        }
        return false;
      }
      default: {
        showToast(result?.message, "error");
        return createVerification();
      }
    }
  };

  const { predictUserOneFa } = usePredictOneFa(
    ELEMENT_ID,
    handlePredictSuccess,
    retryTimes,
    "",
    isInitialPredict
  );

  const _renderChildren = () => {
    switch (step as number) {
      case 1:
        return (
          <Box position={"relative"} padding={"10px 10px"} mt={3} pr={"12px"}>
            {isUserVerify && (
              <Box style={styles.overlayCamera as React.CSSProperties}>
                <img
                  src={shield}
                  alt="shield"
                  style={styles.shield as React.CSSProperties}
                />
              </Box>
            )}
            <div id="canvasInput" className={homeStyles.container}>
              <Camera
                onReadyCallback={predictUserOneFa}
                onSwitchCamera={predictUserOneFa}
              ></Camera>
            </div>
          </Box>
        );
      default:
        return (
          <Box
            position={"relative"}
            textAlign={"center"}
            padding={"10px 10px"}
            mt={3}
            pr={"12px"}
          >
            <CircularProgress />
          </Box>
        );
    }
  };

  const onClose = () => {
    stopCamera();
    navigate("/");
  };

  return (
    <>
      {headerVisible?.includes(skin) && <Header theme={themeName} />}
      <div className="homePageWrapper">
        {!matchesSM && (
          <div className="homeSidebarImg">
            <img src={womenImg} alt="women" />
          </div>
        )}
        {isInitialPredict && (
          <>
            <HomeComponent theme={themeName} />
            <video
              id="userVideo"
              muted
              autoPlay
              playsInline
              className={`video-open mirrored`}
              style={{ display: "none" }}
            />
          </>
        )}
        <HomeModal handleClose={onClose} open={!isInitialPredict}>
          {_renderChildren()}
        </HomeModal>
      </div>
    </>
  );
};

export default Signin;
