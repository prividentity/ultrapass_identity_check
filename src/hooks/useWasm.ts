import { useState, useEffect } from "react";

import { loadPrivIdModule } from "@privateid/cryptonets-web-sdk-alpha";
import { getUrlParameter } from "../utils";

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
    }
    else{
      setReady(false);
      setWasmStatus({isChecking:false, ...isSupported})
    }
  };

  useEffect(() => {
    if (ready) return;
    init();
  }, []);

  return { ready, wasmStatus };
};

export default useWasm;
