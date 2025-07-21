import { useState, useEffect } from "react";

// @mui material components
import { Snackbar, Alert, IconButton, Fade } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const NotificationNavbar = ({ 
  title, 
  message, 
  description,
  onClose, 
  showSuccessMessage,
  dismissible = false
}) => {
  // Si on a des props de notification, afficher une Snackbar
  if (title && (message || description)) {
    return (
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={6000}
        onClose={onClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Fade}
        sx={{
          zIndex: 9999,
          '& .MuiSnackbar-root': {
            backgroundColor: 'transparent',
            zIndex: 9999,
          },
          '& .MuiPaper-root': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            zIndex: 9999,
          }
        }}
      >
        <MDBox
          sx={{
            backgroundColor: '#4472c4',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(68, 114, 196, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            padding: '16px 20px',
            minWidth: '320px',
            maxWidth: '400px',
            position: 'relative',
            overflow: 'hidden',
            zIndex: 9999,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #5a8fd8, #4472c4, #3a5f9e)',
            },
            animation: 'slideInRight 0.3s ease-out',
            '@keyframes slideInRight': {
              '0%': {
                transform: 'translateX(100%)',
                opacity: 0,
              },
              '100%': {
                transform: 'translateX(0)',
                opacity: 1,
              },
            },
          }}
        >
          <MDBox display="flex" alignItems="flex-start" gap={2}>
            {/* Icône de succès */}
            <CheckCircleIcon 
              sx={{ 
                color: 'white', 
                fontSize: '24px',
                marginTop: '2px',
                flexShrink: 0,
              }} 
            />
            
            {/* Contenu */}
            <MDBox flex={1}>
              <MDTypography 
                variant="h6" 
                color="white" 
                fontWeight="bold"
                sx={{ 
                  fontSize: '16px',
                  lineHeight: 1.2,
                  marginBottom: '4px',
                }}
              >
                {title}
              </MDTypography>
              <MDTypography 
                variant="body2" 
                color="white" 
                opacity={0.9}
                sx={{ 
                  fontSize: '14px',
                  lineHeight: 1.4,
                }}
              >
                {message || description}
              </MDTypography>
            </MDBox>
            
            {/* Bouton fermer */}
            {dismissible && (
              <IconButton
                onClick={onClose}
                size="small"
                sx={{
                  color: 'white',
                  opacity: 0.7,
                  transition: 'opacity 0.2s ease',
                  '&:hover': {
                    opacity: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  flexShrink: 0,
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </MDBox>
        </MDBox>
      </Snackbar>
    );
  }

  // Fallback pour l'ancien usage (navbar)
  return (
    <MDBox
      py={1}
      px={2}
      my={2}
      mx={2}
      width="calc(100% - 2rem)"
      borderRadius="lg"
      backgroundColor="#4472c4"
      boxShadow="0 0.25rem 0.375rem -0.0625rem rgba(0, 0, 0, 0.12)"
      color="white"
      position="relative"
      zIndex={99}
      sx={{
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 0.5rem 1rem -0.125rem rgba(0, 0, 0, 0.15)',
          transform: 'translateY(-1px)',
        }
      }}
    >
      <MDBox display="flex" alignItems="center" justifyContent="space-between">
        <MDTypography variant="button" fontWeight="regular" color="white" opacity={0.9}>
          Notifications
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

// Declaring default props for NotificationNavbar
NotificationNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
  title: null,
  message: null,
  description: null,
  onClose: null,
  showSuccessMessage: false,
  dismissible: false,
};

export default NotificationNavbar; 