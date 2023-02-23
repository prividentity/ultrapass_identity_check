import {
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import shield from "../../../assets/shield.png";
import { styles, useStyles } from "../../../pages/signup/styles";
import PredictAge from "../../PredictAge";

interface props {
  isUserVerify: boolean;
  setStep: (e: number) => void;
  stopCamera: () => void;
  onAgeChange: (e: number) => void;
  onCameraNotGranted: (e: boolean) => void;
  enrollStatus: string;
  enrollOneFaProgress: number;
  enrolling: boolean;
}

const FaceAgeScan = (props: props) => {
  const {
    setStep,
    isUserVerify,
    stopCamera,
    onAgeChange,
    onCameraNotGranted,
    enrollStatus,
    enrollOneFaProgress,
    enrolling
  } = props;
  const muiTheme = useTheme();
  const matchesSM = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const classes = useStyles();
  return (
    <>
      <Box position={"relative"} padding={"10px 10px"} mt={4} pr={"12px"}>
        {isUserVerify && (
          <Box style={styles.overlayCamera as React.CSSProperties}>
            <img
              src={shield}
              alt="shield"
              style={styles.shield as React.CSSProperties}
            />
          </Box>
        )}
        <Box className={classes.otherOptions}>
          <Typography
            component="p"
            textAlign={matchesSM ? "center" : "left"}
            fontSize={15}
            fontWeight={500}
            mt={2}
            onClick={() => {
              setStep(14);
              stopCamera();
            }}
          >
            <PhoneIphoneIcon /> Switch to other device
          </Typography>
        </Box>
        <PredictAge
          enrollAge={onAgeChange}
          onReadyCallback={onCameraNotGranted}
          message={enrollStatus}
        />
        <Box style={{ height: 50 }}>
          <Box style={{ height: 14 }}>
            {enrollOneFaProgress > 0 && (
              <LinearProgress
                variant="determinate"
                value={enrollOneFaProgress}
              />
            )}
          </Box>
          {enrollOneFaProgress === 100 && enrolling ? (
            <Typography
              component="p"
              textAlign="center"
              fontSize={14}
              fontWeight={700}
              mt={1}
              mb={1}
              color={"#333"}
            >
              <CircularProgress style={styles.scanLoader} /> Verifying User,
              this might take some minutes…
            </Typography>
          ) : null}
        </Box>
      </Box>
    </>
  );
};

export default FaceAgeScan;
