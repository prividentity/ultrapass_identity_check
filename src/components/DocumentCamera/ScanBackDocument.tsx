import { useState } from "react";
import styles from "../../styles/Home.module.css";
import Camera from "../Camera";
import useScanBackDocument from "../../hooks/useScanBackDocument";

const ScanBackDocument = ({
  onSuccess,
  onReadyCallback,
}: {
  onSuccess?: (e: any) => void;
  onReadyCallback?: (e: boolean) => void;
}) => {
  const [canvasSize, setCanvasSize] = useState();
  // useEffect(() => {
  //   handleScanDocumentBack();
  // }, []);
  // Scan Document Back
  const handleBackSuccess = (result: any) => {
    onSuccess?.(result);
  };
  const { scanBackDocument } = useScanBackDocument(handleBackSuccess) as any;
  const handleScanDocumentBack = async (e: boolean) => {
    onReadyCallback?.(e);
    if(e){
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
        style={{ height: "unset" }}
        mode={"back"}
        requireHD={true}
      ></Camera>
    </div>
  );
};

export default ScanBackDocument;
