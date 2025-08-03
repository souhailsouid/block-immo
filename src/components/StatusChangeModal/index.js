import React, { useState } from 'react';
import PropTypes from 'prop-types';

// @mui material components
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// Context
import { useNotification } from 'context/NotificationContext';

// Services
import { updatePropertyStatus } from 'services/api/modules/properties/propertyService';

// Constants
import { PROPERTY_STATUSES } from 'constants/propertyConstants';

const StatusChangeModal = ({ 
  open, 
  onClose, 
  property, 
  onStatusChanged 
}) => {
  const { showNotification } = useNotification();
  const [newStatus, setNewStatus] = useState(property?.status || 'IN_PROGRESS');
  const [loading, setLoading] = useState(false);

  // Fonction pour normaliser les anciens statuts vers les nouveaux
  const normalizeStatus = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'COMMERCIALIZED';
      case 'DRAFT':
        return 'IN_PROGRESS';
      default:
        return status;
    }
  };

  // Mettre à jour le statut quand la propriété change
  React.useEffect(() => {
    if (property?.status) {
      setNewStatus(normalizeStatus(property.status));
    }
  }, [property]);

  const handleStatusChange = async () => {
    if (!property || newStatus === property.status) {
      onClose();
      return;
    }

    try {
      setLoading(true);
      showNotification('info', 'Updating property status...');

      await updatePropertyStatus(property.propertyId, newStatus);
      
      showNotification('success', `Property status updated to ${newStatus}`);
      onStatusChanged(property.propertyId, newStatus);
      onClose();
      
    } catch (error) {
      console.error('❌ Erreur lors du changement de statut:', error);
      showNotification('error', 'Error updating property status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case PROPERTY_STATUSES.IN_PROGRESS:
      case 'IN_PROGRESS':
        return 'In Progress';
      case PROPERTY_STATUSES.COMMERCIALIZED:
      case 'COMMERCIALIZED':
      case 'ACTIVE': // Ancien statut
        return 'Commercialized';
      case PROPERTY_STATUSES.FUNDED:
      case 'FUNDED':
        return 'Funded';
      case 'DRAFT': // Ancien statut
        return 'In Progress';
      default:
        return status;
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case PROPERTY_STATUSES.IN_PROGRESS:
      case 'IN_PROGRESS':
      case 'DRAFT':
        return 'Property is being created or edited';
      case PROPERTY_STATUSES.COMMERCIALIZED:
      case 'COMMERCIALIZED':
      case 'ACTIVE':
        return 'Property is available in the marketplace';
      case PROPERTY_STATUSES.FUNDED:
      case 'FUNDED':
        return 'Property has been fully funded';
      default:
        return '';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case PROPERTY_STATUSES.IN_PROGRESS:
      case 'IN_PROGRESS':
      case 'DRAFT':
        return 'warning';
      case PROPERTY_STATUSES.COMMERCIALIZED:
      case 'COMMERCIALIZED':
      case 'ACTIVE':
        return 'info';
      case PROPERTY_STATUSES.FUNDED:
      case 'FUNDED':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <MDTypography variant="h6" fontWeight="bold">
          Change Property Status
        </MDTypography>
      </DialogTitle>
      
      <DialogContent>
        <MDBox mb={3}>
          <MDTypography variant="body2" color="textSecondary" mb={2}>
            Property: <strong>{property?.title}</strong>
          </MDTypography>
          <MDTypography variant="body2" color="textSecondary">
            Current Status: <strong>{getStatusLabel(property?.status)}</strong>
          </MDTypography>
        </MDBox>

        <FormControl fullWidth>
          <InputLabel>New Status</InputLabel>
          <Select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            label="New Status"
          >
            <MenuItem value={PROPERTY_STATUSES.IN_PROGRESS}>
              <MDBox display="flex" alignItems="center" gap={1}>
                <MDTypography variant="body2" color="warning.main">
                  ●
                </MDTypography>
                In Progress
              </MDBox>
            </MenuItem>
            <MenuItem value={PROPERTY_STATUSES.COMMERCIALIZED}>
              <MDBox display="flex" alignItems="center" gap={1}>
                <MDTypography variant="body2" color="info.main">
                  ●
                </MDTypography>
                Commercialized
              </MDBox>
            </MenuItem>
            <MenuItem value={PROPERTY_STATUSES.FUNDED}>
              <MDBox display="flex" alignItems="center" gap={1}>
                <MDTypography variant="body2" color="success.main">
                  ●
                </MDTypography>
                Funded
              </MDBox>
            </MenuItem>
          </Select>
        </FormControl>

        <MDBox mt={2}>
          <MDTypography variant="body2" color="textSecondary">
            {getStatusDescription(newStatus)}
          </MDTypography>
        </MDBox>
      </DialogContent>

      <DialogActions>
        <MDButton 
          variant="outlined" 
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </MDButton>
        <MDButton 
          variant="contained" 
          color="primary"
          onClick={handleStatusChange}
          disabled={loading || newStatus === property?.status}
        >
          {loading ? 'Updating...' : 'Update Status'}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

StatusChangeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  property: PropTypes.object,
  onStatusChanged: PropTypes.func.isRequired
};

export default StatusChangeModal; 