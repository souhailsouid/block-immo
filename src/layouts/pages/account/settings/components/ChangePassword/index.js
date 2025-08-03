import { useState } from 'react';

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Amplify Auth
import { updatePassword } from '@aws-amplify/auth';

// Notification context
import { useNotification } from 'context/NotificationContext';

// Icons
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { showNotification } = useNotification();

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRequirements = [
    "At least 8 characters",
    "At least one uppercase letter",
    "At least one lowercase letter", 
    "At least one number",
    "At least one special character",
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Effacer les erreurs quand l'utilisateur tape
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Password visibility handlers
  const handleClickShowCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'The password must contain at least 8 characters';
    } else if (!/(?=.*[a-z])/.test(formData.newPassword)) {
      newErrors.newPassword = 'The password must contain at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(formData.newPassword)) {
      newErrors.newPassword = 'The password must contain at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = 'The password must contain at least one number';
    } else if (!/(?=.*[!@#$%^&*])/.test(formData.newPassword)) {
      newErrors.newPassword = 'The password must contain at least one special character';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmation of the password is required';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'The passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await updatePassword({
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      showNotification(
        'Success',
        'Password updated successfully!',
        'success',
        { duration: 3000, autoHide: true }
      );

      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
    } catch (error) {

      let errorMessage = 'Error updating password';
      
      if (error.message.includes('NotAuthorizedException')) {
        errorMessage = 'Current password is incorrect';
      } else if (error.message.includes('InvalidPasswordException')) {
        errorMessage = 'The new password does not meet the security requirements';
      } else if (error.message.includes('LimitExceededException')) {
        errorMessage = 'Too many attempts. Please try again later';
      }
      
      showNotification(
        'Error',
        errorMessage,
        'error',
        { duration: 5000, autoHide: true }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderPasswordRequirements = passwordRequirements.map((item, key) => {
    const itemKey = `element-${key}`;

    return (
      <MDBox key={itemKey} component="li" color="text" fontSize="1.25rem" lineHeight={1}>
        <MDTypography variant="button" color="text" fontWeight="regular" verticalAlign="middle">
          {item}
        </MDTypography>
      </MDBox>
    );
  });

  return (
    <Card id="change-password">
      <MDBox p={3}>
        <MDTypography variant="h5">Change password</MDTypography>
      </MDBox>
      <MDBox component="form" pb={3} px={3} onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MDInput
              fullWidth
              label="Mot de passe actuel"
              type={showCurrentPassword ? 'text' : 'password'}
              inputProps={{ autoComplete: "current-password" }}
              value={formData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showCurrentPassword ? 'hide the password' : 'display the password'}
                      onClick={handleClickShowCurrentPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="small"
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <MDInput
              fullWidth
              label="New password"
              type={showNewPassword ? 'text' : 'password'}
              inputProps={{ autoComplete: "new-password" }}
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showNewPassword ? 'hide the password' : 'display the password'}
                      onClick={handleClickShowNewPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="small"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <MDInput
              fullWidth
              label="Confirm the new password"
              type={showConfirmPassword ? 'text' : 'password'}
              inputProps={{ autoComplete: "new-password" }}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showConfirmPassword ? 'hide the password' : 'display the password'}
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <MDBox mt={6} mb={1}>
          <MDTypography variant="h5">Password requirements</MDTypography>
        </MDBox>
        <MDBox mb={1}>
          <MDTypography variant="body2" color="text">
            Please follow this guide for a secure password
          </MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="space-between" alignItems="flex-end" flexWrap="wrap">
          <MDBox component="ul" m={0} pl={3.25} mb={{ xs: 8, sm: 0 }}>
            {renderPasswordRequirements}
          </MDBox>
          <MDBox ml="auto">
            <MDButton 
              variant="gradient" 
              color="dark" 
              size="small"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Update...' : 'Update password'}
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default ChangePassword;
