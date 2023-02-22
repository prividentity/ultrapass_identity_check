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
import { uploadDL } from "@privateid/cryptonets-web-sdk-alpha";
import { DLType } from "@privateid/cryptonets-web-sdk-alpha/dist/types";

const DLScan = ({
  setStep,
  setPrevStep,
  skin,
  matchesSM,
}: {
  setStep: any;
  setPrevStep: any;
  skin: string;
  matchesSM: boolean;
}) => {
  const classes = useStyles();
  const mainTheme = Theme;
  const palette: { [key: string]: any } = mainTheme.palette;
  const [isBackScan, setIsBackScan] = useState(false);
  const [isUserVerify, setIsUserVerify] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const context = useContext(UserContext);

  const { id, uuid } = context;

  const onSuccessFrontScan = async (result: any) => {
    if (result.uuid === uuid) {
      const { inputImage, croppedDocumentImage, croppedMugshotImage } = result;
      const uploadImageInput = await uploadDL({
        id,
        type: DLType.FRONTDLORIGINAL,
        image: inputImage,
      });
      console.log("uploadImageInput: ", uploadImageInput);
      const uploadCroppedDocumentImage = await uploadDL({
        id,
        type: DLType.FRONTDLCROPPED,
        image: croppedDocumentImage,
      });
      console.log("uploadCroppedDocumentImage: ", uploadCroppedDocumentImage);
      const uploadCroppedMugshotImage = await uploadDL({
        id,
        type: DLType.FRONTDLHEADSHOT,
        image: croppedMugshotImage,
      });
      console.log("uploadCroppedMugshotImage: ", uploadCroppedMugshotImage);

      if (
        uploadImageInput &&
        uploadCroppedDocumentImage &&
        uploadCroppedMugshotImage
      ) {
        //setShowSuccess(true);
        setTimeout(() => {
          // setShowSuccess(false);
          setIsBackScan(true);
        }, 4000);
      }
    } else {
      console.log("Scan Again");
    }
  };

  const onFailScanFrontScan = () =>{

  }

  const onBackSuccess = () =>{

  }

  const onCameraNotGranted = () => {

  }

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
      </Box>
    </>
  );
};

export default DLScan;
