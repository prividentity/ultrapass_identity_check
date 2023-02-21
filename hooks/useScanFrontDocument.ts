import { useState } from "react";
import { isValidPhotoID } from "@privateid/cryptonets-web-sdk-alpha";
import { CANVAS_SIZE } from "../utils";
import { DocType } from "@privateid/cryptonets-web-sdk-alpha/dist/types";

const useScanFrontDocument = (onSuccess: (e: any) => void) => {
  const [isFound, setIsFound] = useState(false);
  const [resultStatus, setResultStatus] = useState(null);
  const [documentUUID, setDocumentUUID] = useState(null);
  const [documentGUID, setDocumentGUID] = useState(null);

  // confidence value
  const [resultResponse, setResultResponse] = useState(null);

  const documentCallback = (result: any) => {
    console.log("Front scan callback result:", result);
    setResultResponse(result.returnValue);
    if (
      result.returnValue.predict_status === 0 &&
      result.returnValue.op_status === 0
    ) {
      const { predict_status, uuid, guid } = result.returnValue;
      onSuccess(result.returnValue);
      setIsFound(true);
      setResultStatus(predict_status);
      setDocumentUUID(uuid);
      setDocumentGUID(guid);
    } else {
      scanFrontDocument();
    }
  };

  const scanFrontDocument = async (
    canvasSize?: any,
    initializeCanvas?: any
  ) => {
    const canvasObj = canvasSize ? CANVAS_SIZE?.[canvasSize] : {};
    const { result } = await isValidPhotoID(
      DocType.PHOTO_ID_FRONT,
      initializeCanvas || documentCallback,
      true,
      undefined as any,
      {
        input_image_format: "rgba",
      },
      canvasObj
    );
  };

  return {
    scanFrontDocument,
    isFound,
    setIsFound,
    resultStatus,
    documentUUID,
    documentGUID,
    resultResponse,
  };
};

export default useScanFrontDocument;
