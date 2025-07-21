import { useState } from 'react';
import ImgsViewer from 'react-images-viewer';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import MDBox from 'components/MDBox';

import image1 from 'assets/images/products/product-details-1.jpg';
import image2 from 'assets/images/products/product-details-2.jpg';
import image3 from 'assets/images/products/product-details-3.jpg';
import image4 from 'assets/images/products/product-details-4.jpg';
import image5 from 'assets/images/products/product-details-5.jpg';
import Badge from '@mui/material/Badge';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
const images = [image1, image2, image3, image4, image5, image4, image3, image2, image1];

function PropertiesImages() {
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
    <>
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
        <Grid container spacing={2}>
          {/* Main Image */}
          {images[0] && (
        <Grid item xs={12} md={8}>
          <MDBox
            component="img"
            src={images[0]}
            alt="Main"
            width="100%"
            height={{ xs: 200, sm: 350, md: 400 }}
            sx={{ objectFit: 'cover', borderRadius: 2 }}
          />
        </Grid>
                  )}
                   {/* Deux images verticales à droite */}
      <Grid item xs={12} md={4}>
        <Grid container spacing={2} direction="column" sx={{ height: '100%' }}>
          {images[1] && (
            <Grid item xs={6}>
              <MDBox
                component="img"
                src={images[1]}
                alt="Side 1"
                width="100%"
                height={images[2] ? { xs: 100, md: 195 } : { xs: 200, md: 400 }}
                sx={{ objectFit: 'cover', borderRadius: 2 }}
              />
            </Grid>
          )}
          {images[2] && (
            <Grid item xs={6}>
              <MDBox
                component="img"
                src={images[2]}
                alt="Side 2"
                width="100%"
                height={{ xs: 100, md: 195 }}
                sx={{ objectFit: 'cover', borderRadius: 2, mt: 2 }}
              />
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Ligne suivante : 2 ou 3 images en grille */}
      {images.slice(3).map((img, idx) => (
        <Grid item xs={12} sm={6} md={4} key={img + idx}>
          <MDBox
            component="img"
            src={img}
            alt={`Gallery ${idx + 4}`}
            width="100%"
            height={{ xs: 150, md: 200 }}
            sx={{ objectFit: 'cover', borderRadius: 2, mt: 2 }}
          />
        </Grid>
      ))}
    
          {/* Thumbnails */}
          <Grid item xs={12} md={6}>
            <Grid container rowSpacing={1} columnSpacing={2} sx={{ height: { md: 400 } }}>
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
           
          </Grid>
        </Grid>
      </MDBox>
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
          <Grid item xs={12} md={8}>
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
            <Grid container rowSpacing={1} columnSpacing={2} sx={{ height: { md: 400 } }}>
              {images.slice(4, 8).map((img, idx) => (
                <Grid item xs={3} key={img}>
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
          </Grid>
        </Grid>
      </MDBox>
    </>
  );
}

export default PropertiesImages;
