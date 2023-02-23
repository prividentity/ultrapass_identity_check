import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router";
import shield from "../../assets/shield.png";
import { styles } from "./styles";
import homeStyles from "../../styles/Home.module.css";
import {
  ERROR,
  FAILURE,
  isAndroid,
  isIOS,
  osVersion,
  REQUIRES_INPUT,
  stopCamera,
  SUCCESS,
} from "../../utils";
import { CircularProgress } from "@mui/material";
import {
  createVerificationSession,
  getUser,
  verifyTokenApi,
} from "../../services/api";
import womenImg from "../../assets/Kimiko-S3.png";
import HomeModal from "../../components/Modal/homeModal";
import useToast from "../../utils/useToast";
import Header from "../../components/Header";
import { headerVisible } from "../../theme";
import usePredictOneFa from "../../hooks/usePredictOneFa";
import config from "../../config";
import { createSearchParams } from "react-router-dom";
import { useCamera, useWasm } from "../../hooks";
import Camera from "../../components/Camera";
import HomeComponent from "../../components/HomeComponent";

interface props {
  theme: string;
  skin: string;
}

const Signin = ({ theme, skin }: props) => {
  const { ready: wasmReady } = useWasm();
  const [isInitialPredict, setInitialPredict] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const elementId = "userVideo";
  const { ready, init } = useCamera(elementId);

  useEffect(() => {
    if (!wasmReady) return;
    if (!ready) init();
    if (isIOS && osVersion < 15) {
      console.log("Does not support old version of iOS os version 15 below.");
    } else if (isAndroid && osVersion < 11) {
      console.log(
        "Does not support old version of Android os version 11 below."
      );
    }
    predictUserOneFa();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wasmReady, ready]);

  const createVerification = async () => {
    const payload = config.clientConfig;
    const result: any = await createVerificationSession(payload);
    if (result?.token) {
      stopCamera();
      navigate({
        pathname: "/signup",
        search: createSearchParams({
          token: result?.token || "",
        }).toString(),
      });
    }
  };
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const themeName = skin || "primary";
  const [step, setStep] = useState(0);
  const [isUserVerify, setIsUserVerify] = useState(false);
  const [sessionData, setSessionData] = useState<any>();
  const retryTimes = step === 1 ? 12 : 3

  useEffect(() => {
    if (user?._id && !sessionData) {
      stopCamera();
      navigate("/");
    }
  }, [user]);

  const verifyToken = async (e: string) => {
    const result: any = await verifyTokenApi(e);
    localStorage.setItem("user", JSON.stringify(result || "{}"));
    setSessionData(result);
    setIsUserVerify(false);
    stopCamera();
    if (result?.status === SUCCESS) {
      showToast("Logged in Successfully", "success");
      navigate("/");
      // navigateToUrl(result?.successUrl, result?.token);
    } else if (result?.status === FAILURE) {
      showToast("invalid token", "error");
      navigate("/");
    } else if (result?.status === REQUIRES_INPUT) {
      setStep(7);
    } else {
      navigate("/");
    }
  };

  const navigateToUrl = (url: string, token?: string) => {
    window.open(`${url}?token=${token}`, "_self");
  };

  const handlePredictSuccess = async (result: any) => {
    switch (result.status) {
      case -100:
        setInitialPredict(false);
        return step === 1 ? createVerification() : setStep(1);
      case 0: {
        localStorage.setItem("uuid", JSON.stringify(result?.PI?.uuid || "{}"));
        const payload = {
          guid: result?.PI?.guid,
        };
        const data: any = await getUser(payload);
        if (data?.data?.level === ERROR) {
          showToast(data?.data?.message, "error");
          return createVerification();
        } else {
          setIsUserVerify(true);
          if (data?.token) {
            return verifyToken(data?.token);
          }
        }
        return false;
      }
      default: {
        showToast(result?.message, "error");
        return createVerification();
      }
    }
  };

  const { predictUserOneFa } = usePredictOneFa(elementId, handlePredictSuccess, retryTimes);

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
        <div className="homeSidebarImg">
          <img src={womenImg} alt="women" />
        </div>
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
