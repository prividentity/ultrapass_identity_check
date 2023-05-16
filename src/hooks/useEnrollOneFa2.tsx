// @ts-nocheck
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { enroll1FA } from "@privateid/cryptonets-web-sdk";

const useEnrollOneFa = (
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
  const [enrollPortrait, setEnrollPortrait] = useState("");

  let tries = 0;
  let showError = false;

  const enrollUserOneFa = async () => {
    setFaceDetected(false);
    setEnrollStatus(null);
    setProgress(0);
    setEnrollData(null);
    // eslint-disable-next-line no-unused-vars
    await enroll1FA(callback, {
      input_image_format: "rgba",
    });
  };

  const callback = async (result) => {
    // console.log("enroll callback hook result:", result);
    switch (result.status) {
      case "VALID_FACE":
        setFaceDetected(true);
        setEnrollStatus(null);
        setProgress(result.progress);
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
        setEnrollStatus(result.message);
        setFaceDetected(false);
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
          setEnrollPortrait(result.portrait);
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
  };
};

export default useEnrollOneFa;
