import { useState } from 'react';
import ImgsViewer from 'react-images-viewer';
import Grid from '@mui/material/Grid';
import MDBox from 'components/MDBox';

import image1 from 'assets/images/products/product-details-1.jpg';
import image2 from 'assets/images/products/product-details-2.jpg';
import image3 from 'assets/images/products/product-details-3.jpg';
import image4 from 'assets/images/products/product-details-4.jpg';
import image5 from 'assets/images/products/product-details-5.jpg';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

const images = [image1, image2, image3, image4, image5];

const ProductImages = () => {
  const [currentImage, setCurrentImage] = useState(image1);
  const [imgsViewer, setImgsViewer] = useState(false);
  const [imgsViewerCurrent, setImgsViewerCurrent] = useState(0);

  const handleSetCurrentImage = (index) => {
    setCurrentImage(images[index]);
    setImgsViewerCurrent(index);
  };

  const openImgsViewer = () => setImgsViewer(true);
  const closeImgsViewer = () => setImgsViewer(false);
  const imgsViewerNext = () => setImgsViewerCurrent((i) => (i + 1) % images.length);
  const imgsViewerPrev = () => setImgsViewerCurrent((i) => (i - 1 + images.length) % images.length);

  return (
    <MDBox width="100%" position="relative" onClick={openImgsViewer}>
      <ImgsViewer
        position="absolute"
        imgs={images.map((src) => ({ src }))}
        isOpen={imgsViewer}
        onClose={closeImgsViewer}
        currImg={imgsViewerCurrent}
        onClickPrev={imgsViewerPrev}
        onClickNext={imgsViewerNext}
        backdropCloseable
      />
      <Grid container spacing={1}>
        {/* Main Image */}
        <Grid item xs={12} md={6}>
          <MDBox
            component="img"
            src={currentImage}
            alt="Product"
            borderRadius="lg"
            shadow="lg"
            width="100%"
            height={{ xs: '250px', sm: '350px', md: '400px' }}
            sx={{
              objectFit: 'cover',
              cursor: 'pointer',
              transition: 'box-shadow 0.3s',
              ':hover': { boxShadow: 6 },
            }}
            onClick={openImgsViewer}
          />
        </Grid>
        {/* Thumbnails */}
        <Grid item xs={12} md={6}>
          <Grid container rowSpacing={1} columnSpacing={2} sx={{ height: { md: 400, } }}>
            {images.slice(0, 4).map((img, idx) => (
              <Grid item xs={6} key={img}>
                <MDBox
                  component="img"
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  borderRadius="md"
                  shadow={currentImage === img ? 'lg' : 'md'}
                  width="100%"
                  height={{ xs: 80, sm: 120, md: 190 }}
                  sx={{
                    objectFit: 'cover',
                    cursor: 'pointer',
                    // border: currentImage === img ? '2px solid #4472c4' : '2px solid transparent',
                    transition: 'border 0.2s',
                  }}
                  onClick={() => handleSetCurrentImage(idx)}
                />
              </Grid>
            ))}
          </Grid>
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
        </Grid>
      </Grid>
    </MDBox>
  );
}

export default ProductImages;
