import { useEffect, useState } from "react";
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
  setOpStatus
}: {
  onSuccess: (e: any) => void;
  onReadyCallback: (e: boolean) => void;
  onFailCallback: (e: { status: string; message: string }) => void;
  onCameraFail: (e: any) => void;
  enrollImageData: any;
  setOpStatus: (e: number) => void;
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [canvasSize, setCanvasSize] = useState();

  const handleFrontSuccess = (result?: any) => {
    const compareScore = result?.portraitConfScore
    if (compareScore > 0.3) {
      setErrorMessage('Rescan front of driver’s license')
      setTimeout(() => handleScanDLFront(true), 2000)
    } else {
      setErrorMessage('');
      onSuccess?.(result);
    }
    console.log("FRONT SCAN DATA: ", result);
  };
  const { scanFrontDocument, resultResponse } =
    useScanFrontDocumentWithoutPredict(
      handleFrontSuccess,
      onFailCallback,
      enrollImageData
    ) as any;
  useEffect(() => {
    setOpStatus(resultResponse?.op_status)
  }, [resultResponse])

  const handleScanDLFront = async (e: boolean) => {
    onReadyCallback?.(e);
    // hack to initialize canvas with large memory, so it doesn't cause an issue.
    console.log("handleScanDLFront", e);
    if (e) {
      await scanFrontDocument();
    }
  };

  const returnMessage = () => {
    return errorMessage || (resultResponse?.op_status === 0 && !resultResponse?.cropped_face_width ? getScanFrontMessage(999) :getScanFrontMessage(resultResponse?.op_status));
  }
  return (
    <div id="canvasInput" className={`${styles.container} documentCamera`}>
      <Camera
        onReadyCallback={handleScanDLFront}
        onSwitchCamera={handleScanDLFront}
        onCameraFail={onCameraFail}
        style={{ height: "unset" }}
        mode={"back"}
        requireHD={true}
        message={
          returnMessage()
        }
        isDocumentScan={true}
      ></Camera>
    </div>
  );
};

export default FaceCompareFrontDocument;
