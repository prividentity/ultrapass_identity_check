import { localThemes } from "./theme";

import { createBrowserRouter } from "react-router-dom";
import Signup from "./pages/signup";
import Home from "./pages/home";
import Signin from "./pages/signin";

const skin = localThemes?.includes(window?.location?.search?.split("skin=")[1])
  ? window?.location?.search?.split("skin=")[1]
  : "primary";
const themeName = skin || "primary";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home theme={themeName} skin={skin} />,
  },
  {
    path: "/signup",
    element: <Signup theme={themeName} skin={skin} />,
  },
  {
    path: "/signin",
    element: <Signin theme={themeName} skin={skin} />,
  },
]);

export default router;
