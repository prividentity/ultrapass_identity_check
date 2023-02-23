import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { useStyles, styles } from "../../pages/register/styles";
import { theme as Theme, theme } from "../../theme";

import smallLock from "../../assets/smallLock.png";
import STEPS from "../../pages/register/steps";
import ScanBackDocument from "../DocumentCamera/ScanBackDocument";
import ScanFrontDocument from "../DocumentCamera/ScanFrontDocument";
import shield from "../../assets/shield.png";
import DlFront from "../../assets/dl-front.png";
import DlBack from "../../assets/Hand-DL-Back.png";
import { UserContext } from "../../context/UserContext";
import { updateUser, uploadDL } from "@privateid/cryptonets-web-sdk-alpha";
import { DLType } from "@privateid/cryptonets-web-sdk-alpha/dist/types";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import { componentsParameterInterface } from "../../interface";

const DLScan = ({
  setStep,
  setPrevStep,
  skin,
  matchesSM,
}: componentsParameterInterface) => {
  const classes = useStyles();
  const mainTheme = Theme;
  const palette: { [key: string]: any } = mainTheme.palette;
  const [isBackScan, setIsBackScan] = useState(false);
  const [isUserVerify, setIsUserVerify] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [hasNoCamera, setHasNoCamera] = useState(false);

  const context = useContext(UserContext);

  const { id, uuid } = context;

  const onSuccessFrontScan = async (result: {
    croppedDocument: string;
    croppedMugshot: string;
    inputImage: string;
    documentUUID: string;
  }) => {
    const { inputImage, croppedDocument, croppedMugshot, documentUUID } =
      result;
    console.log({ inputImage, croppedDocument, croppedMugshot, documentUUID });
    // if(documentUUID){
    if (documentUUID === uuid) {
      const uploadImageInput = await uploadDL({
        id,
        type: DLType.FRONTDLORIGINAL,
        image: inputImage,
      });
      console.log("uploadImageInput: ", uploadImageInput);
      const uploadCroppedDocumentImage = await uploadDL({
        id,
        type: DLType.FRONTDLCROPPED,
        image: croppedDocument,
      });
      console.log("uploadCroppedDocumentImage: ", uploadCroppedDocumentImage);
      const uploadCroppedMugshotImage = await uploadDL({
        id,
        type: DLType.FRONTDLHEADSHOT,
        image: croppedMugshot,
      });
      console.log("uploadCroppedMugshotImage: ", uploadCroppedMugshotImage);

      if (
        uploadImageInput &&
        uploadCroppedDocumentImage &&
        uploadCroppedMugshotImage
      ) {
        setIsUserVerify(true);
        setTimeout(() => {
          setIsUserVerify(false);
          setIsBackScan(true);
        }, 3000);
      }
    } else {
      console.log("Scan Again");
    }
  };

  const onFailScanFrontScan = (e: any) => {
    console.log(e);
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
    console.log({ barcodeData, inputImage, croppedDocument, croppedBarcode });

    const uploadCroppedBarcodeImage = await uploadDL({
      id,
      type: DLType.BACKDLBARCODE,
      image: croppedBarcode,
    });
    console.log("uploadCroppedBarcodeImage: ", uploadCroppedBarcodeImage);
    const uploadCroppedBackDocumentImage = await uploadDL({
      id,
      type: DLType.BACKDLORIGINAL,
      image: croppedDocument,
    });
    console.log(
      "uploadCroppedBackDocumentImage: ",
      uploadCroppedBackDocumentImage
    );
    const uploadBarcodeData = await uploadDL({
      id,
      type: DLType.BARCODEJSON,
      barcode: JSON.stringify(barcodeData),
    });
    console.log("uploadBarcodeData: ", uploadBarcodeData);

    console.log("===== end of DL SCAN ====== ");

    const govId = {
      firstName: barcodeData.firstName,
      lastName: barcodeData.lastName,
      dob: barcodeData.dateOfBirth,
      address: {
        addressLine1: barcodeData.streetAddress1 || "",
        addressLine2: barcodeData.streetAddress2 || "",
        city: barcodeData.city || "",
        state: barcodeData.state || "",
        zipCode: barcodeData.postCode || "",
        country: barcodeData.issuingCountry || "",
      },
    };

    // @ts-ignores
    const updateUserResult = await updateUser({
      id,
      attributes: { govId: govId },
    });
    console.log("Update user result: ", updateUserResult);

    setIsUserVerify(true);
    setTimeout(() => {
      setStep(STEPS.SUCCESS);
    }, 2000);
  };

  const onCameraNotGranted = (e:boolean) => {
    if(!e){
      setStep(STEPS.CAMERA_PERMISSION_FAIL);
    }
  };

  const onCameraFail = async () => {
    setHasNoCamera(true);
    // setStep(STEPS.SWITCH_DEVICE);
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
          sx={{ paddingTop: 3, paddingBottom: 2 }}
          className={classes.cardHeading}
        >
          <img src={smallLock} alt="smallLock" className={classes.smallLock} />
          DRIVER LICENSE SCAN
        </Typography>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Grid style={styles.cardGrid} className={`cardGridMobile overflowUnset`}>
        <Box position={"relative"}>
          <Box position={"relative"}>
            {!hasNoCamera && (
              <img
                src={isBackScan ? DlBack : DlFront}
                alt="DlFront"
                style={styles.DlFront as React.CSSProperties}
                className="DlBack"
              />
            )}
            {isUserVerify && (
              <Box style={styles.overlay as React.CSSProperties}>
                <img
                  src={shield}
                  alt="shield"
                  style={styles.shield as React.CSSProperties}
                />
              </Box>
            )}

            <Box className={classes.otherDevice}>
              <Typography
                component="p"
                textAlign={"left"}
                fontSize={15}
                fontWeight={500}
                mt={2}
                onClick={()=>{
                  setStep(STEPS.SWITCH_DEVICE)
                }}
              >
                <PhoneIphoneIcon /> Switch to other device
              </Typography>
            </Box>
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
            ) : isBackScan ? (
              <ScanBackDocument
                onSuccess={onBackSuccess}
                onReadyCallback={onCameraNotGranted}
                onCameraFail={onCameraFail}
              />
            ) : (
              <ScanFrontDocument
                onSuccess={onSuccessFrontScan}
                onReadyCallback={onCameraNotGranted}
                onFailCallback={onFailScanFrontScan}
                onCameraFail={onCameraFail}
              />
            )}
          </Box>
        </Box>
      </Grid>
      <Box style={{ height: 106 }}>
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
            {isBackScan
              ? "Place the back of the Driver’s License above"
              : "Place the front of the Driver’s License above"}
          </Typography>
        )}
      </Box>
    </>
  );
};

export default DLScan;
