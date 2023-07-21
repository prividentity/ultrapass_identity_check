import React, { createContext, useState } from "react";

const defaultUserStatus = {
  requestSSN9: false,
  requestScanID: false,
  requestResAddress: false,
};

export const UserContext = createContext({
  id: "",
  setId: (id: string) => {},
  ssn4: "",
  setSSN4: (ssn4: string) => {},
  ssn9: "",
  setSSN9: (ssn9: string) => {},
  phoneNumber: "",
  setPhoneNumber: (phone: string) => {},
  barcodeData: "",
  setBarcodeData: (barcode: string) => {},
  uuid: "",
  setUUID: (uuid: string) => {},
  guid: "",
  setGUID: (guid: string) => {},
  currentStatus: "",
  setCurrentStatus: (status: any) => {},
  successURL: "",
  setSuccessURL: (successURL: string) => {},
  failURL: "",
  setFailURL: (failURL: string) => {},
  userStatus: defaultUserStatus,
  setUserStatus: (userStatus: any) => {},
  verifyAttempts: 1,
  setVerifyAttempts: (userStatus: number) => {},
  verificationSession: {
    successUrl: "",
    failureUrl: "",
    organization: process.env.REACT_APP_API_KEY
  },
  setVerificationSession: (verificationSession: any) => {},
  enrollImageData: null,
  setEnrollImageData: (enrollImageData: any) => {},
  portraitConfScore: 0,
  setPortraitConfScore: (portraitConfScore: any) => {},
  isWasmLoaded: false,
  setIsWasmLoaded: (isWasmLoaded: boolean) => {},
  tokenParams: "",
  setTokenParams: (tokenParams: string) => {},
  dlAction: "",
  setDlAction: (dlAction: string) => {},
});

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [id, setId] = useState("");
  const [ssn4, setSSN4] = useState("");
  const [ssn9, setSSN9] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [barcodeData, setBarcodeData] = useState("");
  const [uuid, setUUID] = useState("");
  const [guid, setGUID] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [successURL, setSuccessURL] = useState("");
  const [failURL, setFailURL] = useState("");
  const [userStatus, setUserStatus] = useState(defaultUserStatus);
  const [verifyAttempts, setVerifyAttempts] = useState(1);
  const [verificationSession, setVerificationSession] = useState<any>({});
  const [enrollImageData, setEnrollImageData] = useState<any>(null);
  const [portraitConfScore, setPortraitConfScore] = useState<any>(null);
  const [isWasmLoaded, setIsWasmLoaded] = useState(false);
  const [tokenParams, setTokenParams] = useState("");
  const [dlAction, setDlAction] = useState("");
  return (
    <UserContext.Provider
      value={{
        id,
        setId,
        ssn4,
        setSSN4,
        ssn9,
        setSSN9,
        phoneNumber,
        setPhoneNumber,
        barcodeData,
        setBarcodeData,
        uuid,
        setUUID,
        guid,
        setGUID,
        currentStatus,
        setCurrentStatus,
        successURL,
        setSuccessURL,
        failURL,
        setFailURL,
        setUserStatus,
        userStatus,
        verifyAttempts,
        setVerifyAttempts,
        verificationSession,
        setVerificationSession,
        enrollImageData,
        setEnrollImageData,
        portraitConfScore,
        setPortraitConfScore,
        isWasmLoaded,
        setIsWasmLoaded,
        tokenParams,
        setTokenParams,
        dlAction,
        setDlAction,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
