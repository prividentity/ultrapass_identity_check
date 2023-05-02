import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router";
import { createSearchParams } from "react-router-dom";

import { styles } from "../../pages/signup/styles";
import {
  createVerificationSession,
  getProductGroupList,
} from "../../services/api";
import config from "../../config";
import { useStyles } from "../../pages/home/styles";
import {
  getStatusFromUser,
  navigateToUrl,
  SUCCESS,
  FAILURE,
} from "../../utils";

interface props {
  theme?: string;
  skin?: string;
}
const HomeComponent = ({ theme, skin }: props) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [loading, setLoading] = useState(false);
  const [flow] = useState(1);
  const [productGroup, setProductGroup] = useState<
    { name: string; _id: string }[]
  >([]);
  const [selectedProductGroup, setSelectedProductGroup] =
    useState<string>("intergalactic");
  const navigate = useNavigate();
  const classes = useStyles();
  const muiTheme = useTheme();
  const url = new URL(window.location.href);
  const matchesSM = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const createVerification = async () => {
    if (user?._id && user?.token) {
      navigateToUrl(user?.successUrl, user?.token);
      return;
    }
    setLoading(true);
    const payload = {
      ...config.clientConfig,
      productGroupId: selectedProductGroup || "intergalactic",
    };
    const result: any = await createVerificationSession(payload);
    if (result?.token) {
      onFlowChange(flow, result?.token, result?.url);
    }
    setLoading(false);
  };

  const onFlowChange = (flow: number, token: string, url?: string) => {
    switch (flow) {
      case 1:
        window.location.href = url || `/register?token=${token}&skin=${skin}`;
        break;
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

  function renderVerificationButton() {
    const userStatus = getStatusFromUser(user || {});
    if (userStatus === SUCCESS) {
      return (
        <Button
          sx={{ textTransform: "unset", opacity: 0.8 }}
          variant="contained"
          style={styles.ageVerifiedButton}
          className={classes.buttonsWrapButton}
        >
          {"You are verified"}
        </Button>
      );
    } else if (userStatus === FAILURE && user._id) {
      return (
        <Button
          sx={{ textTransform: "unset", opacity: 0.8 }}
          variant="contained"
          style={styles.ageFailedButton}
          className={classes.buttonsWrapButton}
        >
          {"Verification Failed"}
        </Button>
      );
    } else {
      return (
        <Button
          sx={{ textTransform: "unset", opacity: loading ? 0.8 : 1 }}
          variant="contained"
          style={styles.ageVerifiedButton}
          onClick={() => createVerification()}
          disabled={loading}
          className={classes.buttonsWrapButton}
        >
          {loading ? (
            <CircularProgress className={classes.homeLoader} />
          ) : (
            "Verify me"
          )}
        </Button>
      );
    }
  }

  const getProductGroup = async () => {
    const result: any = await getProductGroupList();
    const prodList = result?.filter(
      (product: { isProd: boolean }) => product?.isProd
    );
    const devList = result?.filter(
      (product: { isProd: boolean; isDraft: boolean }) =>
        !product.isProd && !product.isDraft
    );
    const isDev = url?.search?.split("environment=")?.[1] === "dev";
    setProductGroup(isDev ? devList : prodList);
  };

  useEffect(() => {
    getProductGroup();
  }, []);

  const handleChange = (e: any) => {
    setSelectedProductGroup(e?.target?.value);
  };
  return (
    <>
      <Container maxWidth="xl">
        <Box className={classes.mainWrap}>
          <Box className={classes.innerWrap}>
            <Typography
              component="h2"
              color={`${theme}.text`}
              fontSize={52}
              fontWeight={500}
              lineHeight={"60px"}
              letterSpacing={"1px"}
              className={classes.homeHeading}
              mt={skin === "stncharms" && matchesSM ? 4 : ""}
            >
              {skin === "stncharms"
                ? "Private Verified Identity"
                : "UltraPass ID"}
            </Typography>
            {skin !== "stncharms" && (
              <Typography
                component="p"
                color={`${theme}.text`}
                fontSize={30}
                fontWeight={500}
                className={classes.homeSubHeading}
                mt={0}
              >
                Private Verified Identity
              </Typography>
            )}
          </Box>
          <Box pt={5} className={classes.buttonsGrid}>
            <Grid container alignItems="center" className={classes.buttonsWrap}>
              {renderVerificationButton()}
              {matchesSM ? null : (
                <Button
                  style={styles.ageLearnMoreButton}
                  sx={{
                    textTransform: "unset",
                    textAlign: "center",
                    width: 250,
                  }}
                  className={classes.buttonsWrapButton}
                >
                  Go for a test drive!
                </Button>
              )}
            </Grid>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedProductGroup}
              onChange={handleChange}
              className={classes.flowdropDown}
              MenuProps={{ classes: { paper: classes.menuPaper } }}
            >
              {productGroup?.length ? (
                [
                  {
                    name: "Select Product Group",
                    _id: "1",
                    apiValue: "intergalactic",
                  },
                  ...productGroup,
                ]
                  ?.filter((product: { name: string }) => product?.name)
                  ?.map((product: any) => (
                    <MenuItem key={product?._id} value={product?.apiValue}>
                      {product?.name}
                    </MenuItem>
                  ))
              ) : (
                <MenuItem value={"intergalactic"}>
                  Select Product Group
                </MenuItem>
              )}
            </Select>
          </Box>

          {matchesSM ? (
            <Button
              style={styles.ageLearnMoreButton}
              sx={{ textTransform: "unset" }}
              className={classes.buttonsWrapButton}
            >
              Learn more
            </Button>
          ) : null}
        </Box>
      </Container>
    </>
  );
};

export default HomeComponent;
