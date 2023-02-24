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
  verifyAttempts: 0,
  setVerifyAttempts: (userStatus: number) => {},
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
  const [verifyAttempts, setVerifyAttempts] = useState(0);
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
