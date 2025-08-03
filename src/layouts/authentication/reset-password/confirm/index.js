import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// AWS Amplify
import { confirmResetPassword, resetPassword } from "aws-amplify/auth";

// Icons
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Images
import bgImage from "assets/images/bg-smart-home-2.jpg";

const ConfirmResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        code: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        } else {
            // Si pas d'email dans l'état, rediriger vers la page de reset
            navigate("/authentication/reset-password");
        }
    }, [location.state, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.code.trim()) {
            setMessage({ type: "error", text: "Please enter the verification code" });
            return;
        }

        if (!formData.newPassword.trim()) {
            setMessage({ type: "error", text: "Please enter a new password" });
            return;
        }

        if (formData.newPassword.length < 8) {
            setMessage({ type: "error", text: "Password must be at least 8 characters long" });
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match" });
            return;
        }

        // Validation de la complexité du mot de passe
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
        if (!passwordRegex.test(formData.newPassword)) {
            setMessage({
                type: "error",
                text: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            });
            return;
        }

        setIsLoading(true);
        setMessage({ type: "", text: "" });

        try {
            await confirmResetPassword({ username: email, confirmationCode: formData.code, newPassword: formData.newPassword });

            setMessage({
                type: "success",
                text: "Password reset successful! Redirecting to sign in..."
            });

            // Rediriger vers la page de connexion après 2 secondes
            setTimeout(() => {
                navigate("/authentication/sign-in/illustration");
            }, 2000);

        } catch (error) {
            // Gérer l'erreur silencieusement ou afficher une notification

            let errorMessage = "An error occurred. Please try again.";

            if (error.code === "CodeMismatchException") {
                errorMessage = "Invalid verification code. Please check your email and try again.";
            } else if (error.code === "ExpiredCodeException") {
                errorMessage = "Verification code has expired. Please request a new one.";
            } else if (error.code === "InvalidPasswordException") {
                errorMessage = "Password does not meet requirements.";
            } else if (error.code === "LimitExceededException") {
                errorMessage = "Too many attempts. Please try again later.";
            }

            setMessage({ type: "error", text: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (message.type === "error") {
            setMessage({ type: "", text: "" });
        }
    };

    const handleResendCode = async () => {
        if (!email) return;

        setIsLoading(true);
        setMessage({ type: "", text: "" });

        try {
            await resetPassword({ username: email });
            setMessage({
                type: "success",
                text: "New verification code sent to your email!"
            });
        } catch (error) {
            setMessage({
                type: "error",
                text: "Failed to send new code. Please try again."
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <CoverLayout coverHeight="50vh" image={bgImage}>
            <MDBox
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >

                <Card sx={{
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    width: '100%',

                }}>

                    <MDBox
                        variant="gradient"
                        bgColor="customBlue"
                        borderRadius="lg"
                        mx={2}
                        mt={2}
                        py={3}
                        mb={2}
                        textAlign="center"
                    >
                        <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
                            Reset Password
                        </MDTypography>
                        <MDTypography display="block" variant="button" color="white" my={1}>
                            Enter the verification code and your new password
                        </MDTypography>
                    </MDBox>

                    <MDBox pt={4} pb={4} px={4}>
                        {/* Message d'alerte */}
                        {message.text && (
                            <MDBox mb={4}>
                                <Alert
                                    severity={message.type === "error" ? "error" : "success"}
                                    sx={{
                                        fontSize: '0.875rem',
                                        borderRadius: 2,
                                        '& .MuiAlert-icon': {
                                            fontSize: '1.25rem'
                                        }
                                    }}
                                >
                                    {message.text}
                                </Alert>
                            </MDBox>
                        )}

                        <MDBox component="form" role="form" onSubmit={handleSubmit}>
                            {/* Code de vérification */}
                            <MDBox mb={4}>
                                <MDInput
                                    type="text"
                                    label="Verification Code"
                                    variant="standard"
                                    fullWidth
                                    value={formData.code}
                                    onChange={(e) => handleInputChange('code', e.target.value)}
                                    disabled={false}
                                    placeholder="Enter the 6-digit code"
                                    inputProps={{ maxLength: 6 }}
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'rgba(0,0,0,0.02)'
                                        },
                                        '& .MuiInputBase-root.Mui-disabled': {
                                            backgroundColor: 'rgba(0,0,0,0.02)',
                                            '& .MuiInputBase-input': {
                                                color: 'text.primary'
                                            }
                                        }
                                    }}
                                />
                            </MDBox>

                            {/* Nouveau mot de passe */}
                            <MDBox mb={4}>
                                <MDInput
                                    type={showPassword ? "text" : "password"}
                                    label="New Password"
                                    variant="standard"
                                    fullWidth
                                    value={formData.newPassword}
                                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                    disabled={false}
                                    placeholder="Enter your new password"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    disabled={false}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'rgba(0,0,0,0.02)'
                                        },
                                        '& .MuiInputBase-root.Mui-disabled': {
                                            backgroundColor: 'rgba(0,0,0,0.02)',
                                            '& .MuiInputBase-input': {
                                                color: 'text.primary'
                                            }
                                        }
                                    }}
                                />
                            </MDBox>

                            {/* Confirmation du mot de passe */}
                            <MDBox mb={4}>
                                <MDInput
                                    type={showConfirmPassword ? "text" : "password"}
                                    label="Confirm New Password"
                                    variant="standard"
                                    fullWidth
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    disabled={false}
                                    placeholder="Confirm your new password"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowConfirmPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    disabled={false}
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'rgba(0,0,0,0.02)'
                                        },
                                        '& .MuiInputBase-root.Mui-disabled': {
                                            backgroundColor: 'rgba(0,0,0,0.02)',
                                            '& .MuiInputBase-input': {
                                                color: 'text.primary'
                                            }
                                        }
                                    }}
                                />
                            </MDBox>

                            {/* Instructions de complexité */}


                            <MDBox mt={6} mb={2}>
                                <MDButton
                                    variant="gradient"
                                    color="customBlue"
                                    fullWidth
                                    type="submit"
                                    disabled={isLoading}
                                    sx={{
                                        borderRadius: 2,
                                        py: 1.5,
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        textTransform: 'none'
                                    }}
                                >
                                    {isLoading ? (
                                        <MDBox display="flex" alignItems="center" gap={1}>
                                            <CircularProgress size={20} color="inherit" />
                                            Resetting...
                                        </MDBox>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </MDButton>
                            </MDBox>

                            <MDBox mt={3} textAlign="center">
                                <MDTypography
                                    variant="button"
                                    color="text"
                                    sx={{
                                        cursor: "pointer",
                                        '&:hover': {
                                            color: 'primary.main'
                                        }
                                    }}
                                    onClick={handleResendCode}
                                    disabled={isLoading}
                                >
                                    Didn&apos;t receive the code? Resend
                                </MDTypography>
                            </MDBox>

                            <MDBox mt={2} textAlign="center">
                                <MDTypography
                                    variant="button"
                                    color="text"
                                    sx={{
                                        cursor: "pointer",
                                        '&:hover': {
                                            color: 'primary.main'
                                        }
                                    }}
                                    onClick={() => navigate("/authentication/sign-in")}
                                >
                                    ← Back to Sign In
                                </MDTypography>
                            </MDBox>
                        </MDBox>
                    </MDBox>
                </Card>
        </MDBox>
    </CoverLayout >
  );
}

export default ConfirmResetPassword; 