import { useMemo } from 'react';

// @mui material components
import Avatar from '@mui/material/Avatar';

// Material Dashboard 3 PRO React components
import MDAvatar from 'components/MDAvatar';

// DiceBear imports
import { createAvatar } from '@dicebear/core';
import { 
  pixelArt, 
  identicon, 
  bottts, 
  avataaars, 
  funEmoji,
  lorelei,
  micah,
  miniavs,
  shapes,
  adventurer,
  bigEars,
  croodles,
  personas
} from '@dicebear/collection';

const DiceBearAvatar = ({ 
  seed = 'default', 
  style = 'pixelArt', 
  size = 'lg',
  sx = {},
  ...props 
}) => {
  const avatarUrl = useMemo(() => {
    const styleMap = {
      pixelArt,
      identicon,
      bottts,
      avataaars,
      funEmoji,
      lorelei,
      micah,
      miniavs,
      shapes,
      adventurer,
      bigEars,
      croodles,
      personas
    };

    const selectedStyle = styleMap[style] || pixelArt;
    
    try {
      const avatar = createAvatar(selectedStyle, {
        seed: seed,
        size: 128,
        backgroundColor: ['b6e3f4', 'c0aede', 'ffdfbf', 'ffd5dc', 'd1d4f9'],
        ...props
      });

      return avatar.toDataUri();
    } catch (error) {
      // Fallback to default avatar
      const fallbackAvatar = createAvatar(pixelArt, {
        seed: 'fallback',
        size: 128,
        backgroundColor: ['b6e3f4']
      });
      
      return fallbackAvatar.toDataUri();
    }
  }, [seed, style, props]);

  return (
    <MDAvatar
      src={avatarUrl}
      alt={`Avatar ${seed}`}
      size={size}
      sx={{
        ...sx,
        border: '2px solid #fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    />
  );
};

export default DiceBearAvatar; 