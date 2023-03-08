import React from "react";
import { localThemes } from "../theme";

const SkinContext = React.createContext({
  skin: "primary",
  setSkin: (skin: string) => {},
});

export default SkinContext;

export const SkinContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [skin, setSkin] = React.useState(
    localThemes?.includes(window?.location?.search?.split("skin=")[1])
      ? window?.location?.search?.split("skin=")[1]
      : "c1"
  );

  React.useEffect(() => {
    // we need to set the skin in the url
    const url = new URL(window.location.href);
    url.searchParams.set("skin", skin);
    window.history.pushState({}, "", url.toString());
  }, []);
  return (
    <SkinContext.Provider value={{ skin, setSkin }}>
      {children}
    </SkinContext.Provider>
  );
};

export function useSkinContext() {
  return React.useContext(SkinContext);
}
