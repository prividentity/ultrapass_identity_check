import { useState } from "react";
import styles from "../../styles/Home.module.css";
import Camera from "../Camera";
import useScanBackDocument from "../../hooks/useScanBackDocument";
import { getBackDocumentMessage } from "../../constants";

const ScanBackDocument = ({
  onSuccess,
  onReadyCallback,
  onFailCallback,
  onCameraFail,
  onCameraNotFullHd,
}: {
  onSuccess?: (e: any) => void;
  onReadyCallback?: (e: boolean) => void;
  onFailCallback?: (e: boolean) => void;
  onCameraFail?: (e: any) => void;
  onCameraNotFullHd?: (e: any) => void;
}) => {
  const [canvasSize, setCanvasSize] = useState();

  // Scan Document Back
  const handleBackSuccess = (result: any) => {
    onSuccess?.(result);
  };
  const { scanBackDocument, barcodeStatusCode } = useScanBackDocument(
    handleBackSuccess
  ) as any;
  const handleScanDocumentBack = async (e: boolean) => {
    onReadyCallback?.(e);
    if (e) {
      await scanBackDocument(canvasSize);
    }
  };

  const handleCallbackFromCanvasSizeChange = (size: any) => {
    setCanvasSize(size);
    setTimeout(async () => scanBackDocument(size), 1000);
  };

  return (
    <div id="canvasInput" className={`${styles.container} documentCamera`}>
      <Camera
        handleCanvasSizeChange={handleCallbackFromCanvasSizeChange}
        onSwitchCamera={handleScanDocumentBack}
        onReadyCallback={handleScanDocumentBack}
        onCameraFail={onCameraFail}
        style={{ height: "unset" }}
        mode={"back"}
        requireHD={true}
        message={getBackDocumentMessage(barcodeStatusCode)}
        isDocumentScan={true}
        onCameraNotFullHd={onCameraNotFullHd}
      ></Camera>
    </div>
  );
};

export default ScanBackDocument;
