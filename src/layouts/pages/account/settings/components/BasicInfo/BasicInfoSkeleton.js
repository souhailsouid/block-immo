import React from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import MDBox from 'components/MDBox';
import { TextSkeleton, ButtonSkeleton } from 'components/MDSkeleton';

const BasicInfoSkeleton = () => {
  return (
    <Card id="basic-info">
      <MDBox p={3}>
        {/* Header */}
        <MDBox mb={3}>
          <TextSkeleton lines={1} height={24} />
          <MDBox mt={1}>
            <TextSkeleton lines={2} height={16} />
          </MDBox>
        </MDBox>

        {/* Form fields */}
        <Grid container spacing={3}>
          {/* Prénom */}
          <Grid item xs={12} md={6}>
            <MDBox mb={1}>
              <TextSkeleton lines={1} height={16} />
            </MDBox>
            <TextSkeleton lines={1} height={48} />
          </Grid>

          {/* Nom */}
          <Grid item xs={12} md={6}>
            <MDBox mb={1}>
              <TextSkeleton lines={1} height={16} />
            </MDBox>
            <TextSkeleton lines={1} height={48} />
          </Grid>

          {/* Email */}
          <Grid item xs={12} md={6}>
            <MDBox mb={1}>
              <TextSkeleton lines={1} height={16} />
            </MDBox>
            <TextSkeleton lines={1} height={48} />
          </Grid>

          {/* Téléphone */}
          <Grid item xs={12} md={6}>
            <MDBox mb={1}>
              <TextSkeleton lines={1} height={16} />
            </MDBox>
            <TextSkeleton lines={1} height={48} />
          </Grid>

          {/* Localisation */}
          <Grid item xs={12} md={6}>
            <MDBox mb={1}>
              <TextSkeleton lines={1} height={16} />
            </MDBox>
            <TextSkeleton lines={1} height={48} />
          </Grid>

          {/* Genre */}
          <Grid item xs={12} md={6}>
            <MDBox mb={1}>
              <TextSkeleton lines={1} height={16} />
            </MDBox>
            <TextSkeleton lines={1} height={48} />
          </Grid>

          {/* Date de naissance */}
          <Grid item xs={12}>
            <MDBox mb={1}>
              <TextSkeleton lines={1} height={16} />
            </MDBox>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextSkeleton lines={1} height={48} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextSkeleton lines={1} height={48} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextSkeleton lines={1} height={48} />
              </Grid>
            </Grid>
          </Grid>

          {/* Langues */}
          <Grid item xs={12}>
            <MDBox mb={1}>
              <TextSkeleton lines={1} height={16} />
            </MDBox>
            <TextSkeleton lines={1} height={48} />
          </Grid>

          {/* Bio */}
          <Grid item xs={12}>
            <MDBox mb={1}>
              <TextSkeleton lines={1} height={16} />
            </MDBox>
            <TextSkeleton lines={3} height={24} />
          </Grid>
        </Grid>

        {/* Actions */}
        <MDBox mt={4} display="flex" justifyContent="flex-end" gap={2}>
          <ButtonSkeleton width={100} height={40} />
          <ButtonSkeleton width={120} height={40} />
        </MDBox>
      </MDBox>
    </Card>
  );
};

export default BasicInfoSkeleton; 