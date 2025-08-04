import React from 'react';
import { Skeleton } from '@mui/material';
import MDBox from 'components/MDBox';
import Card from '@mui/material/Card';

const MDSkeleton = ({ 
  variant = 'rectangular', 
  width = '100%', 
  height = 20, 
  animation = 'pulse',
  sx = {},
  ...other 
}) => {
  return (
    <Skeleton
      variant={variant}
      width={width}
      height={height}
      animation={animation}
      sx={{
        borderRadius: 1,
        ...sx
      }}
      {...other}
    />
  );
};

// Composant skeleton pour avatar
export const AvatarSkeleton = ({ size = 80 }) => (
  <MDSkeleton
    variant="circular"
    width={size}
    height={size}
  />
);

// Composant skeleton pour texte
export const TextSkeleton = ({ lines = 1, height = 20 }) => (
  <MDBox>
    {Array.from({ length: lines }).map((_, index) => (
      <MDSkeleton
        key={index}
        variant="text"
        height={height}
        sx={{ 
          mb: index < lines - 1 ? 1 : 0,
          width: index === lines - 1 ? '70%' : '100%' // Dernière ligne plus courte
        }}
      />
    ))}
  </MDBox>
);

// Composant skeleton pour bouton
export const ButtonSkeleton = ({ width = 120, height = 36 }) => (
  <MDSkeleton
    variant="rounded"
    width={width}
    height={height}
    sx={{ borderRadius: 2 }}
  />
);

// Composant skeleton pour carte complète
export const CardSkeleton = ({ children, ...cardProps }) => (
  <Card {...cardProps}>
    <MDBox p={3}>
      {children}
    </MDBox>
  </Card>
);

// Composant skeleton pour chip/badge
export const ChipSkeleton = ({ width = 80, height = 24 }) => (
  <MDSkeleton
    variant="rounded"
    width={width}
    height={height}
    sx={{ borderRadius: 3 }}
  />
);

// Composant skeleton pour image
export const ImageSkeleton = ({ width = '100%', height = 200 }) => (
  <MDSkeleton
    variant="rectangular"
    width={width}
    height={height}
    sx={{ borderRadius: 1 }}
  />
);

export default MDSkeleton; 