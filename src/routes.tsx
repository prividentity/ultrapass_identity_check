import { DEFAULT_THEME, localThemes } from "./theme";

import { Navigate, Route, createBrowserRouter } from "react-router-dom";
// import Signup from "./pages/signup";
import Home from "./pages/home";
import Signin from "./pages/signin";
import Register from "./pages/register";
import Redirect from "./components/RedirectComponent";

const skin = localThemes?.includes(window?.location?.search?.split("skin=")[1])
  ? window?.location?.search?.split("skin=")[1]
  : DEFAULT_THEME;
const themeName = skin || DEFAULT_THEME;

const router = createBrowserRouter(
  skin === "stncharms"
    ? [
        {
            path: "/",
            element: <Redirect Url="https://stncharms.com/" />,
            errorElement: <Redirect Url="https://stncharms.com/" />,
        },
        {
          path: "/cams_test",
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
          element: <Register theme={themeName} skin={skin} />,
        },
      ]
    : [
        {
          path: "/",
          element: <Home theme={themeName} skin={skin} />,
          errorElement: <Redirect Url="/" />,
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
          element: <Register theme={themeName} skin={skin} />,
        },
      ]
);

export default router;
