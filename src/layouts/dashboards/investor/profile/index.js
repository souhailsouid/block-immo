/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { useModal } from 'context/ModalContext';
import { useNotification } from 'context/NotificationContext';
import { useAuth } from 'hooks/useAuth';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

// Custom components
import ProfileBasicInfo from './components/ProfileBasicInfo';
import InvestmentPreferences from './components/InvestmentPreferences';
import ProfilePageSkeleton from './components/ProfileSkeleton';

// Avatar component
import DiceBearAvatar from 'components/DiceBearAvatar';

const InvestorProfile = () => {
  const { openModal } = useModal();
  const { showNotification } = useNotification();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger le profil utilisateur
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      
      // Simuler un délai de chargement pour voir le skeleton
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Pour l'instant, utiliser les données de l'utilisateur connecté
      // TODO: Appel API pour récupérer le profil complet
      const mockProfile = {
        firstName: user?.given_name || user?.firstName || 'John',
        lastName: user?.family_name || user?.lastName || 'Doe',
        email: user?.email || 'john.doe@example.com',
        phone: user?.phone_number || '+33 6 12 34 56 78',
        location: 'Paris, France',
        avatar: user?.picture,
        createdAt: '2023-01-15',
        investmentPreferences: {
          propertyTypes: ['Appartement', 'Maison', 'Local commercial'],
          riskLevel: 'medium',
          minInvestment: 1000,
          maxInvestment: 50000,
          expectedReturn: 8
        },
        // Avatar DiceBear
        userProfile: {
          avatar: {
            seed: user?.username || user?.sub || 'default',
            style: 'pixelArt'
          }
        }
      };
      
      setProfile(mockProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
      showNotification('Erreur lors du chargement du profil', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    openModal('user-profile', {
      ...profile,
      role: 'INVESTOR'
    });
  };

  // Déterminer quel avatar afficher
  const renderAvatar = () => {
    const avatarProps = {
      sx: { width: 80, height: 80 }
    };

    // Si l'utilisateur a un avatar DiceBear
    if (profile?.userProfile?.avatar?.seed) {
      return (
        <DiceBearAvatar
          seed={profile.userProfile.avatar.seed}
          style={profile.userProfile.avatar.style || 'pixelArt'}
          size={80}
          sx={{
            border: '2px solid #fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        />
      );
    }

    // Si l'utilisateur a une photo de profil
    if (profile?.avatar) {
      return (
        <Avatar
          src={profile.avatar}
          {...avatarProps}
        >
          {profile?.firstName?.[0]}{profile?.lastName?.[0]}
        </Avatar>
      );
    }

    // Avatar par défaut avec initiales
    return (
      <Avatar {...avatarProps}>
        {profile?.firstName?.[0]}{profile?.lastName?.[0]}
      </Avatar>
    );
  };

  // Afficher le skeleton pendant le chargement
  if (loading) {
    return <ProfilePageSkeleton />;
  }

  return (
    <MDBox>
      <Grid container spacing={3}>
        {/* Header du profil */}
        <Grid item xs={12}>
          <Card>
            <MDBox p={3}>
              <Grid container alignItems="center" spacing={3}>
                <Grid item>
                  {renderAvatar()}
                </Grid>
                <Grid item xs>
                  <MDTypography variant="h4" fontWeight="bold">
                    {profile?.firstName} {profile?.lastName}
                  </MDTypography>
                  <MDTypography variant="body2" color="text.secondary">
                    Investisseur
                  </MDTypography>
                  <MDBox mt={1}>
                    <Chip 
                      label={profile?.location || 'Localisation non définie'} 
                      size="small" 
                      color="primary" 
                    />
                  </MDBox>
                </Grid>
                <Grid item>
                  <MDButton 
                    variant="contained" 
                    color="info"
                    onClick={handleEditProfile}
                  >
                    Modifier le profil
                  </MDButton>
                </Grid>
              </Grid>
            </MDBox>
          </Card>
        </Grid>

        {/* Informations de base */}
        <Grid item xs={12} md={6}>
          <ProfileBasicInfo profile={profile} />
        </Grid>

        {/* Préférences d'investissement */}
        <Grid item xs={12} md={6}>
          <InvestmentPreferences profile={profile} />
        </Grid>
      </Grid>
    </MDBox>
  );
};

export default InvestorProfile; 