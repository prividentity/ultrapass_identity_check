import React from "react";
import { UserContext } from "../../context/UserContext";
import RequestAddress from "../RequestAddress";
import RequestSSN from "../RequestSsn/index";
import STEPS from "../../pages/register/steps";
import { AdditionalRequirementsEnum } from "../../utils";
import { getUserPortrait } from "../../services/api";

const AdditionalRequirements = ({
  matchesSM,
  setStep,
  skin,
  handleRequirementsComplete,
  setPrevStep,
  loading,
}: {
  matchesSM: boolean;
  setStep: any;
  skin: string;
  handleRequirementsComplete: () => void;
  setPrevStep: (e: string) => void;
  loading: boolean;
}) => {
  const context = React.useContext(UserContext);
  const [requirement, setRequirement] = React.useState<any>(null);
  const { requestSSN9, requestResAddress, requestScanID } = context.userStatus;
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
    };
  };
  function getNextRequirement() {
    if (
      requirement === AdditionalRequirementsEnum.requestSSN9 &&
      requestResAddress
    ) {
      return AdditionalRequirementsEnum.requestResAddress;
    } else if (
      requirement === AdditionalRequirementsEnum.requestResAddress &&
      requestScanID
    ) {
      return AdditionalRequirementsEnum.requestScanID;
    }

    return null;
  }

  async function handleSuccess() {
    const nextRequirement = getNextRequirement();

    if (!nextRequirement) {
      handleRequirementsComplete();
    } else {
      setRequirement(nextRequirement);
    }
  }
  async function getFirstRequirement() {
    if (requestSSN9) {
      return AdditionalRequirementsEnum.requestSSN9;
    }
    if (requestResAddress) {
      return AdditionalRequirementsEnum.requestResAddress;
    }
    if (requestScanID) {
      context.setDlAction("frontscan");
      const userPortrait: any = await getUserPortrait(context.id);
      await convertLinkToImageData(
        userPortrait.imagedata,
        context.setEnrollImageData
      );
      return AdditionalRequirementsEnum.requestScanID;
    }
    return null;
  }

  React.useEffect(() => {
    const getRequirements = async () => {
      setRequirement(await getFirstRequirement());
    };
    getRequirements();
  }, []);

  React.useEffect(() => {
    if (requirement === AdditionalRequirementsEnum.requestScanID) {
      setStep(STEPS.DRIVERLICENSE);
    }
  }, [requirement]);

  if (requirement === AdditionalRequirementsEnum.requestSSN9) {
    return (
      <RequestSSN
        setStep={setStep}
        skin={skin}
        matchesSM={matchesSM}
        loading={loading}
        onSuccess={handleSuccess}
        setPrevStep={setPrevStep}
      />
    );
  }
  if (requirement === AdditionalRequirementsEnum.requestResAddress) {
    return (
      <RequestAddress
        setStep={setStep}
        skin={skin}
        loading={loading}
        matchesSM={matchesSM}
        onSuccess={handleSuccess}
        setPrevStep={setPrevStep}
      />
    );
  }

  return <></>;
};

export default AdditionalRequirements;
