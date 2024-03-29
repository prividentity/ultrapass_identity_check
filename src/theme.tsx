import {
  createTheme,
  PaletteOptions,
  TypeBackground,
  TypeText,
} from "@mui/material";
import logo from "./assets/logo.png";
import logoDarkMg from "./assets/mg/logo-dark.png";
import googleLogo from "./assets/google-logo.png";
import fanduelLogo from "./assets/fanduel-logo.svg";
import google from "./assets/account.png";
import StnLogo from "./assets/stn-logo.png";
import logoDarkUp from "./assets/up/logo-dark.png";
import StnLogoBlack from "./assets/stn-logo-black.png";
import logoLightMg from "./assets/mg/logo-light.png";
import darkBG from "./assets/dark-bg.jpg";
import logoLightC1 from "./assets/c1/logo-light.png";

export const DEFAULT_THEME = 'stncharms'
export const localThemes = ["mg", "up", "c1", "stncharms", "primary"];
const skin = localThemes?.includes(window?.location?.search?.split("skin=")[1])
  ? window?.location?.search?.split("skin=")[1]
  : DEFAULT_THEME;
interface ColorThemePalette extends PaletteOptions {
  betmgm: {
    main: string;
    primaryColor: string;
    primaryColorHover: string;
    primaryColorActive: string;
    secondaryColor: string;
    background: Partial<TypeBackground>;
    bg: string;
    text: Partial<TypeText>;
  };
  cams: {
    main: string;
    primaryColor: string;
    primaryColorHover: string;
    primaryColorActive: string;
    secondaryColor: string;
    background: Partial<TypeBackground>;
    bg: string;
    text: Partial<TypeText>;
  };
}
export const theme = createTheme({
  palette: {
    // primary: {
    //   main: "rgb(255, 153, 0)",
    //   primaryColor: "rgb(255, 153, 0)",
    //   primaryColorHover: "#cebe95",
    //   primaryColorActive: "#8e7e55",
    //   secondaryColor: "#000",
    //   background: "#7f7f82",
    //   bg: "#7f7f82",
    //   text: "#fff",
    //   mainBackground: "#000",
    //   listText: "#000",
    // },
    primary: {
      main: "#3ebe5f",
      primaryColor: "#3ebe5f",
      error: "#ff0000",
      primaryColorHover: "#cebe95",
      primaryColorActive: "#8e7e55",
      secondaryColor: "#000",
      background: "#7f7f82",
      bg: "#7f7f82",
      text: "#fff",
      contrastText: "#000",
      mainBackground: "#000",
      listText: "#000",
      feedBack: "#044C7C",
    },
    stncharms: {
      main: "#8fc640",
      primaryColor: "#8fc640",
      error: "#ff0000",
      primaryColorHover: "#cebe95",
      primaryColorActive: "#8e7e55",
      secondaryColor: "#000",
      background: "#7f7f82",
      bg: "#7f7f82",
      text: "#fff",
      contrastText: "#000",
      mainBackground: "#000",
      listText: "#000",
      feedBack: "#044C7C",
    },
    up: {
      main: "rgb(255, 153, 0)",
      primaryColor: "rgb(255, 153, 0)",
      primaryColorHover: "#cebe95",
      primaryColorActive: "#8e7e55",
      secondaryColor: "#000",
      background: "#7f7f82",
      bg: "#7f7f82",
      text: "#fff",
      mainBackground: "#000",
      listText: "#000",
    },
    mg: {
      main: "rgb(255, 153, 0)",
      primaryColor: "rgb(255, 153, 0)",
      primaryColorHover: "#cebe95",
      primaryColorActive: "#8e7e55",
      secondaryColor: "#000",
      background: "#7f7f82",
      bg: "#7f7f82",
      text: "#fff",
      mainBackground: "#000",
      listText: "#000",
    },
    c1: {
      main: "#044C7C",
      primaryColor: "#044C7C",
      primaryColorHover: "#cebe95",
      primaryColorActive: "#8e7e55",
      secondaryColor: "#F42C24",
      background: "#7f7f82",
      bg: "#7f7f82",
      text: "#000",
      mainBackground: "#000",
      listText: "#000",
    },
    betmgm: {
      main: "#bda871",
      primaryColor: "#bda871",
      primaryColorHover: "#cebe95",
      primaryColorActive: "#8e7e55",
      secondaryColor: "#7f7f82",
      background: "#7f7f82",
      bg: "#7f7f82",
      text: "white",
      mainBackground: "#000",
      listText: "#000",
    },
    cams: {
      main: "#ff751a",
      primaryColor: "#ff751a",
      primaryColorHover: "#f88436",
      primaryColorActive: "#f86808",
      secondaryColor: "#7f7f82",
      background: "#7f7f82",
      bg: "#7f7f82",
      text: "white",
      mainBackground: "#000",
      listText: "#000",
    },
    google: {
      main: "rgb(102, 146, 239)",
      text: "#333",
      background: "#fff",
      mainBackground: "transparent",
      listText: "#000",
    },
    fanduel: {
      main: "#1493ff",
      primaryColor: "#1493ff",
      primaryColorHover: "#37a0fb",
      primaryColorActive: "#0088ff",
      secondaryColor: "#1f375b",
      background: "#1493ff",
      bg: "#7f7f82",
      text: "white",
      mainBackground: "#000",
      listText: "#000",
    },
    stations: {
      main: "#ff0000",
      primaryColor: "#ff0000",
      primaryColorHover: "#ee4242",
      primaryColorActive: "#b50000",
      secondaryColor: "#b50000",
      background: "#000",
      bg: "#7f7f82",
      text: "white",
      mainBackground: "transparent",
      listText: "#000",
    },
  } as ColorThemePalette,
  typography: {
    fontFamily:
      skin === "stncharms"
        ? ["'Open Sans', sans-serif"].join(", ")
        : ["'Lato'", "sans-serif"].join(", "),
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 767,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export const logos = {
  mainLogo: logo,
  primary: {
    dark: logoDarkUp,
    light: logoDarkUp,
  },
  google: googleLogo,
  fanduel: fanduelLogo,
  up: {
    dark: logoDarkUp,
    light: logoDarkUp,
  },
  mg: {
    dark: logoDarkMg,
    light: logoLightMg,
  },
  c1: {
    dark: logoLightC1,
    light: logoLightC1,
  },
  stncharms: {
    dark: StnLogo,
    light: StnLogoBlack,
  },
};

export const logoSize = {
  google: {
    height: 22,
    width: 120,
  },
  fanduel: {
    height: 40,
    width: 50,
  },
};

// name map type is Record<string, string>
export const nameMap: Record<string, string> = {
  mg: "Pornhub",
  up: "Ultrapass",
  c1: "Capital One",
};

export const headerVisible = ["primary", "mg", "up", "c1", "stncharms"];

export const backgroundImages = {
  google: google,
  c1: "https://ecm.capitalone.com/WCM/homepage/testing/photos/hero/bank/rbt-360savings-jeremy-desktop-jan2023/rtablet.jpg",
  primary: darkBG
};
