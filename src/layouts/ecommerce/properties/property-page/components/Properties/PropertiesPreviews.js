import { Box, Grid, Icon, Tooltip } from '@mui/material';
import MDBox from 'components/MDBox';
import image1 from 'assets/images/products/product-details-1.jpg';
import image2 from 'assets/images/products/product-details-2.jpg';
import image3 from 'assets/images/products/product-details-3.jpg';
import image4 from 'assets/images/products/product-details-4.jpg';
import image5 from 'assets/images/products/product-details-5.jpg';
import { useNavigate } from 'react-router-dom';

import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

// Modal context
import { useModal } from 'context/ModalContext';

const images = [
  { src: image1, label: 'Avant' },
  { src: image2, label: 'Après' },
  { src: image3 },
  { src: image4, label: 'Détail' },
  { src: image5 },
  { src: image1, label: 'Vue' },
  { src: image3 },
];

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
        onClick={(e) => {
          e.stopPropagation(); // Empêche la navigation vers la page images
          openModal('property-images', { propertyId, images });
        }}
      >
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
      {/* Colonne 1 */}
      <Grid
        item
        xs={12}
        sm={6}
        md={images[1] ? 6 : 12}
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
      {/* Colonne 2 */}
      {images[1] && (
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
            {<ImageBlock img={images[1]} fullHeight={!images[2]} />}
            {images[2] && <ImageBlock img={images[2]} />}
          </Box>
        </Grid>
      )}
      {/* colonne 3 */}
      {images[1] && (
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
            {<ImageBlock img={images[1]} fullHeight={!images[2]} />}
            {images[2] && <ImageBlock img={images[2]} />}
          </Box>
          <Thumbnails images={images} />
        </Grid>
      )}
      </Grid>
    </Box>
  );
}

