import { CircularProgress, MenuItem, Select } from "@mui/material";
import { switchCamera } from "@privateid/cryptonets-web-sdk-alpha";
import React, { useEffect, useState } from "react";
import { useCamera, useWasm } from "../../hooks";
import styles from "../../styles/Home.module.css";
import {
  CANVAS_SIZE,
  isAndroid,
  isBackCamera,
  isIOS,
  osVersion,
  WIDTH_TO_STANDARDS,
} from "../../utils";
import useCameraPermissions from "../../hooks/useCameraPermissions";

const Camera = ({
  children,
  handleCanvasSizeChange,
  currentAction,
  style,
  mode = "front",
  message,
  onReadyCallback = () => {},
  onSwitchCamera = () => {},
  onCameraFail = () => {},
  requireHD = false,
}: any) => {
  const { ready: wasmReady } = useWasm();
  const { isCameraGranted } = useCameraPermissions(onReadyCallback);
  const elementId = "userVideo";
  const { ready, init, device, devices } = useCamera(elementId, mode,requireHD, onCameraFail);

  const isBack = isBackCamera(devices, device) || mode === "back";

  const [deviceId, setDeviceId] = useState(device);
  const [devicesList] = useState(devices);
  const isDocumentScan = [
    "useScanDocumentFront",
    "useScanDocumentBack",
  ].includes(currentAction);

  useEffect(() => {
    if (!wasmReady) return;
    if (!ready) {
      init();
      return;
    }
    if (isIOS && osVersion < 15) {
      console.log("Does not support old version of iOS os version 15 below.");
    } else if (isAndroid && osVersion < 11) {
      console.log(
        "Does not support old version of Android os version 11 below."
      );
    }
    if (isCameraGranted && ready) {
      onReadyCallback(true);
    }
    console.log("--- wasm status ", ready);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wasmReady, ready, isCameraGranted]);



  const handleSwitchCamera = async (e: any) => {
    setDeviceId(e.target.value);
    const { settings = {} } = (await switchCamera(
      "front" as any,
      e.target.value
    )) as any;
    setTimeout(() => {
      onSwitchCamera(true);
    }, 1000);
    // setDeviceCapabilities(capabilities);
    // setDevicesList(devices.map(mapDevices));
    if (isDocumentScan) {
      let width = (WIDTH_TO_STANDARDS as any)[settings?.width];
      if (width === "FHD" && settings?.height === 1440) {
        width = "iPhoneCC";
      }
      await handleCanvasSize({ target: { value: width } }, true);
    }
  };

  const handleCanvasSize = async (e: any, skipSwitchCamera = false) => {
    // setCanvasSize(e.target.value);
    const canvasSize = (CANVAS_SIZE as any)[e.target.value];
    if (!skipSwitchCamera) {
      await switchCamera("front" as any, deviceId || device, canvasSize);
      // setDeviceCapabilities(capabilities);
    }
    handleCanvasSizeChange(e.target.value);
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
            {/* <select
              value={deviceId || device}
              onChange={(e) => handleSwitchCamera(e)}
            >
              {(devicesList?.length ? devicesList : devices).map(
                (e: { label: string; value: string }, index: number) => {
                  return (
                    <option id={e.value} value={e.value} key={index}>
                      {e.label}
                    </option>
                  );
                }
              )}
            </select> */}
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

        {/*{isDocumentScan && ready ? (*/}
        {/*  <div>*/}
        {/*    <label> Canvas Size: </label>*/}
        {/*    <select*/}
        {/*      defaultValue={initialCanvasSize}*/}
        {/*      value={canvasSize}*/}
        {/*      onChange={(e) => handleCanvasSize(e)}*/}
        {/*    >*/}
        {/*      {canvasSizeList.map(({ label, value }) => (*/}
        {/*        <option id={value} value={value} key={value}>*/}
        {/*          {label}*/}
        {/*        </option>*/}
        {/*      ))}*/}
        {/*    </select>*/}
        {/*  </div>*/}
        {/*) : null}*/}
      </div>
      {message && (
        <div className={styles.enrollDisplay}>
          <span> {message} </span>
        </div>
      )}
      <video
        id="userVideo"
        className={`
                ${styles.cameraDisplay} 
                ${isBack || isDocumentScan ? "" : styles.mirrored} videoCamera`}
        muted
        autoPlay
        playsInline
      />
      {children}
    </div>
  );
};

export default Camera;
