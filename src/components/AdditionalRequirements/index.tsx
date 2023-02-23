import React from "react";
import { Grid } from "@mui/material";
import { UserContext } from "../../context/UserContext";

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
  return <div>AdditionalRequirements</div>;
};

export default AdditionalRequirements;
