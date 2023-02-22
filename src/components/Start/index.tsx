import React,{useState} from 'react';
import { Button, Divider, Grid, Typography } from '@mui/material';

import { useStyles, styles } from "../../pages/register/styles";
import { theme as Theme, theme } from "../../theme";

import smallLock from "../../assets/smallLock.png";
import { name } from 'platform';
import STEPS from '../../pages/register/steps';

const Start = ({
    setStep,
    setPrevStep,
    skin,
    matchesSM,
  }: {
    setStep: any;
    setPrevStep: any;
    skin: string;
    matchesSM: boolean;
  }) =>{
    const classes = useStyles();
    const mainTheme = Theme;
    const palette: { [key: string]: any } = mainTheme.palette;

    return(
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
            <img
              src={smallLock}
              alt="smallLock"
              className={classes.smallLock}
            />
            IDENTITY VERIFICATION
          </Typography>
        </Grid>
        {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
        <Grid style={styles.cardGrid} className={classes.cardGridMobile}>
          <Typography
            component="p"
            textAlign={matchesSM ? "center" : "left"}
            fontSize={17}
            fontWeight={700}
            lineHeight={1.5}
            mt={2}
            className={classes.cardInnerHeading}
          >
            {name} partners with AllpassTrust for
            <br /> secure, identity verification.
          </Typography>
          <Typography
            component="p"
            textAlign={matchesSM ? "center" : "left"}
            fontSize={17}
            fontWeight={500}
            mt={2}
            className={classes.cardInnerHeading}
          >
            Get ready to take a selfie and scan your Driver License.
          </Typography>
          <Typography
            component="p"
            textAlign={matchesSM ? "center" : "left"}
            fontSize={14}
            fontWeight={700}
            mt={3}
            color={"#333"}
            className={classes.cardInnerText}
          >
            How AllpassTrust will verify your identity ?
          </Typography>
          <Typography
            component="p"
            textAlign={matchesSM ? "center" : "left"}
            fontSize={13}
            fontWeight={500}
            mt={2}
            className={classes.cardInnerText}
          >
            AllpassTrust will use your selfie to check your identity. Your
            image will be deleted immediately after processing. No images or
            information will be shared with {name}. Data will be strictly
            processed according to the AllpassTrust Privacy Policy. Learn
            how AllpassTrust works.
          </Typography>
        </Grid>
        <Grid>
          {!matchesSM && <Divider color={palette?.[skin]?.listText} />}
          <Button
            variant="contained"
            color={'inherit'}
            style={styles.continueButton}
            onClick={() => setStep(STEPS.REGISTER_CONSENT)}
          >
            <Typography
              component="p"
              color={palette?.[skin]?.listText}
              textAlign="center"
              fontWeight={600}
              display="flex"
              alignItems="center"
              justifyContent={"center"}
              textTransform="capitalize"
            >
              Agree and continue
            </Typography>
          </Button>
          <Button
            variant="text"
            color={"inherit"}
            style={styles.textButton}
            onClick={() => {
              setStep(STEPS.CONSENT_FAIL);
              setPrevStep(STEPS.START);
            }}
          >
            <Typography
              component="p"
              color={palette?.[skin]?.listText}
              textAlign="center"
              fontWeight={500}
              display="flex"
              alignItems="center"
              justifyContent={"center"}
              textTransform="capitalize"
              fontSize={14}
              className={classes.textButtonUnderline}
            >
              No, I do not consent
            </Typography>
          </Button>
        </Grid>
      </>
    )
}

export default Start;
