import React from 'react';
import MDBox from 'components/MDBox';
import Grid from '@mui/material/Grid';
import { 
  CardSkeleton, 
  AvatarSkeleton, 
  TextSkeleton, 
  ButtonSkeleton, 
  ChipSkeleton 
} from 'components/MDSkeleton';

// Skeleton pour le header du profil
export const ProfileHeaderSkeleton = () => (
  <Grid item xs={12}>
    <CardSkeleton>
      <Grid container alignItems="center" spacing={3}>
        <Grid item>
          <AvatarSkeleton size={80} />
        </Grid>
        <Grid item xs>
          <MDBox>
            <TextSkeleton lines={1} height={32} />
            <MDBox mt={1}>
              <TextSkeleton lines={1} height={16} />
            </MDBox>
            <MDBox mt={1}>
              <ChipSkeleton width={120} />
            </MDBox>
          </MDBox>
        </Grid>
        <Grid item>
          <ButtonSkeleton width={140} height={40} />
        </Grid>
      </Grid>
    </CardSkeleton>
  </Grid>
);

// Skeleton pour les informations de base
export const ProfileBasicInfoSkeleton = () => (
  <Grid item xs={12} md={6}>
    <CardSkeleton>
      <MDBox>
        <TextSkeleton lines={1} height={24} />
        <MDBox mt={2}>
          <TextSkeleton lines={1} height={16} />
          <MDBox mt={1}>
            <TextSkeleton lines={1} height={20} />
          </MDBox>
        </MDBox>
        <MDBox mt={2}>
          <TextSkeleton lines={1} height={16} />
          <MDBox mt={1}>
            <TextSkeleton lines={1} height={20} />
          </MDBox>
        </MDBox>
        <MDBox mt={2}>
          <TextSkeleton lines={1} height={16} />
          <MDBox mt={1}>
            <TextSkeleton lines={1} height={20} />
          </MDBox>
        </MDBox>
        <MDBox mt={2}>
          <TextSkeleton lines={1} height={16} />
          <MDBox mt={1}>
            <TextSkeleton lines={1} height={20} />
          </MDBox>
        </MDBox>
      </MDBox>
    </CardSkeleton>
  </Grid>
);

// Skeleton pour les préférences d'investissement
export const InvestmentPreferencesSkeleton = () => (
  <Grid item xs={12} md={6}>
    <CardSkeleton>
      <MDBox>
        <TextSkeleton lines={1} height={24} />
        <MDBox mt={2}>
          <TextSkeleton lines={1} height={16} />
          <MDBox mt={1} display="flex" gap={1}>
            <ChipSkeleton width={60} />
            <ChipSkeleton width={80} />
            <ChipSkeleton width={70} />
          </MDBox>
        </MDBox>
        <MDBox mt={2}>
          <TextSkeleton lines={1} height={16} />
          <MDBox mt={1}>
            <TextSkeleton lines={1} height={20} />
          </MDBox>
        </MDBox>
        <MDBox mt={2}>
          <TextSkeleton lines={1} height={16} />
          <MDBox mt={1}>
            <TextSkeleton lines={1} height={20} />
          </MDBox>
        </MDBox>
        <MDBox mt={2}>
          <TextSkeleton lines={1} height={16} />
          <MDBox mt={1}>
            <TextSkeleton lines={1} height={20} />
          </MDBox>
        </MDBox>
      </MDBox>
    </CardSkeleton>
  </Grid>
);

// Skeleton complet pour la page profil
export const ProfilePageSkeleton = () => (
  <MDBox>
    <Grid container spacing={3}>
      <ProfileHeaderSkeleton />
      <ProfileBasicInfoSkeleton />
      <InvestmentPreferencesSkeleton />
    </Grid>
  </MDBox>
);

export default ProfilePageSkeleton; 