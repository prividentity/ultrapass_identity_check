// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
// import dayjs from "dayjs";
// import CameraAltIcon from "@mui/icons-material/CameraAlt";
// import { theme as Theme, nameMap } from "../../theme";
// import smallLock from "../../assets/smallLock.png";
// import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";

// import {
//   calculateAgeFromDate,
//   FAILURE,
//   getDateFromString,
//   REQUIRES_INPUT,
//   stopCamera,
//   SUCCESS,
// } from "../../utils";
// import useEnrollOneFa from "../../hooks/useEnrollOneFa";
// import { useWasm } from "../../hooks";
// import { payload } from "../../interface";
// import {
//   createUser,
//   deleteUserApi,
//   getUser,
//   updateUserApi,
//   verifyAge,
//   verifyTokenApi,
// } from "../../services/api";
// import womenImg from "../../assets/Kimiko-S3.png";
// import HomeModal from "../../components/Modal/homeModal";
// import useDelete from "../../hooks/useDelete";
// import { useSearchParams } from "react-router-dom";
// import useToast from "../../utils/useToast";
// import Header from "../../components/Header";
// import { headerVisible } from "../../theme";
// import FullWidthTabs from "../../components/OptionsTab";
// import useCameraPermissions from "../../hooks/useCameraPermissions";
// import VerifyIdentity from "../../components/SignupComponents/VerifyIdentity";
// import VerifyAgeWithScan from "../../components/SignupComponents/VerifyAgeWithScan";
// import FaceAgeScan from "../../components/SignupComponents/FaceAgeScan";
// import FaceUnlockForFree from "../../components/SignupComponents/FaceUnlockForFree";
// import CreateAccountConsent from "../../components/SignupComponents/CreateAccountConsent";
// import VerifyDriversLicense from "../../components/SignupComponents/VerifyDriversLicense";
// import DocumentScan from "../../components/SignupComponents/DocumentScan";
// import VerifyAgeWithDatabase from "../../components/SignupComponents/VerifyAgeWithDatabase";
// import DatabaseConsent from "../../components/SignupComponents/DatabaseConsent";
// import DatabaseInputs from "../../components/SignupComponents/DatabaseInputs";
// import CannotVerify from "../../components/SignupComponents/CannotVerify";
// import AgeCheckDatabase from "../../components/SignupComponents/AgeCheckDatabase";
// import usePredictOneFa from "../../hooks/usePredictOneFa";
// import {
//   Box,
//   Button,
//   Grid,
//   Typography,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import { useStyles, styles } from "./styles";

// interface props {
//   theme: string;
//   skin: string;
// }

// const Signup = ({ theme, skin }: props) => {
//   useWasm();
//   const localUser = JSON.parse(localStorage.getItem("user") || "{}");
//   const [searchParams] = useSearchParams();
//   const skinQueryParam = searchParams.get("skin") as string;
//   const name = nameMap[skinQueryParam || "up"] || skinQueryParam;
//   const muiTheme = useTheme();
//   const matchesSM = useMediaQuery(muiTheme.breakpoints.down("sm"));
//   const classes = useStyles();
//   const { showToast } = useToast();
//   const token = searchParams.get("token"); // "testCode"
//   const overideAge = searchParams.get("age");
//   const ageCreditCheck = searchParams.get("ageCreditCheck");
//   const paramStep = searchParams.get("step");
//   const { isCameraGranted } = useCameraPermissions();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [step, setStep] = useState(1);
//   const [prevStep, setPrevStep] = useState(0);
//   const elementId = "userVideo";
//   const [isScanning, setIsScanning] = useState(true);
//   const [isUserVerify, setIsUserVerify] = useState(false);
//   const [isBackScan, setIsBackScan] = useState(false);
//   const [enrollData, setEnrollData] = useState<payload>();
//   const [enrolling, setEnrolling] = useState(true);
//   const [user, setUser] = useState({} as { uuid?: string; guid?: string });
//   const [sessionData, setSessionData] = useState<any>({});
//   const mainTheme = Theme;
//   const palette: { [key: string]: any } = mainTheme.palette;
//   const verifyToken = async () => {
//     const result: any = await verifyTokenApi(token);
//     setSessionData(result);
//     if (result?.status === SUCCESS) {
//       const userDetails: any = await getUser({ token });
//       if (userDetails?.token) {
//         localStorage.setItem("user", JSON.stringify(result));
//       }
//       navigate("/");
//     } else if (result?.status === FAILURE) {
//       showToast("Invalid Token", "error");
//       navigate("/");
//     } else if (result?.status === REQUIRES_INPUT && isCameraGranted) {
//       setStep(7);
//     } else if (result?.status === REQUIRES_INPUT && !isCameraGranted) {
//       setStep(9);
//     }
//   };

//   useEffect(() => {
//     if (paramStep) {
//       setStep(Number(paramStep));
//     } else if (ageCreditCheck === "true") {
//       setStep(3);
//     }
//   }, [ageCreditCheck, paramStep]);

//   useEffect(() => {
//     if (localUser?.token) {
//       navigate("/");
//     } else if (token && !sessionData?.token) {
//       verifyToken();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token, isCameraGranted]);

//   const onChange = (e: { target: { name: string; value: string } }) => {
//     const name = e?.target?.name;
//     const value = e?.target?.value;
//     if (name === "zip" && value?.length > 5) return;
//     setEnrollData({
//       ...enrollData,
//       [name]: value,
//     });
//   };

//   const useEnrollSuccess = async (e: any) => {
//     setIsUserVerify(true);
//     setEnrolling(false);
//     setUser(e.PI);
//     const payload = {
//       guid: e?.PI?.guid,
//       uuid: e?.PI?.uuid,
//       token: token,
//     };
//     if (e?.PI?.guid && e?.PI?.uuid) {
//       await createUser(payload);
//       const data: any = await verifyTokenApi(token);
//       if (data?.status === SUCCESS) {
//         setSessionData(data);
//         // localStorage.setItem("user", JSON.stringify(data));
//       }
//     }
//     setIsUserVerify(false);
//     stopCamera();
//   };

//   const navigateFunc = () => {
//     if (ageCreditCheck === "true") {
//       setStep(9);
//     } else if (sessionData?.status === REQUIRES_INPUT) {
//       setStep(7);
//     } else {
//       setStep(5);
//     }
//   };

//   useEffect(() => {
//     if (user?.uuid) {
//       setTimeout(() => {
//         navigateFunc();
//       }, 1000);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user?.uuid]);

//   const {
//     enrollUserOneFa,
//     progress: enrollOneFaProgress,
//     enrollStatus,
//   } = useEnrollOneFa("userVideo", useEnrollSuccess, 4);

//   const updateUser = async (e: any, flow?: number) => {
//     const payload =
//       flow === 1
//         ? {
//             barcode: e,
//             token,
//           }
//         : e;
//     updateUserApi(payload as any);
//   };
//   // For Enroll

//   const handlePredictSuccess = async (result: any) => {
//     if (result?.PI?.uuid && result?.PI?.guid) {
//       setIsUserVerify(true);
//       setEnrolling(false);
//       setUser(result.PI);
//       const payload = {
//         guid: result?.PI?.guid,
//         uuid: result?.PI?.uuid,
//         token: token,
//       };
//       if (result?.PI?.guid && result?.PI?.uuid) {
//         const user: any = await createUser(payload);
//         const data: any = await verifyTokenApi(token);
//         if (data?.status === SUCCESS) {
//           setSessionData(data);
//           // localStorage.setItem("user", JSON.stringify(data));
//         }
//       }
//       setIsUserVerify(false);
//       stopCamera();
//     } else {
//       enrollUserOneFa();
//     }
//     console.log(result, "result");
//   };
//   const { predictUserOneFa } = usePredictOneFa(elementId, handlePredictSuccess);

//   const onAgeChange = async (e?: number, isRetry?: boolean) => {
//     predictUserOneFa();
//     const roundedAge = Math.round(e || 0);
//     if (roundedAge) {
//       if (!isRetry) {
//         const response = await checkAgeFlow(roundedAge, 0);
//         setSessionData(response?.sessionInfo);
//       }
//     }
//   };

//   const onContinue = async (e?: boolean) => {
//     setLoading(true);
//     const response = await checkAgeFlow(0, 2);
//     if (response?.sessionInfo?.status === SUCCESS) {
//       setSessionData(response?.sessionInfo);
//       // localStorage.setItem("user", JSON.stringify(response?.sessionInfo));
//       const payload = {
//         firstName: enrollData?.firstName,
//         lastName: enrollData?.lastName,
//         dob: dayjs(enrollData?.dob).format("MM/YYYY"),
//         ssn: enrollData?.ssn,
//         zip: enrollData?.zip,
//       };
//       if (user?.guid && user?.uuid) {
//         const attributes = { preferred: payload };
//         await updateUser({ attributes, token }, 2);
//       } else {
//         setSessionData(response?.sessionInfo);
//         return navigateToUrl(response?.sessionInfo?.successUrl);
//       }
//       setLoading(false);
//       setStep(5);
//     } else if (response?.sessionInfo?.status === FAILURE) {
//       setLoading(false);
//       showToast("Verification failed", "error");
//       navigateToUrl(response?.sessionInfo?.failureUrl);
//     }
//   };

//   // Back Document Success
//   const onBackSuccess = async (e: any) => {
//     if (e) {
//       setIsScanning(false);
//       const birthDate = getDateFromString(e.dateOfBirth);
//       const calculatedAge = calculateAgeFromDate(birthDate);
//       const response = await checkAgeFlow(Math.round(calculatedAge), 1);
//       if (response.sessionInfo.status === SUCCESS) {
//         setSessionData(response?.sessionInfo);
//         // localStorage.setItem("user", JSON.stringify(response?.sessionInfo));
//         setIsUserVerify(true);
//         await updateUser(e?.barcodeHash128_string, 1);
//         setIsUserVerify(false);
//         stopCamera();
//         setStep(5);
//         // setTimeout(() => {
//         //
//         // }, 4000);
//       } else if (response?.sessionInfo?.status === FAILURE) {
//         showToast("Verification failed", "error");
//         navigateToUrl(response?.sessionInfo?.failureUrl);
//       } else {
//         showToast("User Age Verification Failed.", "error");
//         navigateToUrl(response?.sessionInfo?.failureUrl);
//       }
//     }
//   };

//   // Back Front Success
//   const onFrontSuccess = (e: any) => {
//     if (e?.op_status === 0) {
//       setIsScanning(false);
//       setIsUserVerify(true);
//       setTimeout(() => {
//         setIsBackScan(true);
//         setIsUserVerify(false);
//         setIsScanning(true);
//       }, 2000);
//     }
//   };

//   const checkAgeFlow = async (e: number, flow?: any): Promise<any> => {
//     let payload;
//     if (flow === 0) {
//       payload = {
//         flow,
//         inputs: {
//           age: parseInt(overideAge || "") || e,
//         },
//       };
//     } else if (flow === 1) {
//       payload = {
//         flow,
//         inputs: {
//           calculatedAge: parseInt(overideAge || "") || e,
//         },
//       };
//     } else {
//       payload = {
//         flow,
//         inputs: {
//           firstName: enrollData?.firstName,
//           lastName: enrollData?.lastName,
//           dobMonth: dayjs(enrollData?.dob).format("MM"),
//           dobYear: dayjs(enrollData?.dob).format("YYYY"),
//           ssn: enrollData?.ssn,
//           zip: enrollData?.zip,
//         },
//       };
//     }
//     const result: any = await verifyAge({ id: token, payload });
//     if (result?.data?.error) {
//       showToast(result?.data?.message, "error");
//       navigate("/");
//     } else {
//       return result;
//     }
//   };

//   const navigateToUrl = (
//     url: string,
//     timeoutMilliseconds = 1000,
//     token = ""
//   ) => {
//     setTimeout(() => {
//       window.open(`${url}?token=${token || sessionData?.token}`, "_self");
//     }, timeoutMilliseconds);
//   };

//   const useDeleteCallback = (deleteStatus: any) => {
//     navigateToUrl(sessionData?.successUrl);
//   };
//   const handleDelete = async () => {
//     if (sessionData?.token) {
//       const payload: { [x: string]: string | undefined | null } = {
//         token,
//       };
//       if (user?.uuid) {
//         onDeleteUser(user?.uuid);
//         payload.guid = user?.guid;
//         payload.uuid = user?.uuid;
//       }
//       deleteUserApi(payload as any);
//       localStorage.removeItem("user");
//       localStorage.removeItem("uuid");
//       showToast("Redirecting...", "success");
//       if (!user?.uuid) {
//         navigateToUrl(sessionData?.successUrl);
//       }
//     } else {
//       setStep(12);
//       setPrevStep(5);
//     }
//   };

//   const { onDeleteUser } = useDelete(useDeleteCallback);

//   const onCameraNotGranted = (e: boolean) => {
//     if (!e) {
//       setStep(15);
//     }
//   };

//   const onCloseModal = () => {
//     return [5, 6].includes(step)
//       ? navigateToUrl(sessionData?.successUrl)
//       : navigate("/");
//   };

//   const _renderChildren = () => {
//     switch (step as number) {
//       case 1:
//         return (
//           <VerifyIdentity
//             theme={theme}
//             skin={skin}
//             palette={palette}
//             setStep={setStep}
//             setPrevStep={setPrevStep}
//             name={name}
//           />
//         );
//       case 3:
//         return (
//           <VerifyAgeWithScan
//             theme={theme}
//             skin={skin}
//             palette={palette}
//             setStep={setStep}
//           />
//         );
//       case 4:
//         return (
//           <FaceAgeScan
//             setStep={setStep}
//             isUserVerify={isUserVerify}
//             stopCamera={stopCamera}
//             onAgeChange={onAgeChange}
//             onCameraNotGranted={onCameraNotGranted}
//             enrollStatus={enrollStatus}
//             enrollOneFaProgress={enrollOneFaProgress}
//             enrolling={enrolling}
//           />
//         );
//       case 5:
//         return (
//           <FaceUnlockForFree
//             theme={theme}
//             skin={skin}
//             palette={palette}
//             setStep={setStep}
//             handleDelete={handleDelete}
//           />
//         );
//       case 6:
//         return (
//           <CreateAccountConsent
//             theme={theme}
//             skin={skin}
//             palette={palette}
//             isUserVerify={isUserVerify}
//             handleDelete={handleDelete}
//             setIsUserVerify={setIsUserVerify}
//             sessionData={sessionData}
//             user={user}
//             navigateToUrl={navigateToUrl}
//           />
//         );
//       case 7:
//         return (
//           <VerifyDriversLicense
//             theme={theme}
//             skin={skin}
//             palette={palette}
//             setStep={setStep}
//             name={name}
//           />
//         );
//       case 8:
//         return (
//           <DocumentScan
//             skin={skin}
//             palette={palette}
//             isBackScan={isBackScan}
//             isUserVerify={isUserVerify}
//             onBackSuccess={onBackSuccess}
//             onFrontSuccess={onFrontSuccess}
//             onCameraNotGranted={onCameraNotGranted}
//             isScanning={isScanning}
//           />
//         );
//       case 9:
//         return (
//           <VerifyAgeWithDatabase
//             theme={theme}
//             skin={skin}
//             palette={palette}
//             setStep={setStep}
//             setPrevStep={setPrevStep}
//             name={name}
//           />
//         );
//       case 10:
//         return (
//           <DatabaseConsent
//             theme={theme}
//             skin={skin}
//             palette={palette}
//             setStep={setStep}
//             setPrevStep={setPrevStep}
//           />
//         );
//       case 11:
//         return (
//           <DatabaseInputs
//             theme={theme}
//             skin={skin}
//             palette={palette}
//             isUserVerify={isUserVerify}
//             onChange={onChange}
//             setEnrollData={setEnrollData}
//             enrollData={enrollData}
//             onContinue={onContinue}
//             loading={loading}
//           />
//         );
//       case 12:
//         return (
//           <CannotVerify
//             theme={theme}
//             skin={skin}
//             palette={palette}
//             sessionData={sessionData}
//             navigateToUrl={navigateToUrl}
//             setStep={setStep}
//             prevStep={prevStep}
//           />
//         );
//       case 13:
//         return (
//           <AgeCheckDatabase
//             theme={theme}
//             setPrevStep={setPrevStep}
//             setStep={setStep}
//           />
//         );
//       case 14:
//         return (
//           <>
//             <FullWidthTabs />
//           </>
//         );
//       case 15:
//         return (
//           <>
//             <Grid container alignItems="center" justifyContent={"center"}>
//               <Typography
//                 component="p"
//                 textAlign="center"
//                 fontSize={16}
//                 fontWeight={900}
//                 letterSpacing={"1px"}
//                 sx={{ paddingTop: 3, paddingBottom: 2 }}
//                 className={classes.cardHeading}
//               >
//                 <img
//                   src={smallLock}
//                   alt="smallLock"
//                   className={classes.smallLock}
//                 />
//                 ANONYMOUS AGE VERIFICATION
//               </Typography>
//             </Grid>
//             <Grid style={styles.cardGrid} className={classes.cardGridMobile}>
//               {/* @ts-ignore  */}
//               <Box className={classes.allowCameraBox}>
//                 <CameraAltIcon />
//               </Box>
//               <Typography
//                 id="modal-modal-description"
//                 sx={{ mt: 2 }}
//                 color={palette?.[skin]?.listText}
//                 textAlign="center"
//                 fontWeight={700}
//                 fontSize={22}
//               >
//                 Camera permission needed
//               </Typography>
//               <Typography
//                 component="p"
//                 textAlign={"center"}
//                 fontSize={16}
//                 fontWeight={500}
//                 color={"#333"}
//                 mt={2}
//               >
//                 To update permissions, see the instructions{" "}
//                 <span
//                   onClick={() =>
//                     window.open(
//                       "https://support.google.com/chrome/answer/2693767?co=GENIE.Platform%3DDesktop"
//                     )
//                   }
//                   style={{
//                     color: palette[skin]?.main,
//                     fontWeight: 700,
//                     cursor: "pointer",
//                   }}
//                 >
//                   here
//                 </span>
//                 .
//               </Typography>
//             </Grid>
//             {/* @ts-ignore  */}
//             <Box className={classes.otherOptionsBottom}>
//               <Typography
//                 component="p"
//                 textAlign={matchesSM ? "center" : "left"}
//                 fontSize={15}
//                 fontWeight={500}
//                 mt={2}
//                 onClick={() => {
//                   setStep(14);
//                 }}
//               >
//                 <PhoneIphoneIcon /> Switch to other device
//               </Typography>
//             </Box>
//             <Button
//               variant="contained"
//               color={theme as "inherit"}
//               style={styles.continueButton}
//               onClick={() => setStep(11)}
//             >
//               <Typography
//                 component="p"
//                 color={`#000`}
//                 textAlign="center"
//                 fontWeight={600}
//                 display="flex"
//                 alignItems="center"
//                 justifyContent={"center"}
//                 textTransform="capitalize"
//               >
//                 Continue without camera
//               </Typography>
//             </Button>
//           </>
//         );
//       default:
//         break;
//     }
//   };
//   const themeName = skin || "primary";

//   return (
//     <>
//       {headerVisible?.includes(skin) && <Header theme={themeName} />}
//       <div className="homePageWrapper">
//         {[5, 6].includes(step) ? (
//           <div className="green-border">
//             <p>FACE UNLOCK</p>
//           </div>
//         ) : null}
//         <div className="homeSidebarImg">
//           <img src={womenImg} alt="women" />
//         </div>

//         <HomeModal handleClose={onCloseModal} open={true}>
//           {_renderChildren()}
//         </HomeModal>
//       </div>
//     </>
//   );
// };

// export default Signup;


export default <></>