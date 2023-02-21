import { useEffect, useState } from "react";

const useCameraPermissions = (callback?: (arg0: boolean) => void) => {
  const [isCameraGranted, setIsCameraGranted] = useState(false);
  const checkCameraPermissions = async () => {
    navigator.permissions.query({ name: "camera" } as any).then((result) => {
      if (result.state === "granted") {
        setIsCameraGranted(true);
      } else {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then(function (stream) {
            setIsCameraGranted(true);
          })
          .catch(function (err) {
            setIsCameraGranted(false);
            callback && callback(false);
          });
      }
      // Don't do anything if the permission was denied.
    });
  };
  useEffect(() => {
    checkCameraPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { isCameraGranted };
};

export default useCameraPermissions;
