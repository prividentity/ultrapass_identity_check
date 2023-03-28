import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { RouterProvider } from "react-router-dom";
import { Helmet } from "react-helmet";
import { theme, backgroundImages } from "./theme";
import "./App.css";
import router from "./routes";
import UserContextProvider from "./context/UserContext";
import { useSkinContext } from "./context/SkinContext";
import { useMediaQuery, useTheme } from "@mui/material";
import womenImg from "./assets/Kimiko-S3.png";

function App() {
  const { skin } = useSkinContext();
  const backgroundImage: { [key: string]: any } = backgroundImages;
  const muiTheme = useTheme();
  const matchesSM = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const isRegister = window?.location?.pathname === '/register'

  return (
    <UserContextProvider>
      <SnackbarProvider maxSnack={3}>
        <ThemeProvider theme={theme}>
          <Helmet>
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link
              href="https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap"
              rel="stylesheet"
            />
          </Helmet>
          {backgroundImage?.[skin] && (
            <img
              src={backgroundImage?.[skin]}
              alt=""
              width={"100%"}
              height={"100%"}
              className="googleBackground"
            />
          )}
          <RouterProvider router={router} />
          {!matchesSM && skin !== "c1" && !isRegister && (
            <div className="homeSidebarImg">
              <img src={womenImg} alt="women" />
            </div>
          )}
        </ThemeProvider>
      </SnackbarProvider>
    </UserContextProvider>
  );
}

export default App;
