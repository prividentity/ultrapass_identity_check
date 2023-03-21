import { CircularProgress, MenuItem, Select } from "@mui/material";
import { switchCamera } from "@privateid/cryptonets-web-sdk-alpha";
import React, { useEffect, useState } from "react";
import useCamera from "../../hooks/useCamera";
import useWasm from "../../hooks/useWasm";
import styles from "../../styles/Home.module.css";
import { isBackCamera } from "../../utils";
import useCameraPermissions from "../../hooks/useCameraPermissions";
import { useStyles } from "./styles";

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
}: any) => {
  const { ready: wasmReady, wasmStatus } = useWasm();
  const { isCameraGranted } = useCameraPermissions(onReadyCallback);
  const elementId = "userVideo";
  const classes = useStyles();
  const { ready, init, device, devices } = useCamera(
    elementId,
    mode,
    requireHD,
    onCameraFail,
    isDocumentScan
  );

  const [deviceId, setDeviceId] = useState(device);

  const isBack = isBackCamera(devices, deviceId || device) || mode === "back";
  const [devicesList] = useState(devices);
  const useDocumentScan = [
    "useScanDocumentFront",
    "useScanDocumentBack",
  ].includes(currentAction);

  useEffect(() => {
    console.log("=====? HERE????", { wasmStatus, wasmReady, ready });

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

    console.log("--- wasm status ", ready);
  }, [wasmReady, ready, wasmStatus]);

  const handleSwitchCamera = async (e: any) => {
    setDeviceId(e.target.value);
    await switchCamera(
      null,
      e.target.value
    );
    setTimeout(() => {
      onSwitchCamera(true);
    }, 1000);
  };

  return (
    <div className={styles.cameraContainer} style={style}>
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
            </Select>
          </div>
        ) : null}
      </div>
      {message && (
        <div className={styles.enrollDisplay}>
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
