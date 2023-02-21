import usePredictAge from "../../hooks/usePredictAge";
import { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import Camera from "../Camera";

const PredictAge = ({
  enrollAge,
  onReadyCallback,
  message,
}: {
  enrollAge?: (e: number) => void;
  onReadyCallback?: (e: boolean) => void;
  onSwitchCamera?: () => void;
  message?: string;
}) => {
  const { doPredictAge, age, predictAgeHasFinished, setPredictAgeHasFinished } =
    usePredictAge();

  const [predictAge, setPredictAge] = useState(false);

  useEffect(() => {
    if (predictAge && !predictAgeHasFinished && !age) {
      doPredictAge();
    } else {
      setPredictAgeHasFinished(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [predictAgeHasFinished]);

  useEffect(() => {
    if (age && age > 0) {
      enrollAge?.(age as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [age]);

  const handlePredictAge = (e: boolean) => {
    if (e) {
      setPredictAge(true);
      doPredictAge();
    }
    onReadyCallback?.(e);
  };

  return (
    <div id="canvasInput" className={styles.container}>
      <Camera
        onReadyCallback={handlePredictAge}
        onSwitchCamera={handlePredictAge}
        message={message}
      ></Camera>
    </div>
  );
};
export default PredictAge;
