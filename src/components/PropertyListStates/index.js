import PropTypes from 'prop-types';

// @mui material components
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// @mui icons
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const PropertyListStates = ({ 
  loading, 
  error, 
  isEmpty, 
  onRetry, 
  onRefresh,
  children 
}) => {
  // État de chargement
  if (loading) {
    return (
      <MDBox
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py={8}
        px={3}
      >
        <CircularProgress size={60} thickness={4} color="customBlue" />
        <MDTypography variant="h6" color="text.secondary" mt={3}>
          Loading properties...
        </MDTypography>
        <MDTypography variant="body2" color="text.secondary" mt={1}>
          Please wait while we retrieve the latest properties
        </MDTypography>
      </MDBox>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <MDBox
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py={8}
        px={3}
      >
        <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        <MDTypography variant="h5" color="error" mb={2}>
          Loading error
        </MDTypography>
        <MDTypography variant="body1" color="text.secondary" textAlign="center" mb={3}>
          {error}
        </MDTypography>
        <Box display="flex" gap={2}>
          {onRetry && (
            <Button
              variant="contained"
              color="customBlue"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
            >
              Retry
            </Button>
          )}
          {onRefresh && (
            <Button
              variant="outlined"
              color="customBlue"
              startIcon={<RefreshIcon />}
              onClick={onRefresh}
            >
              Refresh
            </Button>
          )}
        </Box>
      </MDBox>
    );
  }

  // État vide
  if (isEmpty) {
    return (
      <MDBox
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py={8}
        px={3}
      >
        <SearchOffIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <MDTypography variant="h5" color="text.secondary" mb={2}>
          No property found
        </MDTypography>
        <MDTypography variant="body1" color="text.secondary" textAlign="center" mb={3}>
          No property found matching your search criteria.
          <br />
          Please try modifying your filters or come back later.
        </MDTypography>
        {onRefresh && (
          <Button
            variant="contained"
            color="customBlue"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
          >
            Refresh
          </Button>
        )}
      </MDBox>
    );
  }

  // Contenu normal
  return children;
};

PropertyListStates.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.string,
  isEmpty: PropTypes.bool,
  onRetry: PropTypes.func,
  onRefresh: PropTypes.func,
  children: PropTypes.node,
};

export default PropertyListStates; 