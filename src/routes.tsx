import { localThemes } from "./theme";

import { createBrowserRouter } from "react-router-dom";
// import Signup from "./pages/signup";
import Home from "./pages/home";
import Signin from "./pages/signin";
import Register from "./pages/register";

const skin = localThemes?.includes(window?.location?.search?.split("skin=")[1])
  ? window?.location?.search?.split("skin=")[1]
  : "c1";
const themeName = skin || "c1";

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
    element: <Register theme={themeName} skin={skin} />,
  },
]);

export default router;
