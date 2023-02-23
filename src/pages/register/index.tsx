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
import Success from "../../components/Success";
import VerificationNotCompleted from "../../components/VerificationNotCompleted";
import RequestSsn from "../../components/RequestSsn";
import { useSearchParams } from "react-router-dom";
import useToast from "../../utils/useToast";
import { verifyIdApi } from "../../services/api";
import { APPROVED, DENIED } from "../../utils";
import RequestAddress from "../../components/RequestAddress";

interface props {
  theme: string;
  skin: string;
}

const Register = ({ theme, skin }: props) => {
  useWasm();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenParams = searchParams.get("token") as string;
  const [step, setStep] = useState(STEPS.START);
  const [prevStep, setPrevStep] = useState(STEPS.START);
  const [token, setToken] = useState("");
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

  const onVerifyId = async () => {
    const payload = {
      token: token,
    };
    const result: any = await verifyIdApi({ id: tokenParams, payload });
    const status = result?.orchestrationStatus;
    if (result?.requestSSN9 && status === DENIED) {
      // If SSN is required
      showToast("SSN is required", "error");
      setStep(STEPS.REQUEST_SSN);
    } else if (result?.userApproved && status === APPROVED) {
      // If User is approved
      showToast("You successfully completed your ID verification.", "success");
      setTimeout(() => {
        setStep(STEPS.SUCCESS);
      }, 2000);
    } else if (result?.requestScanID && status === DENIED) {
      // If User ID SCAN is required
      showToast("ID SCAN is required", "error");
      setTimeout(() => {
        setStep(STEPS.DRIVERLICENSE);
      }, 2000);
    } else if (result?.underAge && status === DENIED) {
      // If User is underage
      showToast("You are underage", "error");
      setTimeout(() => {
        setStep(STEPS.VERIFICATION_NOT_COMPLETED);
      }, 2000);
    } else {
      showToast(result?.data?.message, "error");
      setTimeout(() => {
        setStep(STEPS.VERIFICATION_NOT_COMPLETED);
      }, 2000);
    }
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
            setToken={setToken}
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
            token={token}
            tokenParams={tokenParams}
          />
        );
      case STEPS.SWITCH_DEVICE:
        return <FullWidthTabs />;
      case STEPS.REQUEST_SSN:
        return (
          <RequestSsn
            matchesSM={matchesSM}
            setStep={setStep}
            skin={skin}
            onVerifyId={onVerifyId}
          />
        );
      case STEPS.SUCCESS:
        return <Success matchesSM={matchesSM} setStep={setStep} skin={skin} />;
      case STEPS.VERIFICATION_NOT_COMPLETED:
        return (
          <VerificationNotCompleted
            matchesSM={matchesSM}
            setStep={setStep}
            skin={skin}
          />
        );
      case STEPS.REQUEST_ADDRESS:
        return (
          <RequestAddress
            matchesSM={matchesSM}
            setStep={setStep}
            skin={skin}
            onVerifyId={onVerifyId}
          />
        );

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
