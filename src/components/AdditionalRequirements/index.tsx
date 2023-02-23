import React from "react";
import { UserContext } from "../../context/UserContext";
import RequestAddress from "../RequestAddress";
import RequestSSN from "../RequestSsn/index";
import STEPS from "../../pages/register/steps";

enum AdditionalRequirementsEnum {
  requestSSN9 = "requestSSN9",
  requestResAddress = "requireResAddress",
  requestScanID = "requestScanID",
}

const AdditionalRequirements = ({
  matchesSM,
  setStep,
  skin,
}: {
  matchesSM: boolean;
  setStep: any;
  skin: string;
}) => {
  const context = React.useContext(UserContext);
  const [requirement, setRequirement] = React.useState(
    AdditionalRequirementsEnum.requestSSN9
  );
  const { requestSSN9, requestResAddress, requestScanID } = context.userStatus;

  console.log({ requestSSN9, requestResAddress, requestScanID });
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

  function handleSuccess() {
    const nextRequirement = getNextRequirement();
    if (!nextRequirement) {
      alert("No more requirements");
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
      />
    );
  }

  return <></>;
};

export default AdditionalRequirements;
