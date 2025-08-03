import React, { useState, useEffect } from 'react';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import { Card, Alert, CircularProgress } from '@mui/material';
import { Add, PhotoCamera } from '@mui/icons-material';
import PhotoUploadManager from 'components/PhotoUploadManager';
import { propertyPhotosService } from 'services/api/modules/properties/propertyPhotosService';
import { useQueryClient } from '@tanstack/react-query';
import { useNotification } from 'context/NotificationContext';

const PropertyPhotosForm = ({ initialData, onSave, onCancel }) => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  
  const { propertyId, currentPhotos = [] } = initialData || {};

  // Charger les photos existantes au montage
  useEffect(() => {
    const loadExistingPhotos = async () => {
      if (!propertyId) return;
      
      try {
        setIsLoading(true);
        const result = await propertyPhotosService.getPropertyPhotos(propertyId);
        
        if (result.success) {
          setPhotos(result.photos || []);
        } else {
          showNotification(
            'Error loading photos',
            result.error,
            'error',
            { duration: 5000, autoHide: true }
          );
        }
      } catch (error) {
        showNotification(
          'Error loading photos',
          error.message,
          'error',
          { duration: 5000, autoHide: true }
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingPhotos();
  }, [propertyId, showNotification]);

  const handlePhotosChange = (newPhotos) => {
    setPhotos(newPhotos);
  };

  const handleSavePhotos = async () => {
    if (!propertyId) {
      showNotification(
        'Error',
        'Property ID is missing',
        'error',
        { duration: 5000, autoHide: true }
      );
      return;
    }

    try {
      setIsSaving(true);
      
      // Séparer les photos existantes et les nouvelles photos avec fichiers
      const existingPhotos = photos.filter(photo => !photo.isNew);
      const newPhotosWithFiles = photos.filter(photo => photo.isNew && photo.file);
      
      let uploadedPhotos = [];
      
      // Uploader les nouvelles photos vers S3 si il y en a
      if (newPhotosWithFiles.length > 0) {
        const uploadPromises = newPhotosWithFiles.map(async (photo) => {
          try {
            const s3Url = await propertyPhotosService.uploadPhotoToS3(photo.file, propertyId);
            return {
              ...photo,
              src: s3Url,
              url: s3Url,
              isNew: false,
              file: undefined, // Nettoyer le fichier
              status: 'uploaded'
            };
          } catch (error) {
            throw new Error(`Failed to upload ${photo.fileName}: ${error.message}`);
          }
        });
        
        // Attendre que tous les uploads soient terminés
        uploadedPhotos = await Promise.all(uploadPromises);
      }
      
      // Combiner les photos existantes avec les nouvelles uploadées
      const allPhotos = [...existingPhotos, ...uploadedPhotos];
      
      // Calculer les photos supprimées (photos qui étaient dans currentPhotos mais pas dans allPhotos)
      const originalPhotos = initialData?.currentPhotos || [];
      const deletedPhotos = originalPhotos.filter(originalPhoto => 
        !allPhotos.some(currentPhoto => 
          (currentPhoto.id && currentPhoto.id === originalPhoto.id) ||
          (currentPhoto.key && currentPhoto.key === originalPhoto.key)
        )
      );
      
      // TOUJOURS faire un appel API pour mettre à jour les photos
      const result = await propertyPhotosService.updatePropertyPhotos(propertyId, allPhotos, deletedPhotos);
      
      if (result.success) {
        // Mettre à jour le cache React Query
        queryClient.setQueryData(['property', propertyId], (oldData) => ({
          ...oldData,
          photos: allPhotos
        }));
        
        // Invalider les requêtes pour forcer le refresh
        queryClient.invalidateQueries(['property', propertyId]);
        queryClient.invalidateQueries(['properties']);
        queryClient.invalidateQueries(['property-photos', propertyId]);
        
        // Appeler le callback onSave avec les nouvelles photos
        if (onSave) {
          onSave(allPhotos);
        }
        
        // Message adapté selon les actions
        let message = '';
        const deletedCount = deletedPhotos.length;
        const uploadedCount = uploadedPhotos.length;
        const totalCount = allPhotos.length;
        
        if (uploadedCount > 0 && deletedCount > 0) {
          message = `${uploadedCount} photos uploaded, ${deletedCount} photos deleted, ${totalCount} total photos`;
        } else if (uploadedCount > 0) {
          message = `${uploadedCount} photos uploaded, ${totalCount} total photos`;
        } else if (deletedCount > 0) {
          message = `${deletedCount} photos deleted, ${totalCount} remaining photos`;
        } else if (totalCount === 0) {
          message = 'All photos deleted';
        } else {
          message = `${totalCount} photos updated`;
        }
        
        showNotification(
          'Photos updated successfully',
          message,
          'success',
          { duration: 3000, autoHide: true }
        );
      } else {
        showNotification(
          'Error saving photos',
          result.error,
          'error',
          { duration: 5000, autoHide: true }
        );
      }
    } catch (error) {
      showNotification(
        'Error saving photos',
        error.message,
        'error',
        { duration: 5000, autoHide: true }
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </MDBox>
    );
  }

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
          Manage Property Photos
        </MDTypography>
      </MDBox>

      {/* Instructions */}
      <MDBox mb={3}>
        <Alert severity="info">
          Upload new photos or delete existing ones. All changes are saved automatically to S3.
        </Alert>
      </MDBox>

      {/* Photo Upload Manager */}
      <PhotoUploadManager 
        onPhotosChange={handlePhotosChange}
        propertyId={propertyId}
        currentPhotos={photos}
      />

      {/* Action Buttons */}
      <MDBox display="flex" justifyContent="flex-end" gap={2}>
        <MDButton
          variant="outlined"
          color="secondary"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </MDButton>
        <MDButton
          variant="contained"
          color="customBlue"
          onClick={handleSavePhotos}
          disabled={isSaving}
          startIcon={isSaving ? <CircularProgress size={16} /> : <Add />}
        >
          {isSaving ? 'Saving...' : `Save Changes (${photos.length} photos)`}
        </MDButton>
      </MDBox>
    </MDBox>
  );
};

export default PropertyPhotosForm;
 