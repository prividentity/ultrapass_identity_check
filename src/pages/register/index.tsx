import { useState } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { useWasm } from "../../hooks";
import HomeModal from "../../components/Modal/homeModal";
import Header from "../../components/Header";
import STEPS from "./steps";
import FullWidthTabs from "../../components/OptionsTab";
import RegisterInputs from "../../components/Register";
import Start from "../../components/Start";
import Enroll from "../../components/Enroll";
import DatabaseConsent from "../../components/SignupComponents/DatabaseConsent";
import CannotVerify from "../../components/SignupComponents/CannotVerify";
import VerifyAgeWithScan from "../../components/SignupComponents/VerifyAgeWithScan";
import DLScan from "../../components/DLScanning";
import { useNavigate } from "react-router";

interface props {
  theme: string;
  skin: string;
}

const Register = ({ theme, skin }: props) => {
  useWasm();
  const navigate = useNavigate();
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
      // case STEPS.PRE_REGISTER:
      //   return (
      //     <VerifyAgeWithDatabase
      //       skin={skin}
      //       setStep={setStep}
      //       setPrevStep={setPrevStep}
      //     />
      //   );
      case STEPS.REGISTER_CONSENT:
        return (
          <DatabaseConsent
            theme={theme}
            skin={skin}
            setStep={setStep}
            setPrevStep={setPrevStep}
          />
        );
      // case STEPS.PRE_REGISTER_FORM:
      //   return (
      //     <AgeCheckDatabase
      //       theme={theme}
      //       setPrevStep={setPrevStep}
      //       setStep={setStep}
      //     />
      //   );
      case STEPS.REGISTER_FORM:
        return (
          <RegisterInputs
            matchesSM={matchesSM}
            setStep={setStep}
            skin={skin}
          />
        );
      // case STEPS.CONSENT:
      //   return <></>;

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
        return <Enroll setStep={setStep} />;
      // case STEPS.PRE_DRIVERLICENSE:
      //   return (
      //       <VerifyDriversLicense
      //           skin={skin}
      //           setStep={setStep}
      //           setPrevStep={setPrevStep}
      //       />
      //   )
      case STEPS.DRIVERLICENSE:
        return (
          <DLScan
            matchesSM={matchesSM}
            setStep={setStep}
            setPrevStep={setPrevStep}
            skin={skin}
          />
        );
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
            navigate("/");
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
