import { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import Camera from "../Camera";
import useScanBackDocument from "../../hooks/useScanBackDocument";

const ScanBackDocument = ({
  onSuccess,
  onReadyCallback,
  onFailCallback,
  onCameraFail,
  isBarcodeScan
}: {
  onSuccess?: (e: any) => void;
  onReadyCallback?: (e: boolean) => void;
  onFailCallback?: (e: boolean) => void;
  onCameraFail?: (e: any) => void;
  isBarcodeScan?: (e: boolean) => void;
}) => {
  const [canvasSize, setCanvasSize] = useState();

  // Scan Document Back
  const handleBackSuccess = (result: any) => {
    onSuccess?.(result);
  };
  const { scanBackDocument, recallCount } = useScanBackDocument(handleBackSuccess) as any;
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

  useEffect(() => {
    isBarcodeScan?.(recallCount > 15)
  }, [recallCount])

  return (
    <div id="canvasInput" className={`${styles.container} documentCamera`}>     
      <Camera
        handleCanvasSizeChange={handleCallbackFromCanvasSizeChange}
        onSwitchCamera={handleScanDocumentBack}
        onReadyCallback={handleScanDocumentBack}
        onCameraFail={onCameraFail}
        style={{ height: "unset" }}
        mode={"back"}
        requireHD={false}
        isBarCodeScan={recallCount > 15 && true}
      ></Camera>
    </div>
  );
};

export default ScanBackDocument;
