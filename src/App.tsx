import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { RouterProvider } from "react-router-dom";
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
