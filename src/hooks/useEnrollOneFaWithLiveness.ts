// @ts-nocheck
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { enroll1FA } from "@privateid/cryptonets-web-sdk-alpha";

const useEnrollOneFaWithLiveness = (
  element = "userVideo",
  onSuccess,
  retryTimes = 4,
  deviceId = null
) => {
  const [faceDetected, setFaceDetected] = useState(false);
  const [enrollStatus, setEnrollStatus] = useState(null);
  const [progress, setProgress] = useState(0);
  const [enrollData, setEnrollData] = useState(null);
  const [enrollGUID, setEnrollGUID] = useState(null);
  const [enrollUUID, setEnrollUUID] = useState(null);
  const [enrollPortrait, setEnrollPortrait] = useState<ImageData>();
  const [livenessCheckStatus, setLivenessCheckStatus] = useState(null);

  let tries = 0;
  let showError = false;

  const enrollUserOneFa = async () => {
    setFaceDetected(false);
    setEnrollStatus(null);
    setProgress(0);
    setEnrollData(null);
    // eslint-disable-next-line no-unused-vars
    try {
      const { imageData, height, width } = await enroll1FA(
        callback,
        {
          input_image_format: "rgba",
        },
        true
      );
      if (imageData && width && height) {
        setEnrollPortrait(new ImageData(imageData, width, height));
      }
    } catch (e) {
      enrollUserOneFa();
    }
  };

  const callback = async (result) => {
    // console.log("enroll callback hook result:", result);

    switch (result.status) {
      case "VALID_FACE":
        setFaceDetected(true);
        setEnrollStatus(null);
        setProgress(result.progress);
        setLivenessCheckStatus(result?.livenessCheck);
        break;
      case "INVALID_FACE":
        if (!showError) {
          showError = true;
          setEnrollStatus(result.message);
          setFaceDetected(false);
          setTimeout(() => {
            showError = false;
          }, 1000);
        }
        setEnrollStatus(
          result?.livenessCheck === -1 || result?.livenessCheck === 1
            ? "Face Not Found"
            : result.message
        );
        setFaceDetected(false);
        setLivenessCheckStatus(result?.livenessCheck);
        break;
      case "ENROLLING":
        setEnrollStatus("ENROLLING");
        setFaceDetected(true);
        break;
      case "WASM_RESPONSE":
        if (
          result.returnValue?.error === -1 ||
          result.returnValue?.error === -100 ||
          result.returnValue?.status === -1 ||
          result.returnValue?.status === -100
        ) {
          setEnrollStatus("ENROLL FAILED, PLEASE TRY AGAIN");
          enrollUserOneFa();
          return;
        }
        if (result.returnValue?.status === 0) {
          setEnrollStatus("ENROLL SUCCESS");
          setEnrollGUID(result.returnValue.PI.guid);
          setEnrollUUID(result.returnValue.PI.uuid);
          // setEnrollPortrait(result.portrait);
          setLivenessCheckStatus(0);
        }
        break;
      default:
    }
  };

  return {
    faceDetected,
    enrollStatus,
    enrollData,
    enrollUserOneFa,
    progress,
    enrollGUID,
    enrollUUID,
    enrollPortrait,
    livenessCheckStatus,
  };
};

export default useEnrollOneFaWithLiveness;
