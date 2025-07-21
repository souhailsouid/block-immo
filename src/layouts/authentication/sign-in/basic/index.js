import { useState } from "react";

// @mui material components
import { Card, Icon, TextField } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-in-cover.jpeg";

const Cover = () => {
  const [rememberMe, setRememberMe] = useState(false);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email and password to sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                placeholder="john@example.com"
                InputLabelProps={{ shrink: true }}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                variant="standard"
                fullWidth
                placeholder="••••••••"
                InputLabelProps={{ shrink: true }}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <MDBox
                display="flex"
                alignItems="center"
                ml={-1}
                sx={{ cursor: "pointer" }}
                onClick={handleSetRememberMe}
              >
                <MDBox
                  component="input"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleSetRememberMe}
                  sx={{ display: "none" }}
                />
                <MDBox
                  width={1.25}
                  height={1.25}
                  border={2}
                  borderRadius="sm"
                  borderColor={rememberMe ? "info" : "secondary"}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color={rememberMe ? "info" : "secondary"}
                  mr={1.5}
                  sx={{ cursor: "pointer" }}
                >
                  <MDBox component="svg" width="0.875rem" height="0.875rem" viewBox="0 0 40 40">
                    <path
                      d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3166L16.6667 28.3333Z"
                      fill="currentColor"
                      strokeWidth="3.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </MDBox>
                </MDBox>
                <MDTypography variant="button" fontWeight="regular" color="text">
                  &nbsp;&nbsp;Remember me
                </MDTypography>
              </MDBox>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth>
                sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component="a"
                  href="#"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover; 