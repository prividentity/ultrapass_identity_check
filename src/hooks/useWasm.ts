import { useState, useEffect, useContext } from "react";

import { loadPrivIdModule } from "@privateid/cryptonets-web-sdk";
import { getUrlParameter } from "../utils";
import { UserContext } from "../context/UserContext";

let isLoading = false;
const useWasm = () => {
  // Initialize the state
  const [ready, setReady] = useState(false);
  const [wasmStatus, setWasmStatus] = useState<any>({ isChecking: true });
  const context = useContext(UserContext);
  const { isWasmLoaded, setIsWasmLoaded } = context;

  const init = async () => {
    const apiKey =
      context?.verificationSession?.organization ||
      getUrlParameter("api_key", null);
    const apiUrl = getUrlParameter("api_url", null);
    const isSupported = await loadPrivIdModule(
      apiUrl,
      apiKey,
      null,
      null,
      null,
      null,
      true
    );
    // console.log("WASM LOADED SUPPORTED?", isSupported);
    // setReady(false);
    // setWasmStatus({isChecking:false, support: false, message: "not supported."});
    if (isSupported.support) {
      setReady(true);
      setWasmStatus({ isChecking: false, ...isSupported });
      setIsWasmLoaded(true);
    } else {
      setReady(false);
      setWasmStatus({ isChecking: false, ...isSupported });
    }
  };

  useEffect(() => {
    if (ready) return;

    if (!isWasmLoaded && !isLoading) {
      init();
      isLoading = true;
    }
    if (isWasmLoaded) {
      setReady(true);
      setWasmStatus({ isChecking: false, support: true });
    }
  }, []);

  return { ready, wasmStatus };
};

export default useWasm;
