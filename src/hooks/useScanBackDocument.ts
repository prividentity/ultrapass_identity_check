import { SetStateAction, useEffect, useState } from "react";
import {
  convertCroppedImage,
  isValidPhotoID,
} from "@privateid/cryptonets-web-sdk-alpha";
import { CANVAS_SIZE } from "../utils";
import Rerun from "../utils/reRuncheck";

const useScanBackDocument = (onSuccess: (e: any) => void) => {
  const [scannedCodeData, setScannedCodeData] = useState<any>({});
  const [isFound, setIsFound] = useState(false);

  // raw byte
  const [inputImageData, setInputImageData] = useState<any>(null);
  const [croppedDocumentRaw, setCroppedDocumentRaw] = useState(null);
  const [croppedBarcodeRaw, setCroppedBarcodeRaw] = useState(null);

  // base64 image
  const [inputImageBase64, setInputImageBase64] = useState(null);
  const [croppedDocumentBase64, setCroppedDocumentBase64] = useState(null);
  const [croppedBarcodeBase64, setCroppedBarcodeBase64] = useState(null);

  const [barcodeStatusCode, setBarcodeStatusCode] = useState(null);

  const documentCallback = (result: any) => {
    console.log("document front BE: ", result);
    RerunAction.RerunAction = false
    if (result.status === "WASM_RESPONSE") {
      setBarcodeStatusCode(result.returnValue.op_status);
      if (result.returnValue.op_status === 0) {
        RerunAction.clearCheck();
        // onSuccess(result.returnValue);
        setScannedCodeData(result.returnValue);
        setIsFound(true);
        return;
      } else {
        setScannedCodeData({});
        setIsFound(false);
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
        inputImageData,
        scannedCodeData?.image_width,
        scannedCodeData?.image_height,
        setInputImageBase64
      );
    }
  }, [inputImageData, scannedCodeData?.image_width, isFound]);

  // Converting Cropped Document
  useEffect(() => {
    if (
      isFound &&
      croppedDocumentRaw &&
      scannedCodeData?.crop_doc_width &&
      scannedCodeData?.crop_doc_height
    ) {
      convertImageToBase64(
        croppedDocumentRaw,
        scannedCodeData?.crop_doc_width,
        scannedCodeData?.crop_doc_height,
        setCroppedDocumentBase64
      );
    }
  }, [croppedDocumentRaw, scannedCodeData?.crop_doc_width, isFound]);

  // Converting Cropped Barcode
  useEffect(() => {
    if (
      croppedBarcodeRaw &&
      scannedCodeData?.crop_barcode_width &&
      scannedCodeData?.crop_barcode_height &&
      isFound
    ) {
      convertImageToBase64(
        croppedBarcodeRaw,
        scannedCodeData?.crop_barcode_width,
        scannedCodeData?.crop_barcode_height,
        setCroppedBarcodeBase64
      );
    }
  }, [croppedBarcodeRaw, scannedCodeData?.crop_barcode_width, isFound]);

  // onSuccess Callback
  useEffect(() => {
    if (
      isFound &&
      inputImageBase64 &&
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
    scannedCodeData?.crop_barcode_width,
  ]);


  const scanBackDocument = async (canvasSize?: any) => {
    RerunAction.doInterval();
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
        // @ts-ignore
        { document_scan_barcode_only: true },
        canvasObj
      )) as any;
    if(croppedDocument && croppedBarcode && imageData){
      setCroppedDocumentRaw(croppedDocument);
      setCroppedBarcodeRaw(croppedBarcode);
      setInputImageData(imageData);
    }
  };
  const RerunAction = new Rerun(scanBackDocument);

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
