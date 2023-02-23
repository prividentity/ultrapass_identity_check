import { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styles } from "../../pages/signup/styles";
import { useNavigate } from "react-router";
import { createVerificationSession } from "../../services/api";
import { createSearchParams } from "react-router-dom";
import config from "../../config";
import { useStyles } from "../../pages/home/styles";

interface props {
  theme?: string;
  skin?: string;
}
const HomeComponent = ({ theme, skin }: props) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [loading, setLoading] = useState(false);
  const [flow] = useState(1);
  const navigate = useNavigate();
  const classes = useStyles();
  const muiTheme = useTheme();
  const matchesSM = useMediaQuery(muiTheme.breakpoints.down("sm"));

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
  return (
    <>
      <Container maxWidth="xl">
        <Box>
          <Typography
            component="h2"
            color={`${theme}.text`}
            fontSize={52}
            fontWeight={500}
            lineHeight={"60px"}
            letterSpacing={"1px"}
            className={classes.homeHeading}
          >
            Private Verified Identity
          </Typography>
          <Typography
            component="p"
            color={`${theme}.text`}
            fontSize={18}
            fontWeight={500}
            className={classes.homeSubHeading}
            mt={2}
          >
            Protect privacy with Cryptonets FHE
          </Typography>
          <Box pt={5} className={classes.buttonsGrid}>
            <Grid container alignItems="center" className={classes.buttonsWrap}>
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
                  `Verify me`
                )}
              </Button>
              {matchesSM ? null : (
                <Button
                  style={styles.ageLearnMoreButton}
                  sx={{ textTransform: "unset" }}
                  className={classes.buttonsWrapButton}
                >
                  Go for a test drive!
                </Button>
              )}
            </Grid>
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
