import { useState } from "react";
import { useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// AWS Amplify
import { resetPassword } from "aws-amplify/auth";

// Images
import bgImage from "assets/images/bg-smart-home-2.jpg";

import { useNotification } from 'context/NotificationContext';
const Cover = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { showNotification } = useNotification();
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      showNotification("error", "Please enter your email address", "error")
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showNotification("error", "Please enter a valid email address", "error")
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await resetPassword({ username: email });
      showNotification("success", "Password reset email sent! Please check your inbox and follow the instructions.", "success")
      
      // Rediriger vers la page de confirmation après 3 secondes
      setTimeout(() => {
        navigate("/authentication/reset-password/confirm", { 
          state: { email } 
        });
      }, 3000);
      
    } catch (error) {
      // Gérer l'erreur silencieusement ou afficher une notification
      let errorMessage;

      
      if (error.code === "UserNotFoundException") {
        errorMessage = "No account found with this email address.";
      } else if (error.code === "LimitExceededException") {
        errorMessage = "Too many attempts. Please try again later.";
      } else if (error.code === "InvalidParameterException") {
        errorMessage = "Please enter a valid email address.";
      }
      
      showNotification("error", errorMessage || error.message, "error")
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (message.type === "error") {
      setMessage({ type: "", text: "" });
    }
  };

  return (
    <CoverLayout coverHeight="50vh" image={bgImage}>
    
      <Card>
        <MDBox
          variant="gradient"
          bgColor="customBlue"
          borderRadius="lg"
          mx={2}
          mt={2}
          py={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
            Reset Password
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email to receive a password reset link
          </MDTypography>
        </MDBox>
        
        <MDBox pt={4} pb={3} px={3}>
          {/* Message d'alerte */}
          {message.text && (
            <MDBox mb={3}>
              <Alert 
                severity={message.type === "error" ? "error" : "success"}
                sx={{ fontSize: '0.875rem' }}
              >
                {message.text}
              </Alert>
            </MDBox>
          )}
          
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={4}>
              <MDInput
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                value={email}
                onChange={handleEmailChange}
                disabled={isLoading}
                error={message.type === "error"}
                helperText={message.type === "error" ? message.text : ""}
              />
            </MDBox>
            
            <MDBox mt={6} mb={1}>
              <MDButton 
                variant="gradient" 
                color="customBlue" 
                fullWidth
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <MDBox display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={20} color="inherit" />
                    Sending...
                  </MDBox>
                ) : (
                  "Send Reset Link"
                )}
              </MDButton>
            </MDBox>
            
            <MDBox mt={3} textAlign="center">
              <MDTypography 
                variant="button" 
                color="text" 
                sx={{ cursor: "pointer" }}
                onClick={() => navigate("/authentication/sign-in")}
              >
                ← Back to Sign In
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
