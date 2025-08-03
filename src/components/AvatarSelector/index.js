import { useState } from 'react';

// @mui material components
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDAvatar from 'components/MDAvatar';

// @mui icons
import Icon from '@mui/material/Icon';

// Avatar images
import team1 from 'assets/images/team-1.jpg';
import team2 from 'assets/images/team-2.jpg';
import team3 from 'assets/images/team-3.jpg';
import team4 from 'assets/images/team-4.jpg';
import team5 from 'assets/images/team-5.jpg';
import bruceMars from 'assets/images/bruce-mars.jpg';
import drake from 'assets/images/drake.jpg';
import ivanaSquare from 'assets/images/ivana-square.jpg';
import kalVisuals from 'assets/images/kal-visuals-square.jpg';
import marie from 'assets/images/marie.jpg';

const AvatarSelector = ({ open, onClose, onSelect, currentAvatar }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);

  const avatarOptions = [
    { id: 'team-1', src: team1, name: 'Professional 1' },
    { id: 'team-2', src: team2, name: 'Professional 2' },
    { id: 'team-3', src: team3, name: 'Professional 3' },
    { id: 'team-4', src: team4, name: 'Professional 4' },
    { id: 'team-5', src: team5, name: 'Professional 5' },
    { id: 'bruce-mars', src: bruceMars, name: 'Bruce Mars' },
    { id: 'drake', src: drake, name: 'Drake' },
    { id: 'ivana-square', src: ivanaSquare, name: 'Ivana' },
    { id: 'kal-visuals', src: kalVisuals, name: 'Kal Visuals' },
    { id: 'marie', src: marie, name: 'Marie' },
  ];

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleConfirm = () => {
    if (selectedAvatar) {
      onSelect(selectedAvatar);
    }
    onClose();
  };

  const handleCancel = () => {
    setSelectedAvatar(currentAvatar);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <MDBox display="flex" alignItems="center" gap={1}>
          <Icon color="customBlue">face</Icon>
          <MDTypography variant="h6" fontWeight="bold" color="customBlue">
            Choose Your Avatar
          </MDTypography>
        </MDBox>
      </DialogTitle>
      
      <DialogContent>
        <MDBox mb={3}>
          <MDTypography variant="body2" color="text">
            Select an avatar to personalize your profile. You can change it anytime.
          </MDTypography>
        </MDBox>
        
        <Grid container spacing={2}>
          {avatarOptions.map((avatar) => (
            <Grid item xs={6} sm={4} md={3} key={avatar.id}>
              <MDBox
                onClick={() => handleAvatarSelect(avatar)}
                sx={{
                  cursor: 'pointer',
                  borderRadius: '12px',
                  p: 1,
                  border: selectedAvatar?.id === avatar.id 
                    ? '3px solid #1976d2' 
                    : '2px solid transparent',
                  backgroundColor: selectedAvatar?.id === avatar.id 
                    ? 'rgba(25, 118, 210, 0.1)' 
                    : 'transparent',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <MDBox textAlign="center">
                  <MDAvatar
                    src={avatar.src}
                    alt={avatar.name}
                    size="lg"
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 1,
                    }}
                  />
                  <MDTypography 
                    variant="caption" 
                    color="text" 
                    fontWeight="medium"
                    textAlign="center"
                  >
                    {avatar.name}
                  </MDTypography>
                </MDBox>
              </MDBox>
            </Grid>
          ))}
        </Grid>
        
        {selectedAvatar && (
          <MDBox mt={3} p={2} borderRadius="md" sx={{ backgroundColor: 'grey.50' }}>
            <MDTypography variant="body2" color="text" mb={1}>
              Selected Avatar:
            </MDTypography>
            <MDBox display="flex" alignItems="center" gap={2}>
              <MDAvatar
                src={selectedAvatar.src}
                alt={selectedAvatar.name}
                size="md"
              />
              <MDTypography variant="body2" fontWeight="medium">
                {selectedAvatar.name}
              </MDTypography>
            </MDBox>
          </MDBox>
        )}
      </DialogContent>
      
      <DialogActions>
        <MDButton 
          color="secondary" 
          onClick={handleCancel}
        >
          Cancel
        </MDButton>
        <MDButton 
          color="customBlue" 
          onClick={handleConfirm}
          disabled={!selectedAvatar}
        >
          Confirm Selection
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

export default AvatarSelector; 