import React from "react";

import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SWRConfig } from "swr";

import App from "./App";
import AuthProvider from "./contexts/AuthProvider";
import swrConfig from "./lib/swrConfig";
import reportWebVitals from "./reportWebVitals";

import "@fontsource/inter/variable.css";
import "@fontsource/quicksand";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
      <SWRConfig value={swrConfig}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SWRConfig>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
