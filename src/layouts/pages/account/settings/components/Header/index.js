/* eslint-disable no-undef */
// @mui material components
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDBadge from 'components/MDBadge';
import AvatarDisplay from 'components/AvatarDisplay';

// Skeleton components
import { AvatarSkeleton, TextSkeleton, ChipSkeleton } from 'components/MDSkeleton';

// User profile hook
import { useUserProfile } from 'hooks/useUserProfile';
import { useAvatar } from 'hooks/useAvatar';

// Profile service
import { profileService } from 'services/api/modules/auth/profileService';

// Images
import defaultProfilePicture from 'assets/images/bruce-mars.jpg';

const Header = () => {
  const { 
    userProfile, 
    isLoading, 
    firstName, 
    lastName, 
    fullName, 
    profilePicture,
    primaryRole,
    email 
  } = useUserProfile();
  
  const { currentAvatar, updateAvatar } = useAvatar();

  // Configuration des couleurs par rôle
  const roleConfig = {
    ADMIN: { color: 'error', label: 'Administrator' },
    PROFESSIONAL: { color: 'warning', label: 'Professional' },
    INVESTOR: { color: 'info', label: 'Investor' }
  };

  const roleInfo = roleConfig[primaryRole] || roleConfig.INVESTOR;

  if (isLoading) {
    return (
      <Card id="profile">
        <MDBox p={2}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <AvatarSkeleton size={64} />
            </Grid>
            <Grid item xs>
              <MDBox height="100%" mt={0.5} lineHeight={1}>
                <TextSkeleton lines={1} height={28} />
                <MDBox mt={1}>
                  <TextSkeleton lines={1} height={16} />
                </MDBox>
                <MDBox mt={1}>
                  <ChipSkeleton width={100} height={20} />
                </MDBox>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </Card>
    );
  }

  return (
    <Card id="profile">
      <MDBox p={2}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <AvatarDisplay
              avatar={userProfile?.avatar || currentAvatar || { src: profilePicture || defaultProfilePicture, name: fullName }}
              userProfile={userProfile}
              onAvatarChange={(newAvatar) => {
                // Mettre à jour l'avatar local et dans le profil
                updateAvatar(newAvatar);
                
                // Sauvegarder dans la base de données via le service de profil
                if (newAvatar && newAvatar.type === 'dicebear') {
                  // Inclure les champs obligatoires avec l'avatar
                  const updateData = {
                    firstName: firstName || userProfile?.firstName || '',
                    lastName: lastName || userProfile?.lastName || '',
                    email: email || userProfile?.email || '',
                    avatar: newAvatar
                  };
                  
                  profileService.updateUserProfile(updateData)
                    .then(result => {
                      if (result.success) {
                        // Rafraîchir le profil pour refléter les changements
                        window.location.reload();
                      }
                    })
                    .catch(error => {
                       
                      console.error('Error saving avatar:', error);
                    });
                }
              }}
              size="xl"
              showChangeButton={true}
            />
          </Grid>
          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {fullName || `${firstName} ${lastName}`.trim() || 'Utilisateur'}
              </MDTypography>
              <MDBox display="flex" alignItems="center" gap={1} mt={1}>
                <MDBadge 
                  color={roleInfo.color} 
                  variant="gradient" 
                  size="sm"
                >
                  {roleInfo.label}
                </MDBadge>
                {email && (
                  <MDTypography variant="button" color="text" fontWeight="medium">
                    • {email}
                  </MDTypography>
                )}
              </MDBox>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </Card>
  );
};

export default Header;
