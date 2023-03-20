import { useState, useEffect } from "react";

import { loadPrivIdModule } from "@privateid/cryptonets-web-sdk-alpha";
import { getUrlParameter } from "../utils";
let isLoaded: string | null;
const useWasm = () => {
  // Initialize the state
  const [ready, setReady] = useState(false);
  const [wasmStatus, setWasmStatus] = useState<any>({isChecking: true})

  const init = async () => {
    const apiKey = getUrlParameter("api_key", null);
    const apiUrl = getUrlParameter("api_url", null);
    const isSupported = await loadPrivIdModule(apiUrl, apiKey);
    console.log("WASM LOADED SUPPORTED?", isSupported);
    // setReady(false);
    // setWasmStatus({isChecking:false, support: false, message: "not supported."});
    if (isSupported.support) {
      setReady(true);
      setWasmStatus({isChecking:false, ...isSupported})
      isLoaded = "success";
    }
    else{
      setReady(false);
      setWasmStatus({isChecking:false, ...isSupported})
      isLoaded = null;
    }
  };

  useEffect(() => {
    if (isLoaded) return;
    init();
    isLoaded = "pending";
  }, []);

  return { ready, wasmStatus, isLoaded };
};

export default useWasm;
