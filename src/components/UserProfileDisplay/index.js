import React from 'react';
import PropTypes from 'prop-types';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDBadge from 'components/MDBadge';
import MDAvatar from 'components/MDAvatar';

// Custom components
import DiceBearAvatar from 'components/DiceBearAvatar';

// @mui icons
import Icon from '@mui/material/Icon';

/**
 * Composant pour afficher les informations utilisateur avec badge de rôle
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.userProfile - Le profil utilisateur
 * @param {boolean} props.isLoading - État de chargement
 * @param {string} props.size - Taille de l'avatar ('sm', 'md', 'lg')
 * @param {boolean} props.showRole - Afficher le badge de rôle
 * @returns {React.ReactNode} Le composant d'affichage du profil
 */
const UserProfileDisplay = ({ 
  userProfile, 
  isLoading = false, 
  size = 'sm',
  showRole = true 
}) => {
  if (isLoading) {
    return (
      <MDBox display="flex" alignItems="center" gap={2}>
        <MDAvatar 
          size={size}
          sx={{ 
            bgcolor: 'grey.300',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        >
          <Icon>person</Icon>
        </MDAvatar>
        <MDBox>
          <MDTypography variant="button" color="text" fontWeight="medium">
            Chargement...
          </MDTypography>
        </MDBox>
      </MDBox>
    );
  }

  if (!userProfile) {
    return (
      <MDBox display="flex" alignItems="center" gap={2}>
        <MDAvatar size={size} sx={{ bgcolor: 'grey.300' }}>
          <Icon>person</Icon>
        </MDAvatar>
        <MDBox>
          <MDTypography variant="button" color="text" fontWeight="medium">
            Utilisateur
          </MDTypography>
        </MDBox>
      </MDBox>
    );
  }

  const { 
    firstName, 
    lastName, 
    fullName, 
    profilePicture, 
    primaryRole,
    email,
    avatar 
  } = userProfile;

  // Configuration des couleurs par rôle
  const roleConfig = {
    ADMIN: { color: 'error', label: 'Admin' },
    PROFESSIONAL: { color: 'warning', label: 'Professional' },
    INVESTOR: { color: 'info', label: 'Investor' }
  };

  const roleInfo = roleConfig[primaryRole] || roleConfig.INVESTOR;

  // Fonction pour déterminer si c'est un avatar DiceBear
  const isDiceBearAvatar = (avatarData) => {
    return avatarData?.type === 'dicebear' || avatarData?.style;
  };

  // Fonction pour afficher l'avatar approprié
  const renderAvatar = () => {
    if (isDiceBearAvatar(avatar)) {
      return (
        <DiceBearAvatar
          seed={avatar?.seed || 'default'}
          style={avatar?.style || 'pixelArt'}
          size={size}
          sx={{
            border: '2px solid',
            borderColor: `${roleInfo.color}.main`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        />
      );
    }

    return (
      <MDAvatar 
        src={profilePicture} 
        alt={fullName}
        size={size}
        sx={{ 
          border: '2px solid',
          borderColor: `${roleInfo.color}.main`
        }}
      />
    );
  };

  return (
    <MDBox display="flex" alignItems="center" gap={2}>
      {renderAvatar()}
      <MDBox>
        <MDTypography variant="button" color="text" fontWeight="medium">
          {fullName || `${firstName} ${lastName}`.trim() || 'Utilisateur'}
        </MDTypography>
        {showRole && (
          <MDBadge 
            color={roleInfo.color} 
            variant="gradient" 
            size="sm"
            sx={{ mt: 0.5 }}
          >
            {roleInfo.label}
          </MDBadge>
        )}
        {email && (
          <MDTypography variant="caption" color="text" sx={{ display: 'block', mt: 0.5 }}>
            {email}
          </MDTypography>
        )}
      </MDBox>
    </MDBox>
  );
};

UserProfileDisplay.propTypes = {
  userProfile: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    fullName: PropTypes.string,
    profilePicture: PropTypes.string,
    primaryRole: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.shape({
      type: PropTypes.string,
      style: PropTypes.string,
      seed: PropTypes.string,
      name: PropTypes.string
    })
  }),
  isLoading: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  showRole: PropTypes.bool
};

export default UserProfileDisplay; 