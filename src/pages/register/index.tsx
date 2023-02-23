import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  Typography,
  useTheme,
  useMediaQuery,
  TextField as MuiTextField,
} from "@mui/material";
import { useWasm } from "../../hooks";
import HomeModal from "../../components/Modal/homeModal";
import Header from "../../components/Header";
import STEPS from "./steps";
import FullWidthTabs from "../../components/OptionsTab";
import RegisterInputs from "../../components/Register";
import Start from "../../components/Start";
import Enroll from "../../components/Enroll";
import VerifyAgeWithDatabase from "../../components/SignupComponents/VerifyAgeWithDatabase";
import DatabaseConsent from "../../components/SignupComponents/DatabaseConsent";
import AgeCheckDatabase from "../../components/SignupComponents/AgeCheckDatabase";
import CannotVerify from "../../components/SignupComponents/CannotVerify";
import VerifyAgeWithScan from "../../components/SignupComponents/VerifyAgeWithScan";
import VerifyDriversLicense from "../../components/SignupComponents/VerifyDriversLicense";
import DLScan from "../../components/DLScanning";
import CameraPermissionFail from "../../components/CameraPermissionFail";

interface props {
  theme: string;
  skin: string;
}

const Register = ({ theme, skin }: props) => {
  useWasm();
  const [step, setStep] = useState(STEPS.START);
  const [prevStep, setPrevStep] = useState(STEPS.START);
  const muiTheme = useTheme();
  const matchesSM = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const navigateToUrl = (
    url: string,
    timeoutMilliseconds = 1000,
    token = ""
  ) => {
    setTimeout(() => {
      window.open(`${url}?token=${token}`, "_self");
    }, timeoutMilliseconds);
  };

  const _renderChildren = () => {
    switch (step as string) {
      case STEPS.START:
        return (
          <Start
            matchesSM={matchesSM}
            setPrevStep={setPrevStep}
            setStep={setStep}
            skin={skin}
          />
        );
      case STEPS.REGISTER_CONSENT:
        return (
          <DatabaseConsent
            theme={theme}
            skin={skin}
            setStep={setStep}
            setPrevStep={setPrevStep}
          />
        );
      case STEPS.REGISTER_FORM:
        return (
          <RegisterInputs
            matchesSM={matchesSM}
            setStep={setStep}
            setPrevStep={setPrevStep}
            skin={skin}
          />
        );
      case STEPS.CONSENT_FAIL:
        return (
          <CannotVerify
            theme={theme}
            skin={skin}
            navigateToUrl={navigateToUrl}
            setStep={setStep}
            prevStep={prevStep}
          />
        );
      case STEPS.PRE_ENROLL:
        return (
          <VerifyAgeWithScan
            theme={theme}
            skin={skin}
            setPrevStep={setPrevStep}
            setStep={setStep}
          />
        );
      case STEPS.ENROLL:
        return (
            <Enroll setStep={setStep} />
        );

      case STEPS.CAMERA_PERMISSION_FAIL:
        return(
          <CameraPermissionFail matchesSM={matchesSM} setStep={setStep} skin={skin} setPrevStep={setPrevStep} />
        )
      case STEPS.DRIVERLICENSE:
        return <DLScan matchesSM={matchesSM} setStep={setStep} setPrevStep={setPrevStep} skin={skin} />;
      case STEPS.SWITCH_DEVICE:
        return <FullWidthTabs />;
      case STEPS.SUCCESS:
        return <></>;
      default:
    }
  };
  const themeName = skin || "primary";

  return (
    <>
      {<Header theme={themeName} />}
      <div className="homePageWrapper">
        <HomeModal
          handleClose={() => {
            console.log("CLOSE HERE");
          }}
          open={true}
        >
          {_renderChildren()}
        </HomeModal>
      </div>
    </>
  );
};

export default Register;
