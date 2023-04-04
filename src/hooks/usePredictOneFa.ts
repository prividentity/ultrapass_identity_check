import { useState } from "react";
import { predict1FA } from "@privateid/cryptonets-web-sdk-alpha";

const usePredictOneFa = (
  element = "userVideo",
  onSuccess: (e: any) => void,
  retryTimes = 3,
  deviceId = "",
  isInitialPredict = true
) => {
  const [predictOneFaaceDetected, setFaceDetected] = useState(false);
  const [predictOneFaStatus, setPredictStatus] = useState(null);
  const [predictOneFaData, setPredictData] = useState(null);
  const [predictMessage, setPredictMessage] = useState("");
  let tries = 0;

  const predictUserOneFa = async () => {
    setFaceDetected(false);
    setPredictData(null);
    // eslint-disable-next-line no-unused-vars
    await predict1FA(callback, {
      input_image_format: "rgba",
    });
  };

  const callback = async (result: any) => {
    // console.log("predict callback hook result:", result, tries, retryTimes);
    switch (result.status) {
      case "WASM_RESPONSE":
        if (result.returnValue?.status === 0) {
          const { message } = result.returnValue;
          setPredictMessage(message);
          setPredictData(result.returnValue);
          onSuccess(result.returnValue);
          tries = 0;
          setFaceDetected(true);
        }
        if (result.returnValue?.status !== 0) {
          if (tries === retryTimes) {
            // console.log({ tries, retryTimes });
            onSuccess(result.returnValue);
            tries = 0;
            // onFailure();
          } else {
            tries += 1;
            if (!predictOneFaaceDetected && !isInitialPredict) {
              tries -= 1;
            }
            predictUserOneFa();
          }
          const { validation_status, message } = result.returnValue;
          setPredictMessage(message);
          let hasValidFace = false;
          for (let i = 0; validation_status.length > i; i++) {
            if (validation_status[i].status === 0) {
              hasValidFace = true;
              i = validation_status.length;
            }
          }
          setFaceDetected(hasValidFace);
          setPredictStatus(null);
        }
        break;
      default:
    }
  };

  return {
    predictOneFaaceDetected,
    predictOneFaStatus,
    predictOneFaData,
    predictUserOneFa,
    predictMessage,
  };
};

export default usePredictOneFa;
