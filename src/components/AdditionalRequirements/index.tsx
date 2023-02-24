import React from "react";
import { UserContext } from "../../context/UserContext";
import RequestAddress from "../RequestAddress";
import RequestSSN from "../RequestSsn/index";
import STEPS from "../../pages/register/steps";
import { AdditionalRequirementsEnum } from "../../utils";
import { verifyIdApi } from "../../services/api";
import useToast from "../../utils/useToast";

const AdditionalRequirements = ({
  matchesSM,
  setStep,
  skin,
  handleRequirementsComplete,
  setPrevStep,
}: {
  matchesSM: boolean;
  setStep: any;
  skin: string;
  handleRequirementsComplete: () => void;
  setPrevStep: (e: string) => void;
}) => {
  const context = React.useContext(UserContext);
  const [requirement, setRequirement] = React.useState(
    AdditionalRequirementsEnum.requestSSN9
  );
  const { requestSSN9, requestResAddress, requestScanID } = context.userStatus;
  const { showToast } = useToast();
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
  function getFirstRequirement() {
    if (requestSSN9) {
      return AdditionalRequirementsEnum.requestSSN9;
    }
    if (requestResAddress) {
      return AdditionalRequirementsEnum.requestResAddress;
    }
    if (requestScanID) {
      return AdditionalRequirementsEnum.requestScanID;
    }
    return AdditionalRequirementsEnum.requestSSN9;
  }

  React.useEffect(() => {
    setRequirement(getFirstRequirement());
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
        matchesSM={matchesSM}
        onSuccess={handleSuccess}
        setPrevStep={setPrevStep}
      />
    );
  }

  return <></>;
};

export default AdditionalRequirements;
