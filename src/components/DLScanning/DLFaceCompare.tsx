import React, { useState, useContext, useEffect } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { useStyles, styles } from "../../pages/register/styles";
import { theme as Theme } from "../../theme";

import smallLock from "../../assets/smallLock.png";
import STEPS from "../../pages/register/steps";
import ScanBackDocument from "../DocumentCamera/ScanBackDocument";
import ScanFrontDocument from "../DocumentCamera/ScanFrontDocument";
import shield from "../../assets/shield.png";
import DlFront from "../../assets/dl-front.png";
import DlBack from "../../assets/Hand-DL-Back.png";
import { UserContext } from "../../context/UserContext";
import {
  closeCamera,
  updateUser,
  uploadDL,
} from "@privateid/cryptonets-web-sdk-alpha";
import { DLType } from "@privateid/cryptonets-web-sdk-alpha/dist/types";

import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import useToast from "../../utils/useToast";
import SpinnerLoader from "../SpinnerLoader";
import FaceCompareFrontDocument from "../DocumentCamera/FaceCompareFrontDocument";
import { cameraDelay } from "../../utils";
import {ELEMENT_ID} from "../../constants";

const DLFaceCompare = ({
  setStep,
  skin,
  matchesSM,
  onSuccess,
}: {
  setStep: any;
  skin: string;
  matchesSM: boolean;
  onSuccess: () => void;
}) => {
  const classes = useStyles();
  const { showToast } = useToast();
  const mainTheme = Theme;
  const palette: { [key: string]: any } = mainTheme.palette;

  const [isUserVerify, setIsUserVerify] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [hasNoCamera, setHasNoCamera] = useState(false);
  const [isBarcodeScan, setIsBarcodeScan] = useState(false);
  const [isScanningFailed, setIsScanningFailed] = useState(false);
  const [opStatus, setOpStatus] = useState<number>();

  enum DlActionEnum {
    frontscan = "frontscan",
    backscan = "backscan",
  }

  const context = useContext(UserContext);

  const { id, enrollImageData, portraitConfScore, setPortraitConfScore, dlAction, setDlAction } =
    context;

  useEffect(() => {
    setTimeout(() => {
      setIsScanningFailed(true);
    }, cameraDelay);
  }, []);

  const onSuccessFrontScan = async (result: {
    croppedDocument: string;
    croppedMugshot: string;
    inputImage: string;
    portraitConfScore: number;
  }) => {
    const {
      inputImage,
      croppedDocument,
      croppedMugshot,
      portraitConfScore: compareScore,
    } = result;
    setIsLoading(true);
    setIsScanningFailed(false);
    // console.log("compareScore??",{
    //   inputImage,
    //   croppedDocument,
    //   croppedMugshot,
    //   compareScore,
    // });
    setPortraitConfScore(compareScore);

    const uploadImageInput = await uploadDL({
      id,
      type: DLType.FRONTDLORIGINAL,
      image: inputImage,
    });
    // console.log("uploadImageInput: ", uploadImageInput);
    const uploadCroppedDocumentImage = await uploadDL({
      id,
      type: DLType.FRONTDLCROPPED,
      image: croppedDocument,
    });
    // console.log("uploadCroppedDocumentImage: ", uploadCroppedDocumentImage);
    const uploadCroppedMugshotImage = await uploadDL({
      id,
      type: DLType.FRONTDLHEADSHOT,
      image: croppedMugshot,
    });
    // console.log("uploadCroppedMugshotImage: ", uploadCroppedMugshotImage);
    const govId = {
      portraitConfScore: compareScore,
    };

    const updateUserResult = await updateUser({
      id,
      // @ts-ignore
      attributes: { govId: govId },
    });
    // console.log("Update user result: ", updateUserResult);
    if (
      uploadImageInput &&
      uploadCroppedDocumentImage &&
      uploadCroppedMugshotImage
    ) {
      await closeCamera(ELEMENT_ID);
      setTimeout(() => {
        setIsUserVerify(true);
      }, 2000);
      setTimeout(() => {
        setIsLoading(false);
        setIsUserVerify(false);
        setDlAction(DlActionEnum.backscan);
        setTimeout(() => {
          setIsScanningFailed(true);
        }, cameraDelay);
      }, 4000);
    }
  };

  const onFailScanFrontScan = ({
    status,
    message,
  }: {
    status: string;
    message: string;
  }) => {
    // if (parseInt(status) === -100) {
    //   showToast(message, "error");
    // }
  };

  const onBackSuccess = async ({
    barcodeData,
    inputImage,
    croppedDocument,
    croppedBarcode,
  }: {
    barcodeData: any;
    inputImage: string;
    croppedDocument: string;
    croppedBarcode: string;
  }) => {
    // console.log({ barcodeData, inputImage, croppedDocument, croppedBarcode });
    setIsLoading(true);
    setIsScanningFailed(false);
    const uploadCroppedBarcodeImage = await uploadDL({
      id,
      type: DLType.BACKDLBARCODE,
      image: croppedBarcode,
    });
    // console.log("uploadCroppedBarcodeImage", uploadCroppedBarcodeImage);

    if (croppedDocument) {
      const uploadCroppedBackDocumentImage = await uploadDL({
        id,
        type: DLType.BACKDLORIGINAL,
        image: croppedDocument,
      });

      // console.log(
      //   "uploadCroppedBackDocumentImage",
      //   uploadCroppedBackDocumentImage
      // );
    }

    const uploadBarcodeData = await uploadDL({
      id,
      type: DLType.BARCODEJSON,
      barcode: JSON.stringify(barcodeData),
    });
    // console.log("uploadBarcodeData", uploadBarcodeData);

    console.log("===== end of DL SCAN ====== ");

    const govId = {
      firstName: barcodeData.firstName,
      lastName: barcodeData.lastName,
      dob: barcodeData.dateOfBirth,
      address: {
        addressLine1: barcodeData.streetAddress1,
        addressLine2: barcodeData.streetAddress2,
        city: barcodeData.city,
        state: barcodeData.state,
        zipCode: barcodeData.postCode,
        country: barcodeData.issuingCountry,
      },
    };

    const updateUserResult = await updateUser({
      id,
      // @ts-ignore
      attributes: { govId: govId },
    });
    // console.log("Update user result: ", updateUserResult);

    setTimeout(() => {
      setIsUserVerify(true);
    }, 2000);
    setTimeout(() => {
      setIsUserVerify(false);
      onSuccess && onSuccess();
    }, 4000);
  };

  const onCameraNotGranted = (e: boolean) => {
    if (!e) {
      setStep(STEPS.CAMERA_PERMISSION_FAIL);
    }
  };

  const onCameraFail = async () => {
    setHasNoCamera(true);
    // setStep(STEPS.SWITCH_DEVICE);
  };

  const onCameraNotFullHd = async () => {
    // console.log("NOT FULL HD CALLED.");
    await closeCamera(ELEMENT_ID);
    setStep(STEPS.SWITCH_DEVICE);
  };

  return (
    <>
      <Grid container alignItems="center" justifyContent={"center"}>
        <Typography
          component="p"
          textAlign="center"
          fontSize={16}
          fontWeight={900}
          letterSpacing={"1px"}
          sx={{ paddingTop: matchesSM ? "0px !important" : 3, paddingBottom: 2 }}
          className={classes.cardHeading}
        >
          <img src={smallLock} alt="smallLock" className={classes.smallLock} />
          DRIVER LICENSE SCAN
        </Typography>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      {opStatus !== 0 && isScanningFailed && (
        <Alert
        severity="info"
        onClick={async () => {
          setStep(STEPS.SWITCH_DEVICE);
          await closeCamera(ELEMENT_ID);
        }}
        className={classes.alertWrap}
      >
        You can try switching to other device.
      </Alert>
      )}
      <Grid style={styles.cardGrid} className={`cardGridMobile overflowUnset ${classes.cardSxMobile}`}>
        <Box position={"relative"}>
          <Box position={"relative"}>
            {/* {!hasNoCamera && (
              <img
                src={dlAction === DlActionEnum.backscan ? DlBack : DlFront}
                alt="DlFront"
                style={styles.DlFront as React.CSSProperties}
                className="DlBack"
              />
            )} */}
            {isLoading && (
              <Box style={styles.overlay as React.CSSProperties}>
                {isUserVerify ? (
                  <img
                    src={shield}
                    alt="shield"
                    style={styles.shield as React.CSSProperties}
                  />
                ) : (
                  <SpinnerLoader />
                )}
              </Box>
            )}

            {hasNoCamera ? (
              <Stack
                width={"100%"}
                height={"400px"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Typography variant="h5" color={"#000000"}>
                  No Camera Detected.
                </Typography>
                <Typography variant="subtitle1" color={"#000000"}>
                  Please switch device.
                </Typography>
              </Stack>
            ) : dlAction === DlActionEnum.backscan ? (
              <ScanBackDocument
                onSuccess={onBackSuccess}
                onReadyCallback={onCameraNotGranted}
                onCameraFail={onCameraFail}
                onCameraNotFullHd={onCameraNotFullHd}
                setOpStatus={(e: number) => setOpStatus(e)}
              />
            ) : (
              <FaceCompareFrontDocument
                onSuccess={onSuccessFrontScan}
                onReadyCallback={onCameraNotGranted}
                onFailCallback={onFailScanFrontScan}
                onCameraFail={onCameraFail}
                enrollImageData={enrollImageData}
                setOpStatus={(e: number) => setOpStatus(e)}
              />
            )}
          </Box>
        </Box>
      </Grid>
      <Box style={{ height: 84 }} className={classes.scanBottomBox}>
        {isScanning ? (
          <Typography
            component="p"
            textAlign="center"
            fontSize={14}
            fontWeight={500}
            mt={1}
            mb={2}
          >
            <CircularProgress style={styles.scanLoader} /> Scanning...
          </Typography>
        ) : null}

        {!hasNoCamera && (
          <Typography
            component="p"
            textAlign="center"
            fontSize={14}
            fontWeight={500}
            mt={1}
            mb={2}
          >
            {isBarcodeScan
              ? "Place the bar code in the safe area"
              : dlAction === DlActionEnum.backscan
              ? "Place the BACK of your ID towards the camera"
              : "Place the FRONT of your ID towards the camera"}
          </Typography>
        )}

        <Box className={classes.otherDevice} pl={3} mb={1}>
          <Typography
            component="p"
            textAlign={"left"}
            fontSize={15}
            fontWeight={500}
            mt={0}
            onClick={() => {
              setStep(STEPS.SWITCH_DEVICE);
            }}
          >
            <PhoneIphoneIcon /> Switch to other device
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default DLFaceCompare;
