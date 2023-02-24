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
import CameraPermissionFail from "../../components/CameraPermissionFail";
import { useNavigate } from "react-router";
import Success from "../../components/Success";
import VerificationNotCompleted from "../../components/VerificationNotCompleted";
import RequestSsn from "../../components/RequestSsn";
import AdditionalRequirements from "../../components/AdditionalRequirements";
import { useSearchParams } from "react-router-dom";
import useToast from "../../utils/useToast";
import { verifyIdApi } from "../../services/api";
import { APPROVED, DENIED } from "../../utils";

interface props {
  theme: string;
  skin: string;
}

const Register = ({ theme, skin }: props) => {
  // useWasm();
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

      setStep(STEPS.SUCCESS);
    } else if (result?.requestScanID && status === DENIED) {
      // If User ID SCAN is required
      showToast("ID SCAN is required", "error");

      setStep(STEPS.DRIVERLICENSE);
    } else if (result?.underAge && status === DENIED) {
      // If User is underage
      showToast("You are underage", "error");

      setStep(STEPS.VERIFICATION_NOT_COMPLETED);
    } else {
      showToast(result?.data?.message, "error");

      setStep(STEPS.VERIFICATION_NOT_COMPLETED);
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
            skin={skin}
            setToken={setToken}
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
        return <Enroll setStep={setStep} skin={skin} />;

      case STEPS.CAMERA_PERMISSION_FAIL:
        return (
          <CameraPermissionFail
            matchesSM={matchesSM}
            setStep={setStep}
            skin={skin}
            setPrevStep={setPrevStep}
          />
        );

      case STEPS.DRIVERLICENSE:
        return (
          <DLScan
            matchesSM={matchesSM}
            setStep={setStep}
            setPrevStep={setPrevStep}
            skin={skin}
            onVerifyId={onVerifyId}
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
            onSuccess={onVerifyId}
            setPrevStep={setPrevStep}
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
      case STEPS.ADDITIONAL_REQUIREMENTS:
        return (
          <AdditionalRequirements
            matchesSM={matchesSM}
            setStep={setStep}
            skin={skin}
            setPrevStep={setPrevStep}
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
