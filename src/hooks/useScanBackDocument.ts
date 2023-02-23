import { SetStateAction, useEffect, useState } from "react";
import {
  convertCroppedImage,
  isValidPhotoID,
} from "@privateid/cryptonets-web-sdk-alpha";
import { CANVAS_SIZE } from "../utils";

const useScanBackDocument = (onSuccess: (e: any) => void) => {
  const [scannedCodeData, setScannedCodeData] = useState({});
  const [isFound, setIsFound] = useState(false);

  // raw byte
  const [inputImageData, setInputImageData] = useState<any>(null);
  const [croppedDocumentRaw, setCroppedDocumentRaw] = useState(null);
  const [croppedBarcodeRaw, setCroppedBarcodeRaw] = useState(null);

  // image width
  const [croppedDocumentWidth, setCroppedDocumentWidth] = useState(null);
  const [croppedBarcodeWidth, setCroppedBarcodeWidth] = useState(null);

  // image height
  const [croppedDocumentHeight, setCroppedDocumentHeight] = useState(null);
  const [croppedBarcodeHeight, setCroppedBarcodeHeight] = useState(null);

  // base64 image
  const [inputImageBase64, setInputImageBase64] = useState(null);
  const [croppedDocumentBase64, setCroppedDocumentBase64] = useState(null);
  const [croppedBarcodeBase64, setCroppedBarcodeBase64] = useState(null);

  const [barcodeStatusCode, setBarcodeStatusCode] = useState(null);

  const documentCallback = (result: any) => {
    if (result.status === "WASM_RESPONSE") {
      setBarcodeStatusCode(result.returnValue.op_status);
      if (result.returnValue.op_status === 0) {
        // onSuccess(result.returnValue);
        setScannedCodeData(result.returnValue)
        const {
          crop_doc_width,
          crop_doc_height,
          crop_barcode_width,
          crop_barcode_height,
        } = result.returnValue;
        setCroppedDocumentWidth(crop_doc_width);
        setCroppedDocumentHeight(crop_doc_height);
        setCroppedBarcodeWidth(crop_barcode_width);
        setCroppedBarcodeHeight(crop_barcode_height);
        setIsFound(true);
        return;
      } else {
        setCroppedDocumentWidth(null);
        setCroppedDocumentHeight(null);
        setCroppedBarcodeWidth(null);
        setCroppedBarcodeHeight(null);
      }
    }
    setCroppedBarcodeRaw(null);
    setCroppedDocumentRaw(null);
    setInputImageData(null);
    scanBackDocument();
  };

  const convertImageToBase64 = async (
    imageData: any,
    width: any,
    height: any,
    setState: SetStateAction<any>,
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

  // Converting Cropped Document
  useEffect(() => {
    if (
      isFound &&
      croppedDocumentRaw &&
      croppedDocumentWidth &&
      croppedDocumentHeight
    ) {
      convertImageToBase64(
        croppedDocumentRaw,
        croppedDocumentWidth,
        croppedDocumentHeight,
        setCroppedDocumentBase64
      );
    }
  }, [croppedDocumentRaw, croppedDocumentWidth, croppedDocumentHeight, isFound]);

  // Converting Cropped Barcode
  useEffect(() => {
    if (
      croppedBarcodeRaw &&
      croppedBarcodeWidth &&
      croppedBarcodeHeight &&
      isFound
    ) {
      convertImageToBase64(
        croppedBarcodeRaw,
        croppedBarcodeWidth,
        croppedBarcodeHeight,
        setCroppedBarcodeBase64
      );
    }
  }, [croppedBarcodeRaw, croppedBarcodeWidth, croppedBarcodeHeight, isFound]);


  // onSuccess Callback
  useEffect(() => {
    if (
      isFound &&
      inputImageBase64 &&
      croppedDocumentBase64 &&
      croppedBarcodeBase64 &&
      scannedCodeData
    ) {
      onSuccess({
        inputImage: inputImageBase64,
        croppedDocument: croppedDocumentBase64,
        croppedBarcode: croppedBarcodeBase64,
        barcodeData: scannedCodeData,
      });
    }
  }, [
    isFound,
    inputImageBase64,
    croppedDocumentBase64,
    croppedBarcodeBase64,
    scannedCodeData,
  ]);


  const scanBackDocument = async (canvasSize?: any) => {
    // if (canvasSize && canvasSize !== internalCanvasSize) {
    //   internalCanvasSize = canvasSize;
    // }
    const canvasObj = canvasSize
      ? CANVAS_SIZE?.[canvasSize as any]
      : // : internalCanvasSize
        // ? CANVAS_SIZE[internalCanvasSize]
        {};
    const { result, croppedBarcode, croppedDocument, imageData } =
      (await isValidPhotoID(
        "PHOTO_ID_BACK" as any,
        documentCallback,
        true,
        undefined as any,
        undefined,
        canvasObj
      )) as any;
    setCroppedDocumentRaw(croppedDocument);
    setCroppedBarcodeRaw(croppedBarcode);
    setInputImageData(imageData);
  };

  return {
    scanBackDocument,
    scannedCodeData,
    isFound,
    croppedDocumentBase64,
    croppedBarcodeBase64,
    barcodeStatusCode,
  };
};

export default useScanBackDocument;
