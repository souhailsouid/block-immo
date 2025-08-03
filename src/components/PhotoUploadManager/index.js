import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import { Grid, Card, Typography, IconButton, Box, CircularProgress } from '@mui/material';
import { Delete, CloudUpload } from '@mui/icons-material';

const PhotoUploadManager = ({ onPhotosChange, propertyId, currentPhotos = [] }) => {
  const [photos, setPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef(null);

  // Mettre à jour les photos quand currentPhotos change
  useEffect(() => {
    setPhotos(currentPhotos || []);
  }, [currentPhotos]);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      try {
        setIsUploading(true);
        
        // Créer une URL temporaire pour prévisualisation
        const tempUrl = window.URL.createObjectURL(file);
        
        const photoData = {
          id: `new_${Date.now()}_${Math.random()}`,
          fileName: file.name,
          src: tempUrl,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
          isNew: true,
          file: file, // Garder le fichier pour upload plus tard
          status: 'pending' // Status pour différencier les photos
        };

        const newPhotos = [...photos, photoData];
        setPhotos(newPhotos);
        
        // Notifier le composant parent
        if (onPhotosChange) {
          onPhotosChange(newPhotos);
        }
      } catch (error) {
        // Erreur silencieuse pour la prévisualisation
      } finally {
        setIsUploading(false);
      }
    }
    
    // Réinitialiser l'input pour permettre la sélection du même fichier
    event.target.value = '';
  };

  const handleDeletePhoto = (photoId) => {
    try {
      setIsDeleting(true);
      
      // Supprimer par id ou key ou index si nécessaire
      const updatedPhotos = photos.filter((photo, index) => {
        const photoIdentifier = photo.id || photo.key || `photo_${index}`;
        return photoIdentifier !== photoId;
      });
      
      setPhotos(updatedPhotos);
      
      // Notifier le composant parent
      if (onPhotosChange) {
        onPhotosChange(updatedPhotos);
      }
    } catch (error) {
      // Erreur silencieuse pour la suppression
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearAll = () => {
    setPhotos([]);
    
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
            startIcon={isUploading ? <CircularProgress size={20} /> : <CloudUpload />}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            sx={{
              minWidth: 200,
              height: 60,
              fontSize: '1.1rem',
              borderStyle: 'dashed',
              borderWidth: 2,
            }}
          >
            {isUploading ? '📤 Uploading...' : '📸 Click to select a photo'}
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

      {/* Toutes les photos dans une seule grille */}
      {photos.length > 0 && (
        <Card sx={{ p: 3 }}>
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              📷 Photos ({photos.length})
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
            {photos.map((photo, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={photo.id || photo.key || `photo_${index}`}>
                <Card sx={{ p: 2, position: 'relative' }}>
                  <Box
                    component="img"
                    src={photo.src || photo.url}
                    alt={photo.label || photo.fileName || `Photo ${index + 1}`}
                    sx={{
                      width: '100%',
                      height: 150,
                      objectFit: 'cover',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  />
                  
                  <Typography variant="caption" display="block" noWrap>
                    {photo.label || photo.fileName || `Photo ${index + 1}`}
                  </Typography>
                  
                  {photo.size && (
                    <Typography variant="caption" color="textSecondary">
                      {(photo.size / 1024 / 1024).toFixed(1)} MB
                    </Typography>
                  )}
                  
                  {/* Badge pour les nouvelles photos */}
                  {photo.isNew && (
                    <MDBox
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        backgroundColor: '#4caf50',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                      }}
                    >
                      NEW
                    </MDBox>
                  )}
                  
                  {/* Bouton de suppression */}
                  <IconButton
                    size="small"
                    onClick={() => handleDeletePhoto(photo.id || photo.key)}
                    disabled={isDeleting}
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
                    {isDeleting ? <CircularProgress size={16} /> : <Delete />}
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
  propertyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currentPhotos: PropTypes.array,
};

export default PhotoUploadManager; 