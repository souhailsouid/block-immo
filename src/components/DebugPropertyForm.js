import React from 'react';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { Card, Chip } from '@mui/material';

const DebugPropertyForm = ({ formData, completedSteps, currentPropertyId }) => {
  return (
    <Card sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5' }}>
      <MDTypography variant="h6" color="dark" mb={2}>
        🔍 Debug - Données du formulaire
      </MDTypography>
      
      <MDBox display="flex" gap={2} mb={2}>
        <Chip 
          label={`Étapes complétées: ${completedSteps.size}/8`} 
          color="primary" 
        />
        <Chip 
          label={`Propriété ID: ${currentPropertyId || 'Aucune'}`} 
          color={currentPropertyId ? "success" : "warning"} 
        />
      </MDBox>
      
      <MDBox>
        <MDTypography variant="button" color="dark" mb={1}>
          Données sauvegardées:
        </MDTypography>
        <pre style={{ 
          fontSize: '12px', 
          backgroundColor: '#fff', 
          padding: '8px', 
          borderRadius: '4px',
          maxHeight: '200px',
          overflow: 'auto'
        }}>
          {JSON.stringify(formData, null, 2)}
        </pre>
      </MDBox>
    </Card>
  );
};

export default DebugPropertyForm; 