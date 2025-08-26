import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";
import "./index.scss";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
