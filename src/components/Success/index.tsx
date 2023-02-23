import { Button, Divider, Grid, Typography } from "@mui/material";
import { useStyles, styles } from "../../pages/register/styles";
import { theme as Theme } from "../../theme";
import { useNavigate } from "react-router";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Success = ({
  setStep,
  skin,
  matchesSM,
}: {
  setStep: any;
  skin: string;
  matchesSM: boolean;
}) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const mainTheme = Theme;
  const palette: { [key: string]: any } = mainTheme.palette;

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
          Verification Successful!
        </Typography>
      </Grid>
      {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
      <Grid style={styles.cardGrid} className={classes.cardGridMobile}>
        <CheckCircleIcon className={classes.checkIcon} />
        <Typography
          component="p"
          textAlign={ "center"}
          fontSize={20}
          fontWeight={900}
          lineHeight={1.5}
          mt={2}
          className={classes.cardInnerHeading}
        >
          You successfully completed your ID verification.
        </Typography>
      </Grid>
      <Grid style={{ marginBottom: 50 }}>
        {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
        <Button
          variant="contained"
          color={"inherit"}
          style={styles.continueButton}
          onClick={() => navigate("/")}
        >
          <Typography
            component="p"
            color={palette?.[skin]?.text}
            textAlign="center"
            fontWeight={600}
            display="flex"
            alignItems="center"
            justifyContent={"center"}
            textTransform="capitalize"
          >
            Continue
          </Typography>
        </Button>
      </Grid>
    </>
  );
};

export default Success;