/* eslint-disable */
import { useState } from "react";
import { openCamera } from "@privateid/cryptonets-web-sdk-alpha";
import {isMobile, mapDevices} from "../utils";
import { CameraFaceMode } from "@privateid/cryptonets-web-sdk-alpha/dist/types";

const useCamera = (
  element = "userVideo",
  requestFaceMode: CameraFaceMode = CameraFaceMode.front,
  requireHD= false
): {
  init: () => Promise<void>;
  devices: Array<{ label: string; value: string }>;
  ready: boolean;
  faceMode: any;
  device: string;
  setDevice: (value: ((prevState: string) => string) | string) => void;
  settings?: any;
  capabilities?: any;
} => {
  // Initialize the state
  const [ready, setReady] = useState(false);
  const [devices, setDevices] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [device, setDevice] = useState("");
  const [faceMode, setFaceMode] = useState<any>(null);
  const [cameraFeatures, setCameraFeatures] = useState({});
  const resolution = isMobile ? {width: 1600, height:1200} : undefined;
  const init = async () => {
    if (ready) return;
    try {
      const {
        devices = [],
        faceMode,
        settings,
        status,
        stream,
        errorMessage,
        capabilities,
      } = await openCamera(element, requireHD, null, requestFaceMode, resolution);
      setCameraFeatures({ settings, capabilities });
      setFaceMode(faceMode);
      console.log("hasError??", { status, errorMessage });
      if (Array.isArray(devices) && devices?.length > 0) {
        const options = devices?.map(mapDevices);
        setDevices(options);
        setDevice(settings?.deviceId as string);
      }
      setReady(true);
    } catch (e) {
      console.log("Error Message", e);
    }
    const setCameraFocus = async () => {
      try {
        const video = document.getElementById("userVideo") as any;
        const mediaStream = video.srcObject;
        const track = await mediaStream.getTracks()[0];
        const capabilities = track.getCapabilities();
        if (typeof capabilities.focusDistance !== "undefined") {
          await track.applyConstraints({
            advanced: [
              {
                focusMode: capabilities.focusMode.includes("continuous")
                  ? "continuous"
                  : "manual",
                focusDistance: 100,
              },
            ],
          });
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    };
    await setCameraFocus();
  };

  return {
    ready,
    init,
    devices,
    device,
    setDevice,
    faceMode,
    ...cameraFeatures,
  };
};

export default useCamera;
