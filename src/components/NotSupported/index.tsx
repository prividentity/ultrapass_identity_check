import useToast from "../../utils/useToast";
import PhoneInput from "react-phone-number-input";
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
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import QRCode from "react-qr-code";
import Grid from "@mui/material/Grid";
import { Email as EmailIcon, ContentCopy } from "@mui/icons-material";
import { sendMessage, sendSMS } from "../../services/api";
import PhoneInputComponent from "../PhoneInput";

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
))(({ theme }) => ({
  textTransform: "none",
  fontWeight: theme.typography.fontWeightBold,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  color: "rgba(0, 0, 0, 0.8)",
  "&.Mui-selected": {
    color: "#ff9900",
  },
}));

export default function NotSupported() {
  const { showToast } = useToast();
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [value, setValue] = React.useState(0);
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const sendPhone = async () => {
    const payload = {
      type: "phone",
      phone,
      subject: "Continue your verification",
      message: `to continue your verification process, Please delete this message if you did not request this verification.`,
      endpoint: window.location.search,
    };
    setIsLoading(true);
    const response = await sendSMS(payload);
    setIsLoading(false);
    showToast("Message sent successfully", "success");
  };
  const sendEmail = async () => {
    const payload = {
      type: "email",
      email,
      subject: "Continue your verification",
      message: `to continue your verification process, Please delete this message if you did not request this verification.`,
      endpoint: window.location.search,
    };
    setIsLoading(true);
    const response = await sendMessage(payload);
    setIsLoading(false);
    showToast("Message sent successfully", "success");
  };

  return (
    <Grid container direction={"column"} my={1}>
      <Grid item container>
        <Typography
          align={matchesSM ? "center" : "left"}
          variant={"subtitle1"}
          p={2}
          pb={1}
          fontWeight={600}
        >
          Sorry, your device does not support WASM or WebRTC.
          <br /> Please try updating your OS and Browser.
          <br /> You can also try to switching to another device.
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
              backgroundColor: "#ff9900",
            },
          }}
        >
          <StyledTab label="SMS" />
          <StyledTab label="QR Code" />
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
            <PhoneInput
              value={phone}
              autoFocus
              onChange={(value) => setPhone(value as string)}
              inputComponent={React.forwardRef(PhoneInputComponent)}
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
              sx={{ width: "100%" }}
            >
              {isLoading ? <CircularProgress /> : "Send Link"}
            </Button>
          </Stack>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
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
              <QRCode size={200} value={window.location.origin.toString()} />
            </Box>
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
              sx={{ width: "100%" }}
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
                navigator.clipboard.writeText(
                  window.location.origin.toString()
                );
                showToast("Link copied to clipboard", "success");
              }}
              sx={{ width: "100%" }}
            >
              Copy link
            </Button>
          </Stack>
        </TabPanel>
      </Grid>
    </Grid>
  );
}
