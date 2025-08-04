import React from 'react';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const ProfileBasicInfo = ({ profile }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const InfoItem = ({ icon, label, value }) => (
    <MDBox mb={2}>
      <MDBox display="flex" alignItems="center" mb={1}>
        {icon}
        <MDTypography variant="body2" fontWeight="medium" ml={1} color="text">
          {label}
        </MDTypography>
      </MDBox>
      <MDTypography variant="body1" color="dark">
        {value || 'Non défini'}
      </MDTypography>
    </MDBox>
  );

  return (
    <Card>
      <MDBox p={3}>
        <MDBox mb={3}>
          <MDTypography variant="h6" fontWeight="medium">
            Informations personnelles
          </MDTypography>
        </MDBox>
        
        <MDBox>
          <InfoItem
            icon={<PersonIcon fontSize="small" color="primary" />}
            label="Nom complet"
            value={`${profile?.firstName || ''} ${profile?.lastName || ''}`.trim()}
          />
          
          <InfoItem
            icon={<EmailIcon fontSize="small" color="primary" />}
            label="Email"
            value={profile?.email}
          />
          
          <InfoItem
            icon={<PhoneIcon fontSize="small" color="primary" />}
            label="Téléphone"
            value={profile?.phone}
          />
          
          <InfoItem
            icon={<LocationOnIcon fontSize="small" color="primary" />}
            label="Localisation"
            value={profile?.location}
          />
          
          <InfoItem
            icon={<CalendarTodayIcon fontSize="small" color="primary" />}
            label="Date d'inscription"
            value={formatDate(profile?.createdAt)}
          />
        </MDBox>
      </MDBox>
    </Card>
  );
};

export default ProfileBasicInfo; 