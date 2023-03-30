import { SetStateAction, useEffect, useState } from "react";
import {
  convertCroppedImage,
  faceCompareLocal,
  isValidPhotoID,
} from "@privateid/cryptonets-web-sdk-alpha";
import { CANVAS_SIZE } from "../utils";
import { DocType } from "@privateid/cryptonets-web-sdk-alpha/dist/types";

const useScanFrontDocument = (
  onSuccess: ({
    croppedDocument,
    inputImage,
    croppedMugshot,
    portraitConfScore,
  }: {
    croppedDocument: string | null;
    inputImage: string | null;
    croppedMugshot: string | null;
    portraitConfScore: number;
  }) => void,
  onFailCallback: ({
    status,
    message,
  }: {
    status: string;
    message: string;
  }) => void,
  enrollImageData: ImageData
) => {
  const [isFound, setIsFound] = useState(false);
  const [resultStatus, setResultStatus] = useState(null);

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
    console.log("Front scan callback result:", result);
    setResultResponse(result.returnValue);
    if (result.returnValue.op_status === 0 || result.returnValue.op_status === 10 ) {
      const {
        predict_status,
        cropped_doc_height,
        cropped_doc_width,
        cropped_face_height,
        cropped_face_width,
      } = result.returnValue;

      if (
        result.returnValue.cropped_face_width &&
        result.returnValue.cropped_face_height
      ) {
        setIsFound(true);
        setResultStatus(predict_status);
        setCroppedDocumentWidth(cropped_doc_width);
        setCroppedDocumentHeight(cropped_doc_height);
        setCroppedMugshotWidth(cropped_face_width);
        setCroppedMugshotHeight(cropped_face_height);
      } else {
        setInputImageData(null);
        setCroppedDocumentRaw(null);
        setCroppedMugshotRaw(null);
        scanFrontDocument();
      }
    } else {
      setInputImageData(null);
      setCroppedDocumentRaw(null);
      setCroppedMugshotRaw(null);
      onFailCallback({
        status: result.returnValue.op_status.toString(),
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
    if (inputImageData && isFound && !inputImageBase64) {
      convertImageToBase64(
        inputImageData?.data,
        inputImageData?.width,
        inputImageData?.height,
        setInputImageBase64
      );
    }
  }, [inputImageData, isFound, inputImageBase64]);

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

  const faceCompareCallback = async (result: any) => {
    console.log("faceCompareCallback", result);
    const { conf_score } = result.returnValue;
    onSuccess({
      inputImage: inputImageBase64,
      croppedDocument: croppedDocumentBase64,
      croppedMugshot: croppedMugshotBase64,
      portraitConfScore: conf_score,
    });
  };

  // if all images are available and Document UUID available call onSuccess Callback
  useEffect(() => {
    if (
      isFound &&
      inputImageBase64 &&
      croppedDocumentBase64 &&
      croppedMugshotBase64
    ) {
      const mugshotImageData = new ImageData(
        // @ts-ignore
        croppedMugshotRaw,
        croppedMugshotWidth,
        croppedMugshotHeight
      );
      const doCompare = async () => {
        console.log("Doing compare of: ", {
          enrollImageData,
          mugshotImageData,
        });
        if (enrollImageData && mugshotImageData) {
          await faceCompareLocal(
            faceCompareCallback,
            enrollImageData,
            mugshotImageData,
            { input_image_format: "rgba" }
          );
        }
      };
      doCompare();
    }
  }, [
    isFound,
    inputImageBase64,
    croppedDocumentBase64,
    croppedMugshotBase64,
    croppedMugshotRaw,
    croppedMugshotWidth,
    croppedMugshotHeight,
    enrollImageData,
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
      false,
      undefined as any,
      {
        input_image_format: "rgba",
        // @ts-ignore
        threshold_user_right: 0.0,
        threshold_user_left: 1.0,
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
    resultResponse,
  };
};

export default useScanFrontDocument;
