/* eslint-disable */
import { useState } from "react";
import { openCamera } from "@privateid/cryptonets-web-sdk";
import { isIphoneCC, mapDevices } from "../utils";
import { CameraFaceMode } from "@privateid/cryptonets-web-sdk/dist/types";

const useCamera = (
  element = "userVideo",
  requestFaceMode: CameraFaceMode = CameraFaceMode.front,
  requireHD = false,
  onCameraFail = () => {},
  isDocumentScan = false
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
  const enableHDMode = requireHD;
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
      } = await openCamera(
        element,
        enableHDMode,
        null,
        requestFaceMode,
        null,
        isDocumentScan
      );
      if (isIphoneCC(capabilities)) {
        await setResolutionForIphoneCC();
      }

      setCameraFeatures({ settings, capabilities });
      setFaceMode(faceMode);
      if (Array.isArray(devices) && devices?.length > 0) {
        const options = devices?.map(mapDevices);
        setDevices(options);
        setDevice(settings?.deviceId as string);
      }

      if (devices?.length === 0) {
        onCameraFail();
        console.log("no camera");
      } else {
        setReady(true);
      }
    } catch (e) {
      onCameraFail();
      console.log("Error Message", e);
    }

    // const setCameraFocus = async () => {
    //   try {
    //     const video = document.getElementById("userVideo") as any;
    //     const mediaStream = video.srcObject;
    //     const track = await mediaStream.getTracks()[0];
    //     const capabilities = track.getCapabilities();
    //     if (typeof capabilities.focusDistance !== "undefined") {
    //       await track.applyConstraints({
    //         advanced: [
    //           {
    //             focusMode: capabilities.focusMode.includes("continuous")
    //               ? "continuous"
    //               : "manual",
    //             focusDistance: Math.min(capabilities.focusDistance.max, 100),
    //           },
    //         ],
    //       });
    //     }
    //   } catch (e) {
    //     // eslint-disable-next-line no-console
    //     console.log(e);
    //   }
    // };
    // await setCameraFocus();
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

export const setResolutionForIphoneCC = async () => {
  const video = document.getElementById("userVideo") as any;
  const mediaStream = video.srcObject;
  const track = await mediaStream.getTracks()[0];
  const capabilities = track.getCapabilities() ? track.getCapabilities() : null;
  if (
    capabilities &&
    capabilities?.height?.max === 1440 &&
    capabilities?.width?.max === 1920
  ) {
    console.log("SET CONFIGURATION FOR IPHONE CC");
    await track.applyConstraints({
      advanced: [
        {
          width: 1920,
          height: 1440,
        },
      ],
    });
  }
};

export default useCamera;
