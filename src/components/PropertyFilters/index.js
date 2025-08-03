import { useState } from 'react';
import PropTypes from 'prop-types';

// @mui material components
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// @mui icons
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const PropertyFilters = ({ onFilter, onClear, loading = false }) => {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    status: '',
    minBedrooms: '',
    maxBedrooms: '',
  });

  const propertyTypes = [
    { value: '', label: 'Tous les types' },
    { value: 'apartment', label: 'Appartement' },
    { value: 'house', label: 'Maison' },
    { value: 'villa', label: 'Villa' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'loft', label: 'Loft' },
    { value: 'commercial', label: 'Commercial' },
  ];

  const statuses = [
    { value: '', label: 'Tous les statuts' },
    { value: 'available', label: 'Disponible' },
    { value: 'sold', label: 'Vendu' },
    { value: 'reserved', label: 'Réservé' },
    { value: 'under_construction', label: 'En construction' },
  ];

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    // Nettoyer les filtres vides
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );
    
    onFilter(cleanFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      city: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      status: '',
      minBedrooms: '',
      maxBedrooms: '',
    });
    onClear();
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <Card sx={{ mb: 3, p: 2 }}>
      <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <MDBox display="flex" alignItems="center">
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{ mr: 1 }}
          >
            <FilterListIcon />
          </IconButton>
          <MDTypography variant="h6" fontWeight="medium">
            Filtres
          </MDTypography>
          {hasActiveFilters && (
            <MDBox ml={2}>
              <MDTypography variant="caption" color="primary" fontWeight="medium">
                Filtres actifs
              </MDTypography>
            </MDBox>
          )}
        </MDBox>
        
        <MDBox display="flex" gap={1}>
          {hasActiveFilters && (
            <MDButton
              variant="outlined"
              color="error"
              size="small"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
              disabled={loading}
            >
              Effacer
            </MDButton>
          )}
          <MDButton
            variant="contained"
            color="primary"
            size="small"
            startIcon={<SearchIcon />}
            onClick={handleApplyFilters}
            disabled={loading}
          >
            Rechercher
          </MDButton>
        </MDBox>
      </MDBox>

      <Collapse in={expanded}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Ville"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              placeholder="Ex: Paris, London..."
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Type de propriété"
              value={filters.propertyType}
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
              size="small"
            >
              {propertyTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Statut"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              size="small"
            >
              {statuses.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Prix minimum (€)"
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              placeholder="0"
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Prix maximum (€)"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              placeholder="1000000"
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Chambres minimum"
              type="number"
              value={filters.minBedrooms}
              onChange={(e) => handleFilterChange('minBedrooms', e.target.value)}
              placeholder="1"
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Chambres maximum"
              type="number"
              value={filters.maxBedrooms}
              onChange={(e) => handleFilterChange('maxBedrooms', e.target.value)}
              placeholder="5"
              size="small"
            />
          </Grid>
        </Grid>
      </Collapse>
    </Card>
  );
};

PropertyFilters.propTypes = {
  onFilter: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default PropertyFilters; 