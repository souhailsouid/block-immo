
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "App";
import { configureAmplify, validateAWSConfig } from "config/aws";
// Material Dashboard 3 PRO React Context Provider
import { MaterialUIControllerProvider } from "context";

const container = document.getElementById("app");

// Configuration et validation AWS
if (validateAWSConfig()) {
  configureAmplify();
} else {
  }

const root = createRoot(container);

root.render(
  <BrowserRouter>
      <MaterialUIControllerProvider>
        <App />
      </MaterialUIControllerProvider>
  </BrowserRouter>
);
