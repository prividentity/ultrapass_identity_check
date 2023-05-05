import { DEFAULT_THEME, localThemes } from "./theme";

import { createBrowserRouter } from "react-router-dom";
// import Signup from "./pages/signup";
import Home from "./pages/home";
import Signin from "./pages/signin";
import Register from "./pages/register";
import { SessionProvider } from "./context/SessionContext";

const skin = localThemes?.includes(window?.location?.search?.split("skin=")[1])
  ? window?.location?.search?.split("skin=")[1]
  : DEFAULT_THEME;
const themeName = skin || DEFAULT_THEME;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home theme={themeName} skin={skin} />,
  },
  {
    path: "/signup",
    element: <Register theme={themeName} skin={skin} />,
  },
  {
    path: "/signin",
    element: <Signin theme={themeName} skin={skin} />,
  },
  {
    path: "/register",
    element: (
      <SessionProvider>
        <Register theme={themeName} skin={skin} />
      </SessionProvider>
    ),
  },
]);

export default router;
