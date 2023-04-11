import { useState } from "react";
import { predictAge } from "@privateid/cryptonets-web-sdk-alpha";

const usePredictAge = () => {
  const [age, setAge] = useState(null);
  const [predictAgeHasFinished, setPredictAgeHasFinished] = useState(false);

  const predictAgeCallback = (response?: {
    returnValue: {
      faces: any;
    };
    ageFactor?: number;
    channels?: number;
    conf_level_age?: number;
    crop_conf_score?: number;
    crop_conf_score_thr?: number;
    crop_status?: number;
    exposure?: number;
    face_blurr_var?: number;
    face_center_x?: number;
    face_center_y?: number;
    face_count?: number;
    face_height?: number;
    face_wear_eye_glass_score?: number;
    face_wear_mask_score?: number;
    face_wear_ok?: number;
    face_width?: number;
    im_height?: number;
    im_width?: number;
    image_iso_bytes?: number;
    image_iso_height?: number;
    image_iso_width?: number;
    metric_bitfield?: number;
    payload_type?: string;
    qrate?: number;
    result?: number;
    result_age?: number;
  }) => {
    // console.log("RESPONSE USEPREDICT FE: ", response);

    const { faces } = response?.returnValue || {};

    if (faces.length === 0) {
      setAge(null);
      setPredictAgeHasFinished(true);
    } else {
      for (let index = 0; faces.length > index; index++) {
        const { status, age } = faces[index];

        if (age > 0) {
          setAge(age);
          setPredictAgeHasFinished(true);
          index = faces.length;
        }

        if (index + 1 === faces.length && age <= 0) {
          setAge(null);
          setPredictAgeHasFinished(true);
        }
      }
    }
  };

  const doPredictAge = async () => {
    const data = await predictAge(undefined, predictAgeCallback);
    // console.log(
    //   229,
    //   `${(performance as any).memory.usedJSHeapSize / Math.pow(1000, 2)} MB`
    // );
    // console.log("IMAGE DATA HERE??????????", data ? data : false);
  };

  return { doPredictAge, age, predictAgeHasFinished, setPredictAgeHasFinished };
};

export default usePredictAge;
