import { useState } from "react";
import { enroll1FA } from "@privateid/cryptonets-web-sdk";

const useEnrollOneFa = (
  element = "userVideo",
  onSuccess = (e: string) => {},
  retryTimes = 4
) => {
  const [faceDetected, setFaceDetected] = useState(false);
  const [enrollStatus, setEnrollStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [enrollData, setEnrollData] = useState(null);

  let tries = 0;

  const enrollUserOneFa = async () => {
    setFaceDetected(false);
    setEnrollStatus("");
    setProgress(0);
    setEnrollData(null);
    // eslint-disable-next-line no-unused-vars
    await enroll1FA(callback, {
      input_image_format: "rgba",
    } as any);
  };

  function wait(milliseconds: number) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  const getDisplayedMessage = (result: number) => {
    switch (result) {
      case -100:
        return "Invalid Image";
      case -1:
        return "No Face Detected";
      case 0:
        return "Face detected";
      case 1:
        return "Image Spoof";
      case 2:
        return "Video Spoof";
      case 3:
        return "Too close";
      case 4:
        return "Too far away";
      case 5:
        return "Too far to right";
      case 6:
        return "Too far to left";
      case 7:
        return "Too far up";
      case 8:
        return "Too far down";
      case 9:
        return "Too blurry";
      case 10:
        return "Remove Glasses";
      case 11:
        return "PLEASE REMOVE FACEMASK";
      case 12:
        return "Chin too far left";
      case 13:
        return "Chin too far right";
      case 14:
        return "Tilt camera down level to face"; // (Chin down)
      case 15:
        return "Tilt camera up level to face"; //(Chin up)
      default:
        return "";
    }
  };

  const callback = async (result: any) => {
    // console.log("enroll callback hook result:", result);
    switch (result.status) {
      case "VALID_FACE":
        setFaceDetected(true);
        setEnrollStatus("");
        setProgress(result.progress);
        break;
      case "INVALID_FACE":
        if (enrollStatus && enrollStatus?.length > 0) {
          wait(500);
          setEnrollStatus(
            result?.message || getDisplayedMessage(result.result)
          );
        } else {
          setEnrollStatus(
            result?.message || getDisplayedMessage(result.result)
          );
        }
        setFaceDetected(false);
        break;
      case "ENROLLING":
        setEnrollStatus("Verifying");
        setFaceDetected(true);
        break;
      case "WASM_RESPONSE":
        if(result.returnValue?.error === -1 || result.returnValue?.error === -100 || result.returnValue?.status === -1 || result.returnValue?.status === -100) {
          setEnrollStatus("ENROLL FAILED, PLEASE TRY AGAIN");
          enrollUserOneFa();
          return
        }
        if (result.returnValue?.status === 0) {
          setEnrollStatus("Verify Success");
          setEnrollData(result.returnValue);
          onSuccess(result?.returnValue);
        }
        // if (result.returnValue?.status === -1) {
        //   if (tries === retryTimes) {
        //     // onFailure();
        //   } else {
        //     tries += 1;
        //     // enrollUserOneFa();
        //   }
        // }
        break;
      default:
    }
  };

  return { faceDetected, enrollStatus, enrollData, enrollUserOneFa, progress };
};

export default useEnrollOneFa;
