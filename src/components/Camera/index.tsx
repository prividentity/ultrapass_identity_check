import {
  Box,
  CircularProgress,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { switchCamera } from "@privateid/cryptonets-web-sdk";
import React, { useEffect, useState } from "react";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import useCamera, { setResolutionForIphoneCC } from "../../hooks/useCamera";
import useWasm from "../../hooks/useWasm";
import styles from "../../styles/Home.module.css";
import { isBackCamera, isIphoneCC } from "../../utils";
import useCameraPermissions from "../../hooks/useCameraPermissions";
import { useStyles } from "./styles";
import STEPS from "../../pages/register/steps";

export const SWITCH_DEVICE = "Switch Device";
const Camera = ({
  children,
  currentAction,
  style,
  mode = "front",
  message,
  onReadyCallback = () => {},
  onSwitchCamera = () => {},
  onCameraFail = () => {},
  onWasmLoadFail = () => {},
  requireHD = false,
  isDocumentScan = false,
  onCameraNotFullHd = () => {},
  otherDevice,
  setStep,
}: any) => {
  const { ready: wasmReady, wasmStatus } = useWasm();
  const { isCameraGranted } = useCameraPermissions(onReadyCallback);
  const elementId = "userVideo";
  const classes = useStyles();
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const { ready, init, device, devices, settings } = useCamera(
    elementId,
    mode,
    requireHD,
    onCameraFail,
    isDocumentScan
  );

  // console.log("CAMERA SETTING FROM APP", settings);

  useEffect(() => {
    // console.log(
    //   `CAMERA CHECKING IF FULL HD ${
    //     settings ? Math.max(settings.width, settings.height) : "qwe"
    //   }`
    // );
    if (settings && Math.max(settings.width, settings.height) < 1920) {
      // console.log("NOT FULL HD");
      // onCameraNotFullHd();
    }
  }, [onCameraNotFullHd, settings]);

  const [deviceId, setDeviceId] = useState(device);

  const isBack = isBackCamera(devices, deviceId || device) || mode === "back";
  const [devicesList] = useState(devices);
  const useDocumentScan = [
    "useScanDocumentFront",
    "useScanDocumentBack",
  ].includes(currentAction);

  useEffect(() => {
    // console.log("=====? HERE????", { wasmStatus, wasmReady, ready });

    if (!wasmReady && wasmStatus.isChecking) return;

    if (wasmReady && !wasmStatus.isChecking && wasmStatus.support) {
      // if(ready && wasmReady && wasmStatus.support && isCameraGranted) return;
      if (!ready) {
        init();
        return;
      } else if (isCameraGranted && ready) {
        onReadyCallback(true);
        return;
      }
    }

    if (!wasmReady && !wasmStatus.isChecking && !wasmStatus.support) {
      onWasmLoadFail();
      return;
    }

    // console.log("--- wasm status ", ready);
  }, [wasmReady, ready, wasmStatus]);

  const handleSwitchCamera = async (e: any) => {
    if (e.target.value === SWITCH_DEVICE) {
      setStep(STEPS?.SWITCH_DEVICE);
      return;
    }
    setDeviceId(e.target.value);
    // @ts-ignore
    const { capabilities } = await switchCamera(null, e.target.value);
    if (isIphoneCC(capabilities)) {
      await setResolutionForIphoneCC();
    }
    setTimeout(() => {
      onSwitchCamera(true);
    }, 3000);
  };

  return (
    <div
      className={styles.cameraContainer}
      style={style}
    >
      {!ready ? (
        <div className="overlayLoader">
          <CircularProgress />
        </div>
      ) : null}{" "}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {ready ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 2,
              width: "100%",
            }}
            className="mainCameraSelectWrap"
          >
            <label style={{ color: "#000", paddingRight: 5 }}>
              Select Camera:
            </label>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={deviceId || device}
              onChange={(e: any) => handleSwitchCamera(e)}
              className="cameraSelect"
            >
              {(devicesList?.length ? devicesList : devices).map(
                (e: { label: string; value: string }, index: number) => {
                  return (
                    <MenuItem id={e.value} value={e.value} key={index}>
                      {e.label}
                    </MenuItem>
                  );
                }
              )}
              <MenuItem value={SWITCH_DEVICE}>Switch Device</MenuItem>
            </Select>
          </div>
        ) : null}
      </div>
      {message && (
        <div
          className={styles.enrollDisplay}
        >
          <span> {message} </span>
        </div>
      )}
      {ready ? <div className={classes.documentBarCodeOverlay} /> : null}
      <video
        id="userVideo"
        className={`
                ${styles.cameraDisplay} 
                ${
                  isBack || useDocumentScan ? "" : styles.mirrored
                } videoCamera`}
        muted
        autoPlay
        playsInline
      />
      {children}
    </div>
  );
};

export default Camera;
