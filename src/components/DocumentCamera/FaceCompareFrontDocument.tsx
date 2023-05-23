import { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import useScanFrontDocumentWithoutPredict from "../../hooks/useScanFrontDocumentWithoutPredict";
import Camera from "../Camera";
import { getScanFrontColor, getScanFrontMessage } from "../../constants";
import useToast from "../../utils/useToast";
import Card from "../../assets/card.svg";

const FaceCompareFrontDocument = ({
  onSuccess,
  onReadyCallback,
  onFailCallback,
  onCameraFail,
  enrollImageData,
  setOpStatus,
  setStep
}: {
  onSuccess: (e: any) => void;
  onReadyCallback: (e: boolean) => void;
  onFailCallback: (e: { status: string; message: string }) => void;
  onCameraFail: (e: any) => void;
  enrollImageData: any;
  setOpStatus: (e: number) => void;
  setStep: () => void;
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [canvasSize, setCanvasSize] = useState();
  const [isReady, setIsReady] = useState(false);
  const { showToast } = useToast();
  const handleFrontSuccess = (result?: any) => {
    // const compareScore = result?.portraitConfScore;
    // if (compareScore > 0.3) {
    //   showToast("Face and DL Mugshot didn't match. Please try again.", "error");
    //   setTimeout(() => reScanFrontDocument(), 2000);
    // } else {
      setErrorMessage("");
      onSuccess?.(result);
    // }
    console.log("FRONT SCAN DATA: ", result);
  };
  const showError = () => {
    showToast("Enrolled Face and Document Mugshot does not match. Try again.", "error");
  }

  const { scanFrontDocument, resultResponse, reScanFrontDocument } =
    useScanFrontDocumentWithoutPredict(
      handleFrontSuccess,
      onFailCallback,
      enrollImageData,
      showError
    ) as any;
  useEffect(() => {
    setOpStatus(resultResponse?.op_status);
  }, [resultResponse]);

  const handleScanDLFront = async (e: boolean) => {
    console.log("FRONT DL SCAN CALLED");
    setIsReady(e);
    onReadyCallback?.(e);
    // hack to initialize canvas with large memory, so it doesn't cause an issue.
    // console.log("handleScanDLFront", e);
    if (e) {
      await scanFrontDocument();
    }
  };

  const returnMessage = () => {
    return getScanFrontMessage(resultResponse?.op_status);
  };
  return (
    <div id="canvasInput" className={`${styles.container} documentCamera`}>
      {isReady && (
        <>
          <div
            className={styles.cameraFrame}
            style={{
              borderColor: getScanFrontColor(resultResponse?.op_status),
            }}
          >
            <img src={Card} alt="" />
          </div>
          <div className={styles.cameraFrameOuter} />
        </>
      )}
      <Camera
        onReadyCallback={handleScanDLFront}
        onSwitchCamera={()=>{}}
        onCameraFail={onCameraFail}
        style={{ height: "unset" }}
        mode={"back"}
        requireHD={true}
        message={returnMessage()}
        isDocumentScan={true}
        setStep={setStep}
      ></Camera>
    </div>
  );
};

export default FaceCompareFrontDocument;
