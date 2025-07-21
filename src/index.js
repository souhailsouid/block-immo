import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Amplify } from 'aws-amplify'
import App from "App";
import { amplifyConfig } from "config/aws";
// Material Dashboard 3 PRO React Context Provider
import { MaterialUIControllerProvider } from "context";

const container = document.getElementById("app");



const root = createRoot(container);
Amplify.configure(amplifyConfig)

root.render(
  <HashRouter>
      <MaterialUIControllerProvider>
        <App />
      </MaterialUIControllerProvider>
  </HashRouter>
);
