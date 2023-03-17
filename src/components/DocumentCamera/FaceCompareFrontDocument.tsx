import { useState } from "react";
import styles from "../../styles/Home.module.css";
import useScanFrontDocumentWithoutPredict from "../../hooks/useScanFrontDocumentWithoutPredict";
import Camera from "../Camera";
import { getScanFrontMessage } from "../../constants";

const FaceCompareFrontDocument = ({
  onSuccess,
  onReadyCallback,
  onFailCallback,
  onCameraFail,
  enrollImageData,
}: {
  onSuccess: (e: any) => void;
  onReadyCallback: (e: boolean) => void;
  onFailCallback: (e: { status: string; message: string }) => void;
  onCameraFail: (e: any) => void;
  enrollImageData: any;
}) => {
  const [canvasSize, setCanvasSize] = useState();

  const handleFrontSuccess = (result?: any) => {
    onSuccess?.(result);
    console.log("FRONT SCAN DATA: ", result);
  };
  const { scanFrontDocument, resultResponse } =
    useScanFrontDocumentWithoutPredict(
      handleFrontSuccess,
      onFailCallback,
      enrollImageData
    ) as any;
  const handleCallbackFromCanvasSizeChange = (size: any) => {
    setCanvasSize(size);
    setTimeout(async () => scanFrontDocument(size as any), 1000);
  };

  const handleScanDLFront = async (e: boolean) => {
    onReadyCallback?.(e);
    // hack to initialize canvas with large memory, so it doesn't cause an issue.
    console.log("handleScanDLFront", e);
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
        message={() => {
          if (
            resultResponse?.op_status === 0 &&
            !resultResponse?.cropped_face_width
          ) {
            getScanFrontMessage(999);
          } else {
            getScanFrontMessage(resultResponse?.op_status);
          }
        }}
      ></Camera>
    </div>
  );
};

export default FaceCompareFrontDocument;
