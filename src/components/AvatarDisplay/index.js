import { useState } from 'react';

// @mui material components
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDAvatar from 'components/MDAvatar';

// @mui icons
import Icon from '@mui/material/Icon';

// Custom components
import AvatarSelector from 'components/AvatarSelector';
import DiceBearAvatarSelector from 'components/DiceBearAvatarSelector';
import DiceBearAvatar from 'components/DiceBearAvatar';
import { useAvatar } from 'hooks/useAvatar';

// Default avatar
import team3 from 'assets/images/team-3.jpg';

const AvatarDisplay = ({ avatar, onAvatarChange, size = "lg", showChangeButton = true, userProfile }) => {
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showDiceBearSelector, setShowDiceBearSelector] = useState(false);
  const { currentAvatar, updateAvatar } = useAvatar();

  const handleAvatarChange = (newAvatar) => {
    updateAvatar(newAvatar);
    if (onAvatarChange) {
      onAvatarChange(newAvatar);
    }
  };

  const getAvatarSrc = () => {
    if (currentAvatar?.src) {
      return currentAvatar.src;
    }
    if (avatar?.src) {
      return avatar.src;
    }
    // Default avatar if none selected
    return team3; // Import direct instead of path
  };

  const getAvatarName = () => {
    if (currentAvatar?.name) {
      return currentAvatar.name;
    }
    if (avatar?.name) {
      return avatar.name;
    }
    return 'Default Avatar';
  };

  const isDiceBearAvatar = (avatar) => {
    return avatar?.type === 'dicebear' || avatar?.style;
  };

  return (
    <>
      <MDBox position="relative" display="inline-block">
        {isDiceBearAvatar(currentAvatar || avatar) ? (
          <DiceBearAvatar
            seed={currentAvatar?.seed || avatar?.seed || 'default'}
            style={currentAvatar?.style || avatar?.style || 'pixelArt'}
            size={size}
            sx={{
              border: '3px solid #fff',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            }}
          />
        ) : (
          <MDAvatar
            src={getAvatarSrc()}
            alt={getAvatarName()}
            size={size}
            sx={{
              border: '3px solid #fff',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            }}
          />
        )}
        
        {showChangeButton && (
          <MDBox position="absolute" bottom={-5} right={-5} display="flex" gap={0.5}>
            <Tooltip title="Choose Photo Avatar" placement="top">
              <IconButton
                onClick={() => setShowAvatarSelector(true)}
                sx={{
                  backgroundColor: 'customBlue.main',
                  color: 'white',
                  width: 32,
                  height: 32,
                  '&:hover': {
                    backgroundColor: 'customBlue.dark',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <Icon fontSize="small">photo</Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Choose DiceBear Avatar" placement="top">
              <IconButton
                onClick={() => setShowDiceBearSelector(true)}
                sx={{
                  backgroundColor: 'success.main',
                  color: 'white',
                  width: 32,
                  height: 32,
                  '&:hover': {
                    backgroundColor: 'success.dark',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <Icon fontSize="small">auto_awesome</Icon>
              </IconButton>
            </Tooltip>
          </MDBox>
        )}
      </MDBox>

      <AvatarSelector
        open={showAvatarSelector}
        onClose={() => setShowAvatarSelector(false)}
        onSelect={handleAvatarChange}
        currentAvatar={avatar}
      />
      
      <DiceBearAvatarSelector
        open={showDiceBearSelector}
        onClose={() => setShowDiceBearSelector(false)}
        onSelect={handleAvatarChange}
        currentAvatar={avatar}
        userProfile={userProfile}
      />
    </>
  );
};

export default AvatarDisplay; 