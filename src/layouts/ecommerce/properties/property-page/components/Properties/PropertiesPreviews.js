import { Box, Grid, Icon, Tooltip, Skeleton } from '@mui/material';
import { useState, useEffect } from 'react';
import MDBox from 'components/MDBox';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { propertyPhotosService } from 'services/api/modules/properties/propertyPhotosService';

import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { PropertyEditButtons } from 'components/RoleBasedActionButtons';
// Modal context
import { useModal } from 'context/ModalContext';

// Skeleton pour les images en cours de chargement
const ImageSkeleton = ({ fullHeight = false }) => (
  <Box
    sx={{
      width: '100%',
      height: fullHeight ? '100%' : '50%',
      borderRadius: 2,
      overflow: 'hidden',
    }}
  >
    <Skeleton
      variant="rectangular"
      width="100%"
      height="100%"
      sx={{
        borderRadius: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        '&::after': {
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
        }
      }}
    />
  </Box>
);

// Skeleton pour le compteur de photos
const ThumbnailsSkeleton = () => (
  <MDBox
    position="absolute"
    bottom={16}
    right={16}
    zIndex={10}
    sx={{
      background: 'rgba(255,255,255,0.85)',
      borderRadius: 2,
      px: 2,
      py: 1,
      display: 'flex',
      alignItems: 'center',
      boxShadow: 2,
    }}
  >
    <Skeleton variant="circular" width={20} height={20} sx={{ mr: 1 }} />
    <Skeleton variant="text" width={60} height={16} />
  </MDBox>
);

const Thumbnails = ({ images }) => {
  return (
    <MDBox
      position="absolute"
      bottom={16}
      right={16}
      zIndex={10}
      sx={{
        background: 'rgba(255,255,255,0.85)',
        borderRadius: 2,
        px: 2,
        py: 1,
        display: 'flex',
        alignItems: 'center',
        boxShadow: 2,
        fontWeight: 'bold',
      }}
    >
      <PhotoLibraryIcon sx={{ mr: 1, color: '#4472c4' }} />
      {images.length} photos
    </MDBox>
  );
};

const ImageBlock = ({ img, fullHeight = false }) => (
  <Box
    sx={{
      width: '100%',
      height: fullHeight ? '100%' : '50%',
      borderRadius: 2,
      overflow: 'hidden',
    }}
  >
    <Box
      component="img"
      src={img.src}
      alt={img.label || 'Image'}
      sx={{
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
  </Box>
);

export default function PropertiesPreviews({ reverse, propertyId }) {
  const navigate = useNavigate();
  const { openModal } = useModal();
  
  // 📸 State pour les photos
  const [images, setImages] = useState([]);

  // 🔄 Charger les photos depuis l'API
  const { data: photosData, isLoading, refetch } = useQuery({
    queryKey: ['property-photos', propertyId],
    queryFn: () => propertyPhotosService.getPropertyPhotos(propertyId),
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mettre à jour les images quand les données changent
  useEffect(() => {
    if (photosData?.success && photosData.photos && photosData.photos.length > 0) {
      // Convertir les photos de l'API au format attendu
      const apiPhotos = photosData.photos.map(photo => ({
        src: photo.url || photo.src,
        label: photo.label || photo.fileName || 'Property photo',
        key: photo.key || photo.id
      }));
      setImages(apiPhotos);
    } else {
      // Pas d'images à afficher (les skeletons seront utilisés pendant le chargement)
      setImages([]);
    }
  }, [photosData]);

  // Fonction pour ouvrir la modal d'édition des photos
  const handleEditPhotos = (e) => {
    e.stopPropagation(); // Empêche la navigation vers la page images
    
    // Ouvrir la modal avec les photos actuelles
    openModal('property-images', { 
      propertyId: propertyId,
      currentPhotos: images, 
      onSave: (updatedPhotos) => {
        // Mettre à jour les photos localement
        if (updatedPhotos && Array.isArray(updatedPhotos)) {
          setImages(updatedPhotos);
        }
        // Recharger les photos depuis l'API
        refetch();
      } 
    });
  };

  return (
    <Box
      sx={{ flexGrow: 1, px: 2, cursor: 'pointer', position: 'relative' }}
      onClick={() => navigate(`/properties/${propertyId}/images`)}
    >
      {/* Action Button */}
      <MDBox
        sx={{
          position: 'absolute',
          top: { xs: 8, sm: 12, md: 16 },
          right: { xs: 8, sm: 12, md: 16 },
          zIndex: 20,
        }}
        onClick={handleEditPhotos}
      >
        <PropertyEditButtons>
          <Tooltip title="Edit Property Images" placement="bottom">
            <MDBox
              sx={{
                width: { xs: 32, sm: 36, md: 40 },
                height: { xs: 32, sm: 36, md: 40 },
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 1)',
                  transform: 'scale(1.1)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                },
              }}
            >
              <Icon sx={{ color: '#4472c4', fontSize: { xs: 18, sm: 20, md: 22 } }}>
                edit
              </Icon>
            </MDBox>
          </Tooltip>
        </PropertyEditButtons>
      </MDBox>
      
      <Grid
        container
        item
        xs={12}
        spacing={2}
        sx={{ mb: 2 }}
        direction={reverse ? 'row-reverse' : 'row'}
        position="relative"
      >
        {/* Afficher les skeletons pendant le chargement ou si pas d'images */}
        {(isLoading || images.length === 0) ? (
          <>
            {/* Colonne 1 - Skeleton principal */}
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                height: { xs: 150, sm: 200, md: 400 },
              }}
            >
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <ImageSkeleton fullHeight />
              </Box>
            </Grid>
            
            {/* Colonne 2 - Skeletons secondaires */}
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: { xs: 150, sm: 200, md: 400 },
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  justifyContent: 'space-between',
                  flexWrap: 'nowrap',
                }}
              >
                <ImageSkeleton fullHeight />
                <ImageSkeleton />
              </Box>
            </Grid>
            
            {/* Colonne 3 - Skeletons supplémentaires */}
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: { xs: 150, sm: 200, md: 400 },
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  justifyContent: 'space-between',
                  flexWrap: 'nowrap',
                }}
              >
                <ImageSkeleton fullHeight />
                <ImageSkeleton />
              </Box>
              <ThumbnailsSkeleton />
            </Grid>
          </>
        ) : (
          <>
            {/* Colonne 1 - Photo principale adaptative */}
            <Grid
              item
              xs={12}
              sm={6}
              md={
                images.length === 1 ? 12 : // 1 photo : pleine largeur
                images.length === 2 ? 8 :  // 2 photos : 2/3 largeur
                images.length === 3 ? 9 :  // 3 photos : 1/2 largeur
                6 // 4+ photos : 1/2 largeur
              }
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                height: { xs: 150, sm: 200, md: 400 },
              }}
            >
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <ImageBlock img={images[0]} fullHeight />
              </Box>
            </Grid>
            {/* Colonne 2 - Photos 1 et 2 (si il y a plus d'une photo) */}
            {images.length > 1 && (
              <Grid
                item
                xs={12}
                sm={6}
                md={
                  images.length === 2 ? 4 : // 2 photos : 1/3 largeur
                  images.length === 3 ? 3 : // 3 photos : 1/4 largeur
                  3 // 4+ photos : 1/4 largeur
                }
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: { xs: 150, sm: 200, md: 400 },
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    justifyContent: 'space-between',
                    flexWrap: 'nowrap',
                  }}
                >
                  <ImageBlock img={images[1]} fullHeight={!images[2]} />
                  {images[2] && <ImageBlock img={images[2]} />}
                </Box>
              </Grid>
            )}
            {/* Colonne 3 - Photos 3 et 4 */}
            {images[3] && (
              <Grid
                item
                xs={12}
                sm={6}
                md={
                  images.length === 3 ? 3 : // 3 photos : 1/4 largeur
                  3 // 4+ photos : 1/4 largeur
                }
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: { xs: 150, sm: 200, md: 400 },
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    justifyContent: 'space-between',
                    flexWrap: 'nowrap',
                  }}
                >
                  <ImageBlock img={images[3]} fullHeight={!images[4]} />
                  {images[4] && <ImageBlock img={images[4]} />}
                </Box>
                {images.length > 3 && <Thumbnails images={images} />}
              </Grid>
            )}
          </>
        )}
      </Grid>
    </Box>
  );
}

