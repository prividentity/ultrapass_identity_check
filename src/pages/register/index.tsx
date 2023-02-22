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
      case STEPS.REGISTER_FORM:
        return (
          <RegisterInputs
            matchesSM={matchesSM}
            setStep={setStep}
            setPrevStep={setPrevStep}
            skin={skin}
          />
        );
      case STEPS.CONSENT:
        return <></>;

      case STEPS.CONSENT_FAIL:
        return <></>;
      case STEPS.ENROLL:
        return <></>;
      case STEPS.DRIVERLICENSE:
        return <></>;
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
        <HomeModal handleClose={() => {console.log("CLOSE HERE")}} open={true}>
          {_renderChildren()}
        </HomeModal>
      </div>
    </>
  );
};

export default Register;
