import { useState, useContext, useEffect } from "react";
import { useTheme, useMediaQuery } from "@mui/material";

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
import DLScan from "../../components/DLScanning/DLFaceCompare";
import CameraPermissionFail from "../../components/CameraPermissionFail";
import { useNavigate } from "react-router";
import Success from "../../components/Success";
import VerificationNotCompleted from "../../components/VerificationNotCompleted";
import { UserContext } from "../../context/UserContext";
import AdditionalRequirements from "../../components/AdditionalRequirements";
import { useSearchParams } from "react-router-dom";
import useToast from "../../utils/useToast";
import {
  getUser,
  getUserPortrait,
  verifyIdApi,
  verifyTokenApi,
} from "../../services/api";
import { SUCCESS, REQUIRES_INPUT, getStatusFromUser } from "../../utils";
import { getUserStatus } from "@privateid/cryptonets-web-sdk-alpha";
import NotSupported from "../../components/NotSupported";

interface props {
  theme: string;
  skin: string;
}

const Register = ({ theme, skin }: props) => {
  const { showToast } = useToast();
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenParams = searchParams.get("token") as string;
  const [step, setStep] = useState("");
  const [prevStep, setPrevStep] = useState(STEPS.START);
  const [token, setToken] = useState("");
  const muiTheme = useTheme();
  const matchesSM = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const verifyTokenAPI = async (token: any) => {
    await verifyTokenApi(token).then(async (res: any) => {
      context.setVerificationSession(res);
      const convertLinkToImageData = async (link: string, setState: any) => {
        var newImg = new Image();
        newImg.src = "data:image/png;base64," + link;
        newImg.onload = async () => {
          var imgSize = {
            w: newImg.width,
            h: newImg.height,
          };
          const canvas = document.createElement("canvas");
          canvas.setAttribute("height", `${imgSize.h}`);
          canvas.setAttribute("width", `${imgSize.w}`);
          var ctx = canvas.getContext("2d");
          // @ts-ignore
          ctx.drawImage(newImg, 0, 0);
          // @ts-ignore
          const enrollImage = ctx.getImageData(0, 0, imgSize.w, imgSize.h);
          setState(enrollImage);
          context.setDlAction("frontscan");
          setStep(STEPS.DRIVERLICENSE);
        };
      };
      if (res?.customerInformation?.customerId) {
        context.setId(res.customerInformation.customerId);
        const userDetails: any = await getUser(
          res?.customerInformation?.customerId
        );
        if (!userDetails.uuid) {
          setStep(STEPS.PRE_ENROLL);
        } else if (!userDetails?.govId?.portraitConfScore) {
          const userPortrait: any = await getUserPortrait(
            res.customerInformation.customerId
          );
          await convertLinkToImageData(
            userPortrait.imagedata,
            context.setEnrollImageData
          );
        } else if (!userDetails.govId.firstName) {
          context.setDlAction("backscan");
          setStep(STEPS.DRIVERLICENSE);
        } else {
          const { userApproved, ...rest } = ((await getUserStatus({
            id: res.customerInformation.customerId,
          })) || {}) as any;
          const { requestScanID, requestResAddress } = rest || {};
          context.setUserStatus({
            userApproved,
            requestScanID,
            requestResAddress: !requestScanID && requestResAddress,
            ...rest,
          });
          const status = getStatusFromUser({ userApproved, ...rest });
          const session = res;
          if (status === SUCCESS) {
            showToast(
              "You successfully completed your ID verification.",
              "success"
            );
            if (session.successUrl) {
              window.location.replace(session.successUrl);
            }
          } else if (status === REQUIRES_INPUT) {
            showToast(
              "We need more information to verify your identity.",
              "error"
            );
            setStep(STEPS.ADDITIONAL_REQUIREMENTS);
          } else {
            showToast("Your ID verification was not completed.", "error");
            if (session.failureUrl) {
              window.location.replace(session.failureUrl);
            }
            // setStep(STEPS.VERIFICATION_NOT_COMPLETED);
          }
        }
      } else {
        setStep(STEPS.START);
      }
    });
    context.setTokenParams(token);
  };
  useEffect(() => {
    if (!tokenParams) return;
    verifyTokenAPI(tokenParams);
  }, [tokenParams]);

  const onVerifyId = async () => {
    console.log("context before verify?????", context)
    const payload = {
      token: context.id,
    };
    await verifyIdApi({ id: tokenParams, payload });
    const { userApproved, ...rest } = ((await getUserStatus({ id: context.id })) ||
      {}) as any;
    const { requestScanID, requestResAddress } = rest || {};
    context.setUserStatus({
      userApproved,
      requestScanID,
      requestResAddress: !requestScanID && requestResAddress,
      ...rest,
    });
    const status = getStatusFromUser({ userApproved, ...rest });
    const session = context.verificationSession;
    if (status === SUCCESS) {
      showToast("You successfully completed your ID verification.", "success");
      if (session.successUrl) {
        window.location.replace(session.successUrl);
      }
    } else if (status === REQUIRES_INPUT) {
      showToast("We need more information to verify your identity.", "error");
      setStep(STEPS.ADDITIONAL_REQUIREMENTS);
    } else {
      showToast("Your ID verification was not completed.", "error");
      if (session.failureUrl) {
        window.location.replace(session.failureUrl);
      }
      // setStep(STEPS.VERIFICATION_NOT_COMPLETED);
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

      case STEPS. DRIVERLICENSE:
        return (
          <DLScan
            matchesSM={matchesSM}
            setStep={setStep}
            skin={skin}
            onSuccess={onVerifyId}
          />
        );
      case STEPS.SWITCH_DEVICE:
        return <FullWidthTabs />;
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
            handleRequirementsComplete={onVerifyId}
          />
        );
      case STEPS.NOT_SUPPORTED:
        return <NotSupported />;
      default:
        return <></>;
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
