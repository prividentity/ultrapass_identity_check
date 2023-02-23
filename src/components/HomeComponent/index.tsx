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
import { styles } from "../../pages/signup/styles";
import { useNavigate } from "react-router";
import { createVerificationSession } from "../../services/api";
import { createSearchParams, useSearchParams } from "react-router-dom";
import config from "../../config";
import { useStyles } from "../../pages/home/styles";
import { nameMap } from "../../theme";

interface props {
  theme?: string;
  skin?: string;
}
const HomeComponent = ({ theme, skin }: props) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [loading, setLoading] = useState(false);
  const [flow, setFlow] = useState(1);
  const navigate = useNavigate();
  const classes = useStyles();
  const muiTheme = useTheme();
  const matchesSM = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const [searchParams] = useSearchParams();
  const skinQueryParam = searchParams.get("skin") as string;
  const name = nameMap[skinQueryParam || "up"] || skinQueryParam;
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
  return (
    <>
      <Container maxWidth="xl">
        <Box>
          <Typography
            component="h2"
            color={`${theme}.text`}
            fontSize={52}
            fontWeight={700}
            lineHeight={"60px"}
            letterSpacing={"1px"}
            className={classes.homeHeading}
          >
            SELECT YOUR <br /> {name.toLocaleUpperCase()} EXPERIENCE
          </Typography>
          <Typography
            component="p"
            color={`${theme}.text`}
            fontSize={16}
            fontWeight={500}
            className={classes.homeSubHeading}
            mt={2}
          >
            Sign up for free to enjoy all of the perks that come with a {name}{" "}
            membership.
            <br />
            Better yet, level up and join {name} Premium for the ultimate
            experience!
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
                  `I'm over 18 `
                )}
              </Button>
              {matchesSM ? null : (
                <Button
                  style={styles.ageLearnMoreButton}
                  sx={{ textTransform: "unset" }}
                  className={classes.buttonsWrapButton}
                >
                  Learn more
                </Button>
              )}
            </Grid>
          </Box>
          <Box pt={0}>
            <Grid container alignItems="center" className={classes.buttonsWrap}>
              {matchesSM ? (
                <Button
                  sx={{
                    textTransform: "unset",
                    paddingTop: "0px",
                    height: 53,
                    alignItems: "flex-start",
                  }}
                  variant="contained"
                  style={styles.ageVerifiedButton}
                  disabled={loading}
                  className={classes.buttonsWrapButton}
                >
                  Sign in with {name}
                  <p>Content Partners and Models</p>
                </Button>
              ) : (
                <Button
                  sx={{ textTransform: "unset" }}
                  variant="contained"
                  style={styles.ageVerifiedButton}
                  disabled={loading}
                  className={classes.buttonsWrapButton}
                >
                  Sign in with {name}
                </Button>
              )}

              {matchesSM ? null : (
                <Button
                  style={styles.ageLearnMoreButton}
                  sx={{ textTransform: "unset" }}
                  className={classes.buttonsWrapButton}
                >
                  Content Partners and Models
                </Button>
              )}
            </Grid>
          </Box>
          <Box className={classes.buttonsBox}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={flow}
              onChange={handleChange}
              className={classes.flowdropDown}
            >
              <MenuItem value={1}>
                Normal flow (Face scan, ID check, Credit check)
              </MenuItem>
              <MenuItem value={2}>Fail Face scan</MenuItem>
              <MenuItem value={4}>
                Fail Face scan, skip to database check
              </MenuItem>
              <MenuItem value={5}>Skip to database check</MenuItem>
            </Select>
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
        </Box>
      </Container>
    </>
  );
};

export default HomeComponent;
