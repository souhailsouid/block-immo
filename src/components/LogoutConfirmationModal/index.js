import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// @mui material components
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';

// @mui icons
import CloseIcon from '@mui/icons-material/Close';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// Hooks
import { useAuth } from 'hooks/useAuth';
import { useNotification } from 'context/NotificationContext';

const LogoutConfirmationModal = ({ open, onClose }) => {
  const { logout } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      // Utiliser window.location pour forcer la redirection
      window.location.href = '/authentication/sign-in/illustration';
    } catch (error) {
      // Gérer l'erreur silencieusement
      showNotification('error', 'Logout Error', 'An error occurred during logout.');
    }
  };

  const handleCancel = () => {
    onClose();
    // Rediriger vers le dashboard
    navigate('/dashboards/market-place');
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          backdropFilter: 'blur(10px)',
          overflow: 'hidden'
        },
      }}
    >
      <MDBox
        position="relative"
        width="100%"
        display="flex"
        flexDirection="column"
        borderRadius="xl"
        variant="gradient"
        bgColor="customBlue"
        shadow="sm"
      >
        <MDBox display="flex" alignItems="center" justifyContent="space-between" py={3} px={2}>
          <MDTypography variant="h6" color="white">
            Logout Confirmation
          </MDTypography>
          <IconButton
            onClick={handleCancel}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
              },
            }}
          >
            <CloseIcon fontSize="medium" />
          </IconButton>
        </MDBox>
        
        <Divider sx={{ my: 0, backgroundColor: 'white' }} />
        
        <MDBox p={6} textAlign="center" color="white">
          <Icon fontSize="large" color="inherit">
            logout
          </Icon>
          <MDTypography variant="h4" color="white" mt={3} mb={1}>
            Are you sure?
          </MDTypography>
          <MDTypography variant="body2" color="white" opacity={0.8} mb={2}>
            You will be logged out and need to sign in again to access your account.
          </MDTypography>
        </MDBox>
        
        <Divider light sx={{ my: 0 }} />
        
        <MDBox display="flex" justifyContent="space-between" py={2} px={3}>
          <MDButton
            variant="outlined"
            color="white"
            onClick={handleCancel}
            sx={{
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'white',
                color: 'white',
              },
            }}
          >
            Cancel
          </MDButton>
          <MDButton
            variant="gradient"
            color="white"
            onClick={handleLogout}
            sx={{
              color: 'customBlue.main',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'customBlue.main',
              },
            }}
          >
            Log Out
          </MDButton>
        </MDBox>
      </MDBox>
    </Dialog>
  );
};

LogoutConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LogoutConfirmationModal; 