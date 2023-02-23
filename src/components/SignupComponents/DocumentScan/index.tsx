import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import smallLock from "../../../assets/smallLock.png";
import DlFront from "../../../assets/dl-front.png";
import DlBack from "../../../assets/Hand-DL-Back.png";
import shield from "../../../assets/shield.png";
import { styles, useStyles } from "../../../pages/signup/styles";
import ScanBackDocument from "../../DocumentCamera/ScanBackDocument";
import ScanFrontDocument from "../../DocumentCamera/ScanFrontDocument";

interface props {
  skin: string;
  palette: { [key: string]: any };
  isBackScan: boolean;
  isUserVerify: boolean;
  onBackSuccess: (e: any) => void;
  onFrontSuccess: (e: any) => void;
  onCameraNotGranted: (e: boolean) => void;
  isScanning: boolean;
}

const DocumentScan = (props: props) => {
  const {
    skin,
    palette,
    isBackScan,
    isUserVerify,
    onBackSuccess,
    onFrontSuccess,
    onCameraNotGranted,
    isScanning,
  } = props;
  const muiTheme = useTheme();
  const matchesSM = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const classes = useStyles();
  return (
    <>
      <Grid container alignItems="center" justifyContent={"center"}>
        <Typography
          component="p"
          textAlign="center"
          fontSize={16}
          fontWeight={900}
          letterSpacing={"1px"}
          sx={{ paddingTop: 3, paddingBottom: 2 }}
          className={classes.cardHeading}
        >
          <img src={smallLock} alt="smallLock" className={classes.smallLock} />
          ANONYMOUS AGE VERIFICATION
        </Typography>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Grid style={styles.cardGrid} className={`cardGridMobile overflowUnset`}>
        <Box position={"relative"}>
          <Box position={"relative"}>
            <img
              src={isBackScan ? DlBack : DlFront}
              alt="DlFront"
              style={styles.DlFront as React.CSSProperties}
              className="DlBack"
            />
            {isUserVerify && (
              <Box style={styles.overlay as React.CSSProperties}>
                <img
                  src={shield}
                  alt="shield"
                  style={styles.shield as React.CSSProperties}
                />
              </Box>
            )}
            {isBackScan ? (
              <ScanBackDocument
                onSuccess={onBackSuccess}
                onReadyCallback={onCameraNotGranted}
              />
            ) : (
              <ScanFrontDocument
                onSuccess={onFrontSuccess}
                onReadyCallback={onCameraNotGranted}
                onFailCallback={()=>{}}
              />
            )}
          </Box>
        </Box>
      </Grid>
      <Box style={{ height: 106 }}>
        {isScanning ? (
          <Typography
            component="p"
            textAlign="center"
            fontSize={14}
            fontWeight={500}
            mt={1}
            mb={2}
          >
            <CircularProgress style={styles.scanLoader} /> Scanning...
          </Typography>
        ) : null}

        <Typography
          component="p"
          textAlign="center"
          fontSize={14}
          fontWeight={500}
          mt={1}
          mb={2}
        >
          {isBackScan
            ? "Place the back of the Driver’s License above"
            : "Place the front of the Driver’s License above"}
        </Typography>
      </Box>
    </>
  );
};

export default DocumentScan;
