import React, { createContext, useState } from "react";
import STEP_LIST from "../components/Steps/StepsList";


export const UserContext = createContext();

const UserContextProvider = ({children}) => {
    const [currentStep, setCurrentStep] = useState(STEP_LIST.START);
    const [isWasmLoaded, setIsWasmLoaded] = useState(false);
    const [faceConsent, setFaceConsent] = useState(false);
    const [embeddings, setEmbeddings] = useState('');
    
    return(
        <UserContext.Provider value={{
            isWasmLoaded,
            setIsWasmLoaded,
            faceConsent,
            setFaceConsent,
            currentStep, 
            setCurrentStep,
            embeddings, 
            setEmbeddings
        }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;