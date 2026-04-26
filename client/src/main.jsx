import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./i18n.js"; // add this
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);