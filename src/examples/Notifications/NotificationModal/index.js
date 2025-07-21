
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';

// @mui icons
import CloseIcon from '@mui/icons-material/Close';

import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import IconButton from '@mui/material/IconButton';

const NotificationModal = ({
  onClose,
  title = 'Message sent successfully!',
  message = 'Your message has been sent successfully. We will get back to you within 24 hours.',
}) => {
  return (
    <MDBox
      position="relative"
      width="500px"
      display="flex"
      flexDirection="column"
      borderRadius="xl"
      variant="gradient"
      bgColor="customBlue"
      shadow="sm"
    >
      <MDBox display="flex" alignItems="center" justifyContent="space-between" py={3} px={2}>
        <MDTypography variant="h6" color="white">
          {title}
        </MDTypography>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgb(255, 255, 255)',
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
          check_circle
        </Icon>
        <MDTypography variant="h4" color="white" mt={3} mb={1}>
          Thank you!
        </MDTypography>
        <MDTypography variant="body2" color="white" opacity={0.8} mb={2}>
          {message}
        </MDTypography>
      </MDBox>
      <Divider light sx={{ my: 0 }} />
      <MDBox display="flex" justifyContent="center" py={2} px={1.5}>
        <MDButton
          variant="gradient"
          color="white"
          onClick={onClose}
          sx={{
            color: 'customBlue.main',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              color: 'customBlue.main',
            },
          }}
        >
          Got it!
        </MDButton>
      </MDBox>
    </MDBox>
  );
};

export default NotificationModal;
