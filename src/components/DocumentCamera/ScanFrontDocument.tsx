import { useState } from "react";
import styles from "../../styles/Home.module.css";
import useScanFrontDocument from "../../hooks/useScanFrontDocument";
import Camera from "../Camera";

const ScanFrontDocument = ({
  onSuccess,
  onReadyCallback,
  onFailCallback,
  onCameraFail,
  userUUID,
}: {
  onSuccess: (e: any) => void;
  onReadyCallback: (e: boolean) => void;
  onFailCallback: (e: { status: string; message: string }) => void;
  onCameraFail: (e: any) => void;
  userUUID: string;
}) => {
  const [canvasSize, setCanvasSize] = useState();

  const handleFrontSuccess = (result?: any) => {
    onSuccess?.(result);
    console.log("FRONT SCAN DATA: ", result);
  };
  const { scanFrontDocument, resultResponse } = useScanFrontDocument(
    handleFrontSuccess,
    onFailCallback,
    userUUID
  ) as any;
  const handleCallbackFromCanvasSizeChange = (size: any) => {
    setCanvasSize(size);
    setTimeout(async () => scanFrontDocument(size as any), 1000);
  };

  const handleScanDLFront = async (e: boolean) => {
    onReadyCallback?.(e);
    // hack to initialize canvas with large memory, so it doesn't cause an issue.
    console.log("handleScanDLFront");
    if (e) {
      await scanFrontDocument(canvasSize);
    }
  };
  return (
    <div id="canvasInput" className={`${styles.container} documentCamera`}>
      <Camera
        handleCanvasSizeChange={handleCallbackFromCanvasSizeChange}
        // currentAction={"useScanDocumentFront"}
        onReadyCallback={handleScanDLFront}
        onSwitchCamera={handleScanDLFront}
        onCameraFail={onCameraFail}
        style={{ height: "unset" }}
        mode={"back"}
        requireHD={true}
        message={
          resultResponse?.op_status
            ? resultResponse?.op_message
            : resultResponse?.predict_message
        }
        isDocumentScan={true}
      ></Camera>
    </div>
  );
};

export default ScanFrontDocument;
