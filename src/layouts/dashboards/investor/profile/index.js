import React, { useState, useEffect } from 'react';
import { useModal } from 'context/ModalContext';
import { useNotification } from 'context/NotificationContext';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';

// Custom components
import ProfileBasicInfo from './components/ProfileBasicInfo';
import InvestmentPreferences from './components/InvestmentPreferences';

const InvestorProfile = () => {
  const { openModal } = useModal();
  const { showNotification } = useNotification();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger le profil utilisateur
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      // Appel API pour récupérer le profil
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data.data);
      }
    } catch (error) {
      showNotification('error', 'Erreur lors du chargement du profil');
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

  if (loading) {
    return <div>Chargement...</div>;
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
                  <Avatar
                    src={profile?.avatar}
                    sx={{ width: 80, height: 80 }}
                  >
                    {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                  </Avatar>
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