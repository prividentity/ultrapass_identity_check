import React from "react";
import { Grid } from "@mui/material";
import { UserContext } from "../../context/UserContext";
import RequestAddress from "../RequestAddress";
import RequestSSN from "../RequestSsn/index";
import STEPS from "../../pages/register/steps";

enum AdditionalRequirementsEnum {
  requestSSN9 = "requestSSN9",
  requireResAddress = "requireResAddress",
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
  const { requestSSN9, requireResAddress, requestScanID } =
    context?.userStatus || {};

  function getNextRequirement() {
    if (
      requirement === AdditionalRequirementsEnum.requestSSN9 &&
      requireResAddress
    ) {
      return AdditionalRequirementsEnum.requireResAddress;
    } else if (
      requirement === AdditionalRequirementsEnum.requireResAddress &&
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
    if (requireResAddress) {
      return AdditionalRequirementsEnum.requireResAddress;
    }
    if (requestScanID) {
      return AdditionalRequirementsEnum.requestScanID;
    }
    return AdditionalRequirementsEnum.requestSSN9;
  }

  React.useEffect(() => {
    setRequirement(getFirstRequirement());
  }, []);

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
  if (requirement === AdditionalRequirementsEnum.requireResAddress) {
    return (
      <RequestAddress
        setStep={setStep}
        skin={skin}
        matchesSM={matchesSM}
        onSuccess={handleSuccess}
      />
    );
  }
  if (requirement === AdditionalRequirementsEnum.requestScanID) {
    setStep(STEPS.DRIVERLICENSE);
  }

  return <></>;
};

export default AdditionalRequirements;
