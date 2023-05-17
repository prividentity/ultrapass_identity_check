import useToast from "../../utils/useToast";
import "react-phone-number-input/style.css";
import * as React from "react";
import { useTheme, styled } from "@mui/material/styles";
import {
  Stack,
  Button,
  TextField,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import Input from "react-phone-number-input/input";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import QRCode from "react-qr-code";
import Grid from "@mui/material/Grid";
import { Email as EmailIcon, ContentCopy } from "@mui/icons-material";
import { sendMessage, verifyTokenApi } from "../../services/api";
import PhoneInputComponent from "../PhoneInput";
import { useSearchParams } from "react-router-dom";
import { useInterval } from "../../utils/useInterval";
import PhoneIcon from "@mui/icons-material/Phone";
import { DEFAULT_THEME, localThemes, theme as Theme } from "../../theme";
import { navigateToUrl } from "../../utils";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

interface StyledTabProps {
  label: string;
}

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }: any) => {
  const skin = localThemes?.includes(
    window?.location?.search?.split("skin=")[1]
  )
    ? window?.location?.search?.split("skin=")[1]
    : DEFAULT_THEME;
  return {
    textTransform: "none",
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: "rgba(0, 0, 0, 0.8)",
    "&.Mui-selected": {
      color: theme?.palette?.[skin]?.primaryColor,
    },
  };
});

export default function FullWidthTabs({ skin }: any) {
  const { showToast } = useToast();
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [value, setValue] = React.useState(0);
  const [phone, setPhone] = React.useState("+1");
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [autoFocus, setAutoFocus] = React.useState(true);
  const [refreshInterval, setRefreshInterval] = React.useState<null | number>(
    5000
  );
  const [searchParams] = useSearchParams();
  const tokenParams = searchParams.get("token");
  const mainTheme = Theme;
  const palette: { [key: string]: any } = mainTheme.palette;
  useInterval(async () => {
    verifyTokenApi(tokenParams).then((res: any) => {
      if (["SUCCESS", "FAILURE"].includes(res.status)) {
        setRefreshInterval(null);
        if (res.status === "SUCCESS") {
          navigateToUrl(res.successUrl, res.token);
        } else {
          navigateToUrl(res.failureUrl, res.token);
        }
      }
    });
  }, refreshInterval);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const pathAndQuery = (
    window.location.pathname + window.location.search
  ).slice(1);

  const sendPhone = async () => {
    const payload = {
      type: "phone",
      phone: phone,
      subject: "Continue your verification",
      message: `to continue your verification process, Please delete this message if you did not request this verification.`,
      endpoint: pathAndQuery,
    };
    // console.log("Phone payload??", payload);
    setIsLoading(true);
    const response = await sendMessage(payload);
    setIsLoading(false);
    showToast("Message sent successfully", "success");
  };
  const sendEmail = async () => {
    const payload = {
      type: "email",
      email,
      subject: "Continue your verification",
      message: `to continue your verification process, Please delete this message if you did not request this verification.`,
      endpoint: pathAndQuery,
    };
    setIsLoading(true);
    const response = await sendMessage(payload);
    setIsLoading(false);
    showToast("Message sent successfully", "success");
  };

  const handlePhoneChange = (e: any) => {
    if (!autoFocus) setAutoFocus(true);
    let phoneNo = e;
    if (phoneNo && !phoneNo?.startsWith("+1")) {
      phoneNo = `+1${phoneNo.slice(1)}`;
    }
    setPhone(phoneNo);
  };
  return (
    <Grid container direction={"column"} my={1}>
      <Grid item container>
        <Typography
          align={matchesSM ? "center" : "left"}
          variant={"h6"}
          p={2}
          pb={1}
          fontWeight={600}
        >
          Continue your verification
        </Typography>
      </Grid>
      <Grid
        item
        sx={{ bgcolor: "background.paper", width: "100%", height: "400px" }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit"
          variant="fullWidth"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: palette?.[skin]?.primaryColor,
            },
          }}
        >
          <StyledTab label="QR Code" />
          <StyledTab label="SMS" />
          <StyledTab label="Email" />
          <StyledTab label="Link" />
        </Tabs>

        <TabPanel value={value} index={0} dir={theme.direction}>
          <Stack display={"flex"} direction={"column"} gap={2}>
            <Typography
              align={matchesSM ? "center" : "left"}
              component={"p"}
              variant="h6"
            >
              Scan QR code.
            </Typography>

            <Typography
              align={matchesSM ? "center" : "left"}
              component={"p"}
              variant="body1"
            >
              Point your phone's camera at the image to follow the link.
            </Typography>

            <Box display="flex" justifyContent={"center"}>
              <QRCode size={200} value={window.location.toString()} />
            </Box>
          </Stack>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Stack display={"flex"} direction={"column"} gap={2}>
            <Typography
              align={matchesSM ? "center" : "left"}
              component={"p"}
              variant="h6"
            >
              Receive a link via text message.
            </Typography>

            <Typography
              align={matchesSM ? "center" : "left"}
              component={"p"}
              variant="body1"
            >
              Enter your mobile number and we will send you a link to complete
              this verification on a different device.
            </Typography>
            <Input
              style={{ width: "100%" }}
              value={phone}
              autoFocus={autoFocus}
              onChange={handlePhoneChange}
              sx={{
                "& .MuiFormHelperText-contained": {
                  color: "red",
                },
              }}
              placeholder="Mobile number"
              inputComponent={React.forwardRef((props, ref) => (
                <PhoneInputComponent
                  {...props}
                  inputRef={ref}
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ pr: 1 }} />,
                  }}
                  inputProps={{
                    maxLength: phone?.startsWith("+1") ? 15 : 11,
                  }}
                  sx={{
                    ".Mui-focused fieldset": {
                      borderColor: `${palette[skin]?.primaryColor} !important`,
                    },
                    "label.Mui-focused ": {
                      color: `${palette[skin]?.primaryColor} !important`,
                    },
                  }}
                />
              ))}
            />
            <Typography
              align={matchesSM ? "center" : "left"}
              component={"p"}
              variant="body2"
            >
              Standard messaging rates may apply.
            </Typography>
            <Button
              onClick={sendPhone}
              variant="contained"
              sx={{
                width: "100%",
                backgroundColor: palette[skin]?.primaryColor,
              }}
            >
              {isLoading ? <CircularProgress /> : "Send Link"}
            </Button>
          </Stack>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <Stack display={"flex"} direction={"column"} gap={2}>
            <Typography
              align={matchesSM ? "center" : "left"}
              component={"p"}
              variant="h6"
            >
              Receive a link via email
            </Typography>

            <Typography
              align={matchesSM ? "center" : "left"}
              component={"p"}
              variant="body1"
            >
              Enter your email address and we will send you a link to complete
              this verification on a different device.
            </Typography>

            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                endAdornment: <EmailIcon />,
              }}
              sx={{
                ".Mui-focused fieldset": {
                  borderColor: `${palette[skin]?.primaryColor} !important`,
                },
                "label.Mui-focused ": {
                  color: `${palette[skin]?.primaryColor} !important`,
                },
              }}
            />

            <Typography
              align={matchesSM ? "center" : "left"}
              component={"p"}
              variant="body2"
            >
              If you do not see the email, then please check your spam folder.
            </Typography>

            <Button
              onClick={sendEmail}
              variant="contained"
              sx={{
                width: "100%",
                backgroundColor: palette[skin]?.primaryColor,
              }}
            >
              {isLoading ? <CircularProgress /> : "Send link"}
            </Button>
          </Stack>
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
          <Stack display={"flex"} direction={"column"} gap={2}>
            <Typography
              align={matchesSM ? "center" : "left"}
              component={"p"}
              variant="h6"
            >
              Copy link
            </Typography>

            <Typography
              align={matchesSM ? "center" : "left"}
              component={"p"}
              variant="body1"
            >
              Open this link to complete this verification on a different
              device.
            </Typography>

            <Button
              endIcon={<ContentCopy />}
              variant="contained"
              onClick={() => {
                navigator.clipboard.writeText(window.location.toString());
                showToast("Link copied to clipboard", "success");
              }}
              sx={{
                width: "100%",
                backgroundColor: palette[skin]?.primaryColor,
              }}
            >
              Copy link
            </Button>
          </Stack>
        </TabPanel>
      </Grid>
    </Grid>
  );
}
