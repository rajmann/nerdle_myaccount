import React from "react";

import ReactDOM from "react-dom/client";
import { SWRConfig } from "swr";

import App from "./App";
import "./index.css";
import swrConfig from "./lib/swrConfig";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SWRConfig value={swrConfig}>
      <App />
    </SWRConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();