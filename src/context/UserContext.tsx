import React, {createContext, useState} from 'react';


export const UserContext = createContext({
    id: '',
    setId: (id:string) => {},
    ssn4: '',
    setSSN4: (ssn4:string) => {},
    ssn9: '',
    setSSN9: (ssn9:string) => {},
    phoneNumber: '',
    setPhoneNumber: (phone:string) => {},
    barcodeData: '',
    setBarcodeData: (barcode:string) => {},
    uuid: '',
    setUUID: (uuid:string) => {},
    guid: '',
    setGUID: (guid:string) => {},
    currentStatus: '',
    setCurrentStatus: (status:any) => {},
    successURL:'',
    setSuccessURL: (successURL:string) => {},
    failURL:'',
    setFailURL: (failURL:string) => {},

});

const UserContextProvider = ({children}: {children:React.ReactNode}) =>{
    const [id, setId] = useState('');
    const [ssn4, setSSN4] = useState('');
    const [ssn9, setSSN9] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [barcodeData, setBarcodeData] = useState('');
    const [uuid, setUUID] = useState('');
    const [guid, setGUID] = useState('');
    const [currentStatus, setCurrentStatus] = useState('');
    const [successURL, setSuccessURL] = useState('');
    const [failURL, setFailURL] = useState('');
    return(
        <UserContext.Provider value={{
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
        }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;