import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import { Grid, Card, Typography, IconButton, Box } from '@mui/material';
import {  Delete, CloudUpload } from '@mui/icons-material';

const PhotoUploadManager = ({ onPhotosChange }) => {
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const photoData = {
        id: Date.now() + Math.random(),
        name: file.name,
        // eslint-disable-next-line no-undef
        url: URL.createObjectURL(file),
        size: file.size,
        type: file.type,
        file: file,
        uploadedAt: new Date().toISOString(),
      };

      setUploadedPhotos(prev => [...prev, photoData]);
      
      // Notifier le composant parent
      if (onPhotosChange) {
        onPhotosChange([...uploadedPhotos, photoData]);
      }
    }
    
    // Réinitialiser l'input pour permettre la sélection du même fichier
    event.target.value = '';
  };

  const handleDeletePhoto = (photoId) => {
    const updatedPhotos = uploadedPhotos.filter(photo => photo.id !== photoId);
    setUploadedPhotos(updatedPhotos);
    
    // Notifier le composant parent
    if (onPhotosChange) {
      onPhotosChange(updatedPhotos);
    }
  };

  const handleClearAll = () => {
    setUploadedPhotos([]);
    
    // Notifier le composant parent
    if (onPhotosChange) {
      onPhotosChange([]);
    }
  };

  return (
    <MDBox>
      {/* Bouton de sélection */}
      <Card sx={{ p: 3, mb: 3 }}>
        <MDBox display="flex" justifyContent="center" alignItems="center">
          <MDButton
            variant="outlined"
            color="customBlue"
            size="large"
            startIcon={<CloudUpload />}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              minWidth: 200,
              height: 60,
              fontSize: '1.1rem',
              borderStyle: 'dashed',
              borderWidth: 2,
            }}
          >
            📸 Click to select a photo
          </MDButton>
          
          {/* Input file caché */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </MDBox>
        
        {/* Instructions */}
        <MDBox mt={2} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            Accepted formats: JPG, PNG, WebP, GIF • Max size: 10MB
          </Typography>
        </MDBox>
      </Card>

      {/* Galerie des photos */}
      {uploadedPhotos.length > 0 && (
        <Card sx={{ p: 3 }}>
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              🖼️ Selected Photos ({uploadedPhotos.length})
            </Typography>
            <MDButton
              variant="outlined"
              color="error"
              size="small"
              onClick={handleClearAll}
            >
              Clear All
            </MDButton>
          </MDBox>
          
          <Grid container spacing={2}>
            {uploadedPhotos.map((photo) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={photo.id}>
                <Card sx={{ p: 2, position: 'relative' }}>
                  <Box
                    component="img"
                    src={photo.url}
                    alt={photo.name}
                    sx={{
                      width: '100%',
                      height: 150,
                      objectFit: 'cover',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  />
                  
                  <Typography variant="caption" display="block" noWrap>
                    {photo.name}
                  </Typography>
                  
                  <Typography variant="caption" color="textSecondary">
                    {(photo.size / 1024 / 1024).toFixed(1)} MB
                  </Typography>
                  
                  {/* Bouton de suppression */}
                  <IconButton
                    size="small"
                    onClick={() => handleDeletePhoto(photo.id)}
                    color="error"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                      }
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Card>
      )}
    </MDBox>
  );
};

PhotoUploadManager.propTypes = {
  onPhotosChange: PropTypes.func.isRequired,
};

export default PhotoUploadManager; 