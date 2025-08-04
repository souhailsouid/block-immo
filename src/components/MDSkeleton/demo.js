import React, { useState } from 'react';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

// Skeleton components
import MDSkeleton, { 
  AvatarSkeleton, 
  TextSkeleton, 
  ButtonSkeleton, 
  CardSkeleton, 
  ChipSkeleton, 
  ImageSkeleton 
} from './index';

const SkeletonDemo = () => {
  const [showSkeleton, setShowSkeleton] = useState(true);

  return (
    <MDBox p={3}>
      <MDTypography variant="h4" mb={3}>
        Démonstration des Skeletons
      </MDTypography>

      <MDButton 
        variant="contained" 
        color="primary" 
        onClick={() => setShowSkeleton(!showSkeleton)}
        mb={3}
      >
        {showSkeleton ? 'Masquer Skeletons' : 'Afficher Skeletons'}
      </MDButton>

      <Grid container spacing={3}>
        {/* Avatar Skeleton */}
        <Grid item xs={12} md={6}>
          <Card>
            <MDBox p={3}>
              <MDTypography variant="h6" mb={2}>Avatar Skeleton</MDTypography>
              {showSkeleton ? (
                <AvatarSkeleton size={80} />
              ) : (
                <MDTypography>Contenu chargé !</MDTypography>
              )}
            </MDBox>
          </Card>
        </Grid>

        {/* Text Skeleton */}
        <Grid item xs={12} md={6}>
          <Card>
            <MDBox p={3}>
              <MDTypography variant="h6" mb={2}>Text Skeleton</MDTypography>
              {showSkeleton ? (
                <TextSkeleton lines={3} height={20} />
              ) : (
                <MDBox>
                  <MDTypography>Première ligne de contenu</MDTypography>
                  <MDTypography>Deuxième ligne de contenu</MDTypography>
                  <MDTypography>Troisième ligne de contenu</MDTypography>
                </MDBox>
              )}
            </MDBox>
          </Card>
        </Grid>

        {/* Button Skeleton */}
        <Grid item xs={12} md={6}>
          <Card>
            <MDBox p={3}>
              <MDTypography variant="h6" mb={2}>Button Skeleton</MDTypography>
              {showSkeleton ? (
                <ButtonSkeleton width={120} height={40} />
              ) : (
                <MDButton variant="contained" color="primary">
                  Action
                </MDButton>
              )}
            </MDBox>
          </Card>
        </Grid>

        {/* Chip Skeleton */}
        <Grid item xs={12} md={6}>
          <Card>
            <MDBox p={3}>
              <MDTypography variant="h6" mb={2}>Chip Skeleton</MDTypography>
              {showSkeleton ? (
                <MDBox display="flex" gap={1}>
                  <ChipSkeleton width={60} />
                  <ChipSkeleton width={80} />
                  <ChipSkeleton width={70} />
                </MDBox>
              ) : (
                <MDTypography>Tags chargés !</MDTypography>
              )}
            </MDBox>
          </Card>
        </Grid>

        {/* Image Skeleton */}
        <Grid item xs={12} md={6}>
          <Card>
            <MDBox p={3}>
              <MDTypography variant="h6" mb={2}>Image Skeleton</MDTypography>
              {showSkeleton ? (
                <ImageSkeleton width="100%" height={200} />
              ) : (
                <MDBox
                  width="100%"
                  height={200}
                  bgcolor="grey.200"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius={1}
                >
                  <MDTypography>Image chargée</MDTypography>
                </MDBox>
              )}
            </MDBox>
          </Card>
        </Grid>

        {/* Complex Card Skeleton */}
        <Grid item xs={12} md={6}>
          <MDTypography variant="h6" mb={2}>Card Complexe</MDTypography>
          {showSkeleton ? (
            <CardSkeleton>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <AvatarSkeleton size={60} />
                </Grid>
                <Grid item xs>
                  <TextSkeleton lines={2} height={20} />
                  <MDBox mt={1}>
                    <ChipSkeleton width={100} />
                  </MDBox>
                </Grid>
                <Grid item>
                  <ButtonSkeleton width={100} height={36} />
                </Grid>
              </Grid>
              <MDBox mt={3}>
                <TextSkeleton lines={3} height={16} />
              </MDBox>
            </CardSkeleton>
          ) : (
            <Card>
              <MDBox p={3}>
                <MDTypography>Contenu de la carte chargé !</MDTypography>
              </MDBox>
            </Card>
          )}
        </Grid>
      </Grid>
    </MDBox>
  );
};

export default SkeletonDemo; 