import  { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY } from 'config/googleMaps';
import { Box, Typography } from '@mui/material';

const PropertyLocationMap = ({ lat = 48.838624, lng = 2.559066 }) => {
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleMapLoad = () => {
    setIsLoading(false);
    setMapError(false);
  };

  const handleMapError = () => {
    setIsLoading(false);
    setMapError(true);
  };

  // Fallback component when map fails to load
  const MapFallback = () => (
    <Box
      sx={{
        width: '100%',
        height: '300px',
        borderRadius: 12,
        backgroundColor: 'grey.100',
        border: '1px solid grey.300',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Typography variant="h4" color="grey.500" sx={{ mb: 1 }}>
        🗺️
      </Typography>
      <Typography variant="body2" color="grey.600" textAlign="center" sx={{ mb: 1 }}>
        Map could not be loaded
      </Typography>
      <Typography variant="caption" color="grey.500" textAlign="center">
        Coordinates: {lat.toFixed(6)}, {lng.toFixed(6)}
      </Typography>
    </Box>
  );

  // Loading component
  const MapLoading = () => (
    <Box
      sx={{
        width: '100%',
        height: '300px',
        borderRadius: 12,
        backgroundColor: 'grey.100',
        border: '1px solid grey.300',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="body2" color="grey.600">
        Loading map...
      </Typography>
    </Box>
  );

  if (mapError) {
    return <MapFallback />;
  }

  return (
    <LoadScript 
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      onLoad={handleMapLoad}
      onError={handleMapError}
    >
      {isLoading && <MapLoading />}
      <GoogleMap
        mapContainerStyle={{ 
          width: '100%', 
          height: '300px', 
          borderRadius: 12,
          display: isLoading ? 'none' : 'block'
        }}
        center={{ lat, lng }}
        zoom={14}
        onLoad={handleMapLoad}
        onError={handleMapError}
      >
        <Marker position={{ lat, lng }} />
      </GoogleMap>
    </LoadScript>
  );
};

export default PropertyLocationMap;
