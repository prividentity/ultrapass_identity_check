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

  // base64 image
  const [inputImageBase64, setInputImageBase64] = useState(null);
  const [croppedDocumentBase64, setCroppedDocumentBase64] = useState(null);
  const [croppedMugshotBase64, setCroppedMugshotBase64] = useState(null);

  // confidence value
  const [resultResponse, setResultResponse] = useState(null);
  const [returnValue, setResultValue] = useState<any>({});
  const documentCallback = (result: any) => {
    setResultResponse(result.returnValue);
    if (
      result.returnValue.op_status === 0 ||
      result.returnValue.op_status === 10
    ) {
      const { predict_status } = result.returnValue;

      if (
        result.returnValue.cropped_face_width &&
        result.returnValue.cropped_face_height
      ) {
        setIsFound(true);
        setResultStatus(predict_status);
        setResultValue(result.returnValue);
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
    try {
      if (imageData.length === width * height * 4) {
        const imageBase64 = await convertCroppedImage(imageData, width, height);
        setState(imageBase64);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Converting imageInput
  useEffect(() => {
    if (inputImageData && isFound && returnValue?.image_width) {
      convertImageToBase64(
        inputImageData,
        returnValue?.image_width,
        returnValue?.image_height,
        setInputImageBase64
      );
    }
  }, [inputImageData, isFound, returnValue?.image_width]);

  // Converting croppedDocument
  useEffect(() => {
    if (isFound && croppedDocumentRaw && returnValue?.cropped_doc_width) {
      convertImageToBase64(
        croppedDocumentRaw,
        returnValue?.cropped_doc_width,
        returnValue?.cropped_doc_height,
        setCroppedDocumentBase64
      );
    }
  }, [croppedDocumentRaw, returnValue?.cropped_doc_width, isFound]);

  // Converting croppedMugshot
  useEffect(() => {
    if (croppedMugshotRaw && returnValue?.cropped_face_width && isFound) {
      convertImageToBase64(
        croppedMugshotRaw,
        returnValue?.cropped_face_width,
        returnValue?.cropped_face_height,
        setCroppedMugshotBase64
      );
    }
  }, [croppedMugshotRaw, returnValue?.cropped_face_width, isFound]);

  const faceCompareCallback = async (result: any) => {
    // console.log("faceCompareCallback", result);
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
        returnValue?.cropped_face_width,
        returnValue?.cropped_face_height
      );
      const doCompare = async () => {
        // console.log("Doing compare of: ", {
        //   enrollImageData,
        //   mugshotImageData,
        // });
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
    returnValue?.cropped_face_width,
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
      undefined,
      {
        input_image_format: "rgba",
      },
      canvasObj
    );
    try {
      const { imageData, croppedDocument, croppedMugshot } = result;
      if (imageData && croppedDocument && croppedMugshot) {
        setInputImageData(imageData);
        setCroppedDocumentRaw(croppedDocument);
        setCroppedMugshotRaw(croppedMugshot);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const reScanFrontDocument = () => {
    setInputImageData(null);
    setCroppedDocumentRaw(null);
    setCroppedMugshotRaw(null);
    setInputImageBase64(null);
    setCroppedDocumentBase64(null);
    setCroppedMugshotBase64(null);
    setResultValue({});
    scanFrontDocument();
  };

  return {
    scanFrontDocument,
    isFound,
    setIsFound,
    resultStatus,
    resultResponse,
    reScanFrontDocument,
  };
};

export default useScanFrontDocument;
