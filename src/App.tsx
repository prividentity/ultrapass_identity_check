import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { RouterProvider } from "react-router-dom";
import { Helmet } from "react-helmet";
import { theme, backgroundImages } from "./theme";
import "./App.css";
import router from "./routes";
import UserContextProvider from "./context/UserContext";
import { useSkinContext } from "./context/SkinContext";
function App() {
  const { skin } = useSkinContext();
  const backgroundImage: { [key: string]: any } = backgroundImages;

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
        </ThemeProvider>
      </SnackbarProvider>
    </UserContextProvider>
  );
}

export default App;
