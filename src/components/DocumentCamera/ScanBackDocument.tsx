import { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import Camera from "../Camera";
import useScanBackDocument from "../../hooks/useScanBackDocument";
import { getBackDocumentMessage, getScanBackColor } from "../../constants";
import Card from "../../assets/card.svg";

const ScanBackDocument = ({
  onSuccess,
  onReadyCallback,
  onFailCallback,
  onCameraFail,
  onCameraNotFullHd,
  setOpStatus,
  setStep
}: {
  onSuccess?: (e: any) => void;
  onReadyCallback?: (e: boolean) => void;
  onFailCallback?: (e: boolean) => void;
  onCameraFail?: (e: any) => void;
  onCameraNotFullHd?: (e: any) => void;
  setOpStatus?: (e: number) => void;
  setStep?: () => void;
}) => {
  const [canvasSize, setCanvasSize] = useState();
  const [isReady, setIsReady] = useState(false);

  // Scan Document Back
  const handleBackSuccess = (result: any) => {
    onSuccess?.(result);
  };
  const { scanBackDocument, barcodeStatusCode, scannedCodeData } = useScanBackDocument(
    handleBackSuccess
  ) as any;
  const handleScanDocumentBack = async (e: boolean) => {
    setIsReady(e);
    onReadyCallback?.(e);
    if (e) {
      await scanBackDocument(canvasSize);
    }
  };
  useEffect(() => (
    setOpStatus?.(scannedCodeData?.op_status)
  ), [scannedCodeData])

  const handleCallbackFromCanvasSizeChange = (size: any) => {
    setCanvasSize(size);
    setTimeout(async () => scanBackDocument(size), 1000);
  };

  return (
    <div id="canvasInput" className={`${styles.container} documentCamera`}>
      {isReady && (
        <>
          <div
            className={styles.cameraFrame}
            style={{
              borderColor: getScanBackColor(barcodeStatusCode),
            }}
          >
            <img src={Card} alt="" />
          </div>
          <div className={styles.cameraFrameOuter} />
        </>
      )}
      <Camera
        handleCanvasSizeChange={handleCallbackFromCanvasSizeChange}
        onSwitchCamera={()=>{}}
        onReadyCallback={handleScanDocumentBack}
        onCameraFail={onCameraFail}
        style={{ height: "unset" }}
        mode={"back"}
        requireHD={true}
        message={getBackDocumentMessage(barcodeStatusCode)}
        isDocumentScan={true}
        onCameraNotFullHd={onCameraNotFullHd}
        setStep={setStep}
      ></Camera>
    </div>
  );
};

export default ScanBackDocument;
