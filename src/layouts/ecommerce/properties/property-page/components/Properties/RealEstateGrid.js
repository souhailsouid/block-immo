import * as React from 'react';
import { useState } from 'react';
import ImgsViewer from 'react-images-viewer';
import { Box, Grid } from '@mui/material';
import image1 from 'assets/images/products/product-details-1.jpg';
import image2 from 'assets/images/products/product-details-2.jpg';
import image3 from 'assets/images/products/product-details-3.jpg';
import image4 from 'assets/images/products/product-details-4.jpg';
import image5 from 'assets/images/products/product-details-5.jpg';


const images = [
  { src: image1, label: 'Avant' },
  { src: image2, label: 'Après' },
  { src: image3 },
  { src: image4, label: 'Détail' },
  { src: image5 },
  { src: image1, label: 'Vue' },
  { src: image3 },
];

// Group by 3
const groupByThree = (array) => {
  const result = [];
  for (let i = 0; i < array.length; i += 3) {
    result.push(array.slice(i, i + 3));
  }
  return result;
};

const ImageBlock = ({ img, fullHeight = false, onClick }) => (
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
      onClick={onClick}
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
const Row1 = ({ images, reverse, onSetCurrentImage, groupStartIndex }) => {
  return (
    <Grid
      container
      item
      xs={12}
      spacing={2}
      sx={{ mb: 2 }}
      direction={reverse ? 'row-reverse' : 'row'}
    >
      {/* Colonne 1 */}
      <Grid
        item
        xs={12}
        sm={6}
        md={images[1] ? 8 : 12}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          height: { xs: 150, sm: 200, md: 500 },
        }}
      >
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <ImageBlock
            img={images[0]}
            fullHeight
            onClick={() => onSetCurrentImage(groupStartIndex + 0)}
          />
        </Box>
      </Grid>
      {/* Colonne 2 */}
      {images[1] && (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: { xs: 150, sm: 200, md: 500 },
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
            {
              <ImageBlock
                img={images[1]}
                fullHeight={!images[2]}
                onClick={() => onSetCurrentImage(groupStartIndex + 1)}
              />
            }
            {images[2] && (
              <ImageBlock img={images[2]} onClick={() => onSetCurrentImage(groupStartIndex + 2)} />
            )}
          </Box>
        </Grid>
      )}
    </Grid>
  );
}
export default function ZigZagGrid() {
  const grouped = groupByThree(images);
  const [currentImage, setCurrentImage] = useState(image1);
  const [imgsViewer, setImgsViewer] = useState(false);
  const [imgsViewerCurrent, setImgsViewerCurrent] = useState(0);

  const handleSetCurrentImage = (index) => {
    setCurrentImage(images[index]);
    setImgsViewerCurrent(index);
  };
  const handleGalleryClick = () => {
    openImgsViewer();
  };

  const openImgsViewer = () => setImgsViewer(true);
  const closeImgsViewer = () => setImgsViewer(false);
  const imgsViewerNext = () => setImgsViewerCurrent((i) => (i + 1) % images.length);
  const imgsViewerPrev = () => setImgsViewerCurrent((i) => (i - 1 + images.length) % images.length);
  return (
    <Box sx={{ flexGrow: 1, px: 2, cursor: 'pointer' }} onClick={handleGalleryClick}>
      <ImgsViewer
        position="absolute"
        imgs={images.map((image) => ({ src: image.src }))}
        isOpen={imgsViewer}
        onClose={closeImgsViewer}
        currImg={imgsViewerCurrent}
        onClickPrev={imgsViewerPrev}
        onClickNext={imgsViewerNext}
        backdropCloseable
      />
      {grouped.map((group, idx) => (
        <Row1
          images={group}
          reverse={idx % 2 === 1}
          key={idx}
          onSetCurrentImage={handleSetCurrentImage}
          groupStartIndex={idx * 3}
        />
      ))}
    </Box>
  );
}
