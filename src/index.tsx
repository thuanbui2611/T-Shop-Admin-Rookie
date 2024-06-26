import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { StoreProvider } from "./app/context/StoreProvider";
import { createBrowserHistory } from "history";
import { store } from "./app/store/ConfigureStore";
import { Provider } from "react-redux";
import { router } from "./app/routes/router";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

export const history = createBrowserHistory();

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  </Provider>
  // </React.StrictMode>
);
