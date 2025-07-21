import React, { useState } from 'react';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import { Card, Alert } from '@mui/material';
import { Add, PhotoCamera } from '@mui/icons-material';
import PhotoUploadManager from 'components/PhotoUploadManager';

const PropertyPhotosForm = ({ onSave, onCancel }) => {
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  const handlePhotosChange = (photos) => {
    setUploadedPhotos(photos);
  };

  const handleSavePhotos = () => {
    if (uploadedPhotos.length === 0) return;

    const photoEvent = {
      type: 'photo_upload',
      title: '📸 Photos Added',
      description: `Added ${uploadedPhotos.length} photos`,
      timestamp: new Date().toISOString(),
      data: { photos: uploadedPhotos }
    };

    onSave(photoEvent);
  };

  return (
    <MDBox>
      {/* Header */}
      <MDBox mb={3} display="flex" alignItems="center" gap={2}>
        <MDBox
          width="2.5rem"
          height="2.5rem"
          bgColor="customBlue"
          variant="gradient"
          borderRadius="xl"
          display="flex"
          justifyContent="center"
          alignItems="center"
          color="white"
        >
          <PhotoCamera fontSize="medium" />
        </MDBox>
        <MDTypography variant="h5" color="dark">
          Add Property Photos
        </MDTypography>
      </MDBox>

      {/* Instructions */}
      <MDBox mb={3}>
        <Alert severity="info">
          Click the button to select your photos one by one. You can delete each photo individually.
        </Alert>
      </MDBox>

      {/* Photo Upload Manager */}
      <PhotoUploadManager onPhotosChange={handlePhotosChange} />

      {/* Action Buttons */}
      <MDBox display="flex" justifyContent="flex-end" gap={2}>
        <MDButton
          variant="outlined"
          color="secondary"
          onClick={onCancel}
        >
          Cancel
        </MDButton>
        <MDButton
          variant="contained"
          color="customBlue"
          onClick={handleSavePhotos}
          disabled={uploadedPhotos.length === 0}
          startIcon={<Add />}
        >
          Add Photos ({uploadedPhotos.length})
        </MDButton>
      </MDBox>
    </MDBox>
  );
};

export default PropertyPhotosForm;
 