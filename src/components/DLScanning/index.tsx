import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import { useStyles, styles } from "../../pages/register/styles";
import { theme as Theme, theme } from "../../theme";

import smallLock from "../../assets/smallLock.png";
import { name } from "platform";
import STEPS from "../../pages/register/steps";
import ScanBackDocument from "../DocumentCamera/ScanBackDocument";
import ScanFrontDocument from "../DocumentCamera/ScanFrontDocument";
import shield from "../../assets/shield.png";
import DlFront from "../../assets/dl-front.png";
import DlBack from "../../assets/Hand-DL-Back.png";
import { UserContext } from "../../context/UserContext";
import {
  getUserStatus,
  updateUser,
  uploadDL,
} from "@privateid/cryptonets-web-sdk-alpha";
import { DLType } from "@privateid/cryptonets-web-sdk-alpha/dist/types";
import { useSearchParams } from "react-router-dom";
import { verifyIdApi } from "../../services/api";
import { APPROVED, DENIED } from "../../utils";
import useToast from "../../utils/useToast";

const DLScan = ({
  setStep,
  setPrevStep,
  skin,
  matchesSM,
  token,
}: {
  setStep: any;
  setPrevStep: any;
  skin: string;
  matchesSM: boolean;
  token: string;
}) => {
  const [searchParams] = useSearchParams();
  const tokenParams = searchParams.get("token") as string;
  const classes = useStyles();
  const { showToast } = useToast();
  const mainTheme = Theme;
  const palette: { [key: string]: any } = mainTheme.palette;
  const [isBackScan, setIsBackScan] = useState(false);
  const [isUserVerify, setIsUserVerify] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

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

  const onCameraNotGranted = () => {};

  const onVerifyId = async () => {
    const payload = {
      token: token,
    };
    await verifyIdApi({ id: tokenParams, payload });
    const { userApproved, ...rest } = ((await getUserStatus({ id: token })) ||
      {}) as any;
    context.setUserStatus({ userApproved, ...rest });
    if (userApproved) {
      showToast("You successfully completed your ID verification.", "success");
      setTimeout(() => {
        setStep(STEPS.SUCCESS);
      }, 2000);
    } else {
      showToast("We need more information to verify your identity.", "error");
      setTimeout(() => {
        setStep(STEPS.ADDITIONAL_REQUIREMENTS);
      }, 2000);
    }
    // const status = result?.orchestrationStatus;
    // if (result?.requestSSN9 && status === DENIED) {
    //   // If SSN is required
    //   showToast('SSN is required', "error");
    //   setStep(STEPS.REQUEST_SSN);
    // } else if (result?.userApproved && status === APPROVED) {
    //   // If User is approved
    //   showToast('You successfully completed your ID verification.', "success")
    //   setTimeout(() => {
    //     setStep(STEPS.SUCCESS);
    //   }, 2000);
    // } else if (result?.requestScanID && status === DENIED) {
    //   // If User ID SCAN is required
    //   showToast('ID SCAN is required', "error");
    //   setTimeout(() => {
    //     setStep(STEPS.DRIVERLICENSE);
    //   }, 2000);
    // } else if (result?.underAge && status === DENIED) {
    //   // If User is underage
    //   showToast('You are underage', "error");
    //   setTimeout(() => {
    //     setStep(STEPS.VERIFICATION_NOT_COMPLETED);
    //   }, 2000);
    // } else {
    //   showToast(result?.data?.message, "error");
    //   setTimeout(() => {
    //     setStep(STEPS.VERIFICATION_NOT_COMPLETED);
    //   }, 2000);
    // }
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
            <img
              src={isBackScan ? DlBack : DlFront}
              alt="DlFront"
              style={styles.DlFront as React.CSSProperties}
              className="DlBack"
            />
            {isUserVerify && (
              <Box style={styles.overlay as React.CSSProperties}>
                <img
                  src={shield}
                  alt="shield"
                  style={styles.shield as React.CSSProperties}
                />
              </Box>
            )}

            {isBackScan ? (
              <ScanBackDocument
                onSuccess={onBackSuccess}
                onReadyCallback={onCameraNotGranted}
              />
            ) : (
              <ScanFrontDocument
                onSuccess={onSuccessFrontScan}
                onReadyCallback={onCameraNotGranted}
                onFailCallback={onFailScanFrontScan}
              />
            )}
          </Box>
        </Box>
      </Grid>
      <Box style={{ height: 70 }}>
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
        {/* <button onClick={() => onVerifyId()}>submit</button> */}
      </Box>
    </>
  );
};

export default DLScan;
