import { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  Select,
  MenuItem,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import womenImg from "../../assets/Kimiko-S3.png";
import { styles } from "../signup/styles";
import { useNavigate } from "react-router";
import { createVerificationSession } from "../../services/api";
import { createSearchParams } from "react-router-dom";
import config from "../../config";
import { headerVisible } from "../../theme";
import Header from "../../components/Header";
import { useStyles } from "./styles";
import HomeComponent from "../../components/HomeComponent";

interface props {
  theme: string;
  skin: string;
}
const Home = ({ theme, skin }: props) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [loading, setLoading] = useState(false);
  const [flow, setFlow] = useState(1);
  const navigate = useNavigate();
  const classes = useStyles();
  const muiTheme = useTheme();
  const matchesSM = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const handleChange = (e: any) => {
    setFlow(e?.target?.value);
  };

  const navigateToUrl = (url: string, token?: string) => {
    window.open(`${url}?token=${token}`, "_self");
  };

  const createVerification = async () => {
    if (user?._id || user?.token) {
      navigateToUrl(user?.successUrl, user?.token);
      return;
    }
    setLoading(true);
    const payload = config.clientConfig;
    const result: any = await createVerificationSession(payload);
    if (result?.token) {
      onFlowChange(flow, result?.token);
    }
    setLoading(false);
  };

  const onFlowChange = (flow: number, token: string) => {
    switch (flow) {
      case 1:
        return navigate({
          pathname: "/register",
          search: createSearchParams({
            token: token || "",
          }).toString(),
        });
      case 2:
        return navigate({
          pathname: "/register",
          search: createSearchParams({
            token: token || "",
            age: "18",
          }).toString(),
        });
      case 3:
        return navigate({
          pathname: "/register",
          search: createSearchParams({
            token: token || "",
            age: "16",
          }).toString(),
        });
      case 4:
        return navigate({
          pathname: "/register",
          search: createSearchParams({
            token: token || "",
            ageCreditCheck: "true",
          }).toString(),
        });

      case 5:
        return navigate({
          pathname: "/register",
          search: createSearchParams({
            token: token || "",
            step: "9",
          }).toString(),
        });

      default:
        break;
    }
  };

  const themeName = skin || "primary";
  return (
    <>
      {headerVisible?.includes(skin) && <Header theme={themeName} />}
      <div className="homePageWrapper">
        <HomeComponent theme={theme} skin={skin} />
        <div className="homeSidebarImg">
          <img src={womenImg} alt="women" />
        </div>
      </div>
    </>
  );
};

export default Home;
