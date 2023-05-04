import { SetStateAction, useEffect, useState } from "react";
import {
  convertCroppedImage,
  isValidPhotoID,
} from "@privateid/cryptonets-web-sdk-alpha";
import { CANVAS_SIZE } from "../utils";
import { DocType } from "@privateid/cryptonets-web-sdk-alpha/dist/types";

const useScanFrontDocument = (
  onSuccess: ({
    documentUUID,
    croppedDocument,
    inputImage,
    croppedMugshot,
  }: {
    documentUUID: string;
    croppedDocument: string;
    inputImage: string;
    croppedMugshot: string;
  }) => void,
  onFailCallback: ({
    status,
    message,
  }: {
    status: string;
    message: string;
  }) => void,
  userUUID: string
) => {
  const [isFound, setIsFound] = useState(false);
  const [resultStatus, setResultStatus] = useState(null);
  const [documentUUID, setDocumentUUID] = useState(null);
  const [documentGUID, setDocumentGUID] = useState(null);

  // raw byte
  const [inputImageData, setInputImageData] = useState<any>(null);
  const [croppedDocumentRaw, setCroppedDocumentRaw] = useState(null);
  const [croppedMugshotRaw, setCroppedMugshotRaw] = useState(null);

  // image width
  const [croppedDocumentWidth, setCroppedDocumentWidth] = useState(null);
  const [croppedMugshotWidth, setCroppedMugshotWidth] = useState(null);

  // image height
  const [croppedDocumentHeight, setCroppedDocumentHeight] = useState(null);
  const [croppedMugshotHeight, setCroppedMugshotHeight] = useState(null);

  // base64 image
  const [inputImageBase64, setInputImageBase64] = useState(null);
  const [croppedDocumentBase64, setCroppedDocumentBase64] = useState(null);
  const [croppedMugshotBase64, setCroppedMugshotBase64] = useState(null);

  // confidence value
  const [resultResponse, setResultResponse] = useState(null);

  const documentCallback = (result: any) => {
    // console.log("Front scan callback result:", result);
    setResultResponse(result.returnValue);
    if (
      result.returnValue.predict_status === 0 &&
      result.returnValue.op_status === 0
    ) {
      const {
        predict_status,
        uuid,
        guid,
        cropped_doc_height,
        cropped_doc_width,
        cropped_face_height,
        cropped_face_width,
      } = result.returnValue;
      // onSuccess(result.returnValue);

      if (userUUID === uuid) {
        setIsFound(true);
        setResultStatus(predict_status);
        setDocumentUUID(uuid);
        setDocumentGUID(guid);
        setCroppedDocumentWidth(cropped_doc_width);
        setCroppedDocumentHeight(cropped_doc_height);
        setCroppedMugshotWidth(cropped_face_width);
        setCroppedMugshotHeight(cropped_face_height);
      }
      else{
        onFailCallback({
          status: "-100",
          message: "Document UUID and Face UUID Does not match."
        });
        scanFrontDocument();
      }
    } else {
      onFailCallback({
        status:
          result.returnValue.op_status.toString() || result.returnValue.predict_status.toString(),
        message: result.returnValue.op_message,
      });
      scanFrontDocument();
    }
  };

  const convertImageToBase64 = async (
    imageData: any,
    width: any,
    height: any,
    setState: SetStateAction<any>
  ) => {
    if (imageData.length === width * height * 4) {
      const imageBase64 = await convertCroppedImage(imageData, width, height);
      setState(imageBase64);
    }
  };

  // Converting imageInput
  useEffect(() => {
    if (inputImageData && isFound) {
      convertImageToBase64(
        inputImageData?.data,
        inputImageData?.width,
        inputImageData?.height,
        setInputImageBase64
      );
    }
  }, [inputImageData, isFound]);

  // Converting croppedDocument
  useEffect(() => {
    if (
      isFound &&
      croppedDocumentRaw &&
      croppedDocumentWidth &&
      croppedMugshotHeight
    ) {
      convertImageToBase64(
        croppedDocumentRaw,
        croppedDocumentWidth,
        croppedDocumentHeight,
        setCroppedDocumentBase64
      );
    }
  }, [croppedDocumentRaw, croppedDocumentWidth, croppedMugshotHeight, isFound]);

  // Converting croppedMugshot
  useEffect(() => {
    if (
      croppedMugshotRaw &&
      croppedMugshotWidth &&
      croppedMugshotHeight &&
      isFound
    ) {
      convertImageToBase64(
        croppedMugshotRaw,
        croppedMugshotWidth,
        croppedMugshotHeight,
        setCroppedMugshotBase64
      );
    }
  }, [croppedMugshotRaw, croppedMugshotWidth, croppedMugshotHeight, isFound]);

  // if all images are available and Document UUID available call onSuccess Callback
  useEffect(() => {
    if (
      isFound &&
      inputImageBase64 &&
      croppedDocumentBase64 &&
      croppedMugshotBase64 &&
      documentUUID
    ) {
      onSuccess({
        inputImage: inputImageBase64,
        croppedDocument: croppedDocumentBase64,
        croppedMugshot: croppedMugshotBase64,
        documentUUID,
      });
    }
  }, [
    isFound,
    inputImageBase64,
    croppedDocumentBase64,
    croppedMugshotBase64,
    documentUUID,
  ]);

  const scanFrontDocument = async (
    canvasSize?: any,
    initializeCanvas?: any
  ) => {
    const canvasObj = canvasSize ? CANVAS_SIZE?.[canvasSize] : {};
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result: any = await isValidPhotoID(
      DocType.PHOTO_ID_FRONT,
      initializeCanvas || documentCallback,
      true,
      undefined as any,
      {
        input_image_format: "rgba",
      },
      canvasObj
    );
    const { imageData, croppedDocument, croppedMugshot } = result;
    setInputImageData(imageData);
    setCroppedDocumentRaw(croppedDocument);
    setCroppedMugshotRaw(croppedMugshot);
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
