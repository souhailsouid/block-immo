import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// Material-UI components
import { Alert, AlertTitle, Collapse } from '@mui/material';
import { CheckCircle, Close } from '@mui/icons-material';

const SuccessNotification = ({ message, onClose, autoHide = true, duration = 5000 }) => {
  const location = useLocation();
  const stateMessage = location.state?.message;
  const stateType = location.state?.messageType;
  
  const displayMessage = message || stateMessage;
  const messageType = stateType || 'success';
  
  useEffect(() => {
    if (autoHide && displayMessage) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [displayMessage, autoHide, duration, onClose]);

  if (!displayMessage) {
    return null;
  }

  return (
    <MDBox
      position="fixed"
      top={20}
      right={20}
      zIndex={9999}
      maxWidth={400}
      sx={{
        animation: 'slideInRight 0.3s ease-out'
      }}
    >
      <Collapse in={true}>
        <Alert
          severity={messageType}
          action={
            <MDButton
              color="inherit"
              size="small"
              onClick={onClose}
              sx={{ minWidth: 'auto', p: 0.5 }}
            >
              <Close fontSize="small" />
            </MDButton>
          }
          sx={{
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '1px solid',
            borderColor: messageType === 'success' ? 'success.main' : 'error.main',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
        >
          <AlertTitle sx={{ fontWeight: 600, mb: 0.5 }}>
            {messageType === 'success' ? 'Success!' : 'Error!'}
          </AlertTitle>
          <MDTypography variant="body2" color="inherit">
            {displayMessage}
          </MDTypography>
        </Alert>
      </Collapse>
    </MDBox>
  );
};

export default SuccessNotification; 