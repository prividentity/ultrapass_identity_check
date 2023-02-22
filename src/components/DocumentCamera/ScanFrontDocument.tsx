import { useState } from "react";
import styles from "../../styles/Home.module.css";
import useScanFrontDocument from "../../hooks/useScanFrontDocument";
import Camera from "../Camera";

const ScanFrontDocument = ({
  onSuccess,
  onReadyCallback,
}: {
  onSuccess?: (e: any) => void;
  onReadyCallback?: (e: boolean) => void;
}) => {
  const [canvasSize, setCanvasSize] = useState();
  // useEffect(() => {
  //   console.log('useeffect scan dl front')
  //   handleScanDLFront();
  // }, []);
  const handleFrontSuccess = (result?: any) => {
    onSuccess?.(result);
    console.log("FRONT SCAN DATA: ", result);
  };
  const { scanFrontDocument } = useScanFrontDocument(handleFrontSuccess) as any;
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
  console.log("render scan dl front");
  return (
    <div id="canvasInput" className={`${styles.container} documentCamera`}>
      <Camera
        handleCanvasSizeChange={handleCallbackFromCanvasSizeChange}
        // currentAction={"useScanDocumentFront"}
        onReadyCallback={handleScanDLFront}
        onSwitchCamera={handleScanDLFront}
        style={{ height: "unset" }}
        mode={"back"}
        requireHD={true}
      ></Camera>
    </div>
  );
};

export default ScanFrontDocument;
