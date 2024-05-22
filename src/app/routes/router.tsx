import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../../App";
import DefaultLayout from "../layout/DefaulLayout";
import ModelVehicle from "../../pages/modelProduct";
import ColorPage from "../../pages/color";
import NotFound from "../errors/NotFound";
import RequireAuth from "./RequireAuth";
import ServerErrors from "../errors/ServerErrors";
import Dashboard from "../../pages/dashboard/Dashboard";
import SignIn from "../../pages/account/SignIn";
import TypePage from "../../pages/type";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        // element: <RequireAuth roles={["Admin"]} />,
        children: [
          {
            element: <DefaultLayout />,
            children: [
              { path: "", element: <Dashboard /> },
              { path: "dashboard", element: <Dashboard /> },
              { path: "model-products", element: <ModelVehicle /> },
              { path: "colors", element: <ColorPage /> },
              { path: "types", element: <TypePage /> },
            ],
          },
        ],
      },

      { path: "login", element: <SignIn /> },
      { path: "not-found", element: <NotFound /> },
      { path: "server-error", element: <ServerErrors /> },
      { path: "*", element: <Navigate replace to="/not-found" /> },
    ],
  },
]);
