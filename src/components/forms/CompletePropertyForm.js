import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import PropTypes from 'prop-types';
import MDBox from 'components/MDBox';
import { Grid, Card, Typography, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore, Save, CheckCircle } from '@mui/icons-material';
import FormField from 'layouts/pages/users/new-user/components/FormField';
import FormFieldSelect from 'components/FormFieldSelect';
import MDButton from 'components/MDButton';
import { propertyDetailsValidation } from 'validations';
import {
  PROPERTY_TYPE_OPTIONS,
  PROPERTY_STATUS_OPTIONS,
  ENERGY_CLASS_OPTIONS,
} from '../../constants/propertyConstants';
import { DEFAULT_VALUES_PROPERTY_DETAILS } from 'utils/formInitialValues';
import { mergeInitialValues } from 'utils/formUtils';

const CompletePropertyForm = ({ 
  initialData = {}, 
  onSave,
  onCancel,
  isSubmitting = false
}) => {
  const [expandedSection, setExpandedSection] = useState('basic');
  const [savedSections, setSavedSections] = useState(new Set());

  // Fusionner les données initiales avec les valeurs par défaut
  const initialValues = mergeInitialValues(initialData, DEFAULT_VALUES_PROPERTY_DETAILS);
console.log('CompletePropertyForm', initialValues)
    const handleSubmit = (values, { setSubmitting, setErrors }) => {
      console.log('handleSubmit', values)
    onSave(values);
  };

    const handleSectionSave = (sectionName, values) => {
        console.log('handleSectionSave', sectionName, values)
      onSave(values);
    setSavedSections(prev => new Set([...prev, sectionName]));
    // Ici on pourrait sauvegarder partiellement si nécessaire
  };

  const sections = [
    {
      key: 'basic',
      title: 'Basic Information',
      description: 'Property title, type, and basic details',
      fields: [
        { name: 'title', label: 'Property Title', type: 'text', placeholder: 'Ex: Modern apartment in Paris', required: true },
        { name: 'propertyType', label: 'Property Type', type: 'select', options: PROPERTY_TYPE_OPTIONS, required: true },
        { name: 'status', label: 'Status', type: 'select', options: PROPERTY_STATUS_OPTIONS, required: true },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe your property...', multiline: true, rows: 4 }
      ]
    },
    {
      key: 'details',
      title: 'Property Details',
      description: 'Size, rooms, and specifications',
      fields: [
        { name: 'surface', label: 'Surface (sq ft)', type: 'number', placeholder: 'Ex: 120', required: true },
        { name: 'bedrooms', label: 'Number of Bedrooms', type: 'number', placeholder: 'Ex: 3', required: true },
        { name: 'bathrooms', label: 'Number of Bathrooms', type: 'number', placeholder: 'Ex: 2' },
        { name: 'yearBuilt', label: 'Year Built', type: 'number', placeholder: 'Ex: 2020' },
        { name: 'energyClass', label: 'Energy Class', type: 'select', options: ENERGY_CLASS_OPTIONS }
      ]
    },
    {
      key: 'location',
      title: 'Location',
      description: 'Address and location details',
      fields: [
        { name: 'address', label: 'Address', type: 'text', placeholder: 'Ex: 123 Main Street', required: true },
        { name: 'city', label: 'City', type: 'text', placeholder: 'Ex: Paris', required: true },
        { name: 'country', label: 'Country', type: 'text', placeholder: 'Ex: France', required: true },
        { name: 'postalCode', label: 'Postal Code', type: 'text', placeholder: 'Ex: 75001' },
        { name: 'state', label: 'State/Province', type: 'text', placeholder: 'Ex: Île-de-France' },
        { name: 'locationDescription', label: 'Location Description', type: 'textarea', placeholder: 'Describe the location...', multiline: true, rows: 3 }
      ]
    },
    {
      key: 'pricing',
      title: 'Pricing & Investment',
      description: 'Price, yields, and investment metrics',
      fields: [
        { name: 'pricePerSquareFoot', label: 'Price per Square Foot', type: 'number', placeholder: 'Ex: 1200' },
        { name: 'brutYield', label: 'Brut Yield (%)', type: 'number', placeholder: 'Ex: 5.5' },
        { name: 'netYield', label: 'Net Yield (%)', type: 'number', placeholder: 'Ex: 4.2' }
      ]
    }
  ];

  const renderField = (field, values, setFieldValue) => {
    const commonProps = {
      label: field.label,
      name: field.name,
      placeholder: field.placeholder,
      required: field.required
    };

    if (field.type === 'select') {
      return (
        <FormFieldSelect
          {...commonProps}
          options={field.options}
        />
      );
    } else if (field.type === 'textarea') {
      return (
        <FormField
          {...commonProps}
          type="textarea"
          multiline={field.multiline}
          rows={field.rows}
        />
      );
    } else {
      return (
        <FormField
          {...commonProps}
          type={field.type}
        />
      );
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <MDBox mb={3}>
        <Typography variant="h5" color="dark" gutterBottom>
          Add New Property
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Fill in all the details to create your property listing
        </Typography>
      </MDBox>

      <Formik
        initialValues={initialValues}
        validationSchema={propertyDetailsValidation}
        enableReinitialize={true}
      >
              {({ isSubmitting, handleSubmit, values, errors, setFieldValue }) => {
                  return (
                      <Form onSubmit={handleSubmit}>
                          {sections.map((section, index) => (
                              <Accordion
                                  key={section.key}
                                  expanded={expandedSection === section.key}
                                  onChange={(e, isExpanded) => setExpandedSection(isExpanded ? section.key : false)}
                                  sx={{ mb: 2 }}
                              >
                                  <AccordionSummary expandIcon={<ExpandMore />}>
                                      <MDBox display="flex" alignItems="center" justifyContent="space-between" width="100%">
                                          <MDBox>
                                              <Typography variant="h6" color="dark">
                                                  {section.title}
                                              </Typography>
                                              <Typography variant="body2" color="textSecondary">
                                                  {section.description}
                                              </Typography>
                                          </MDBox>
                                          {savedSections.has(section.key) && (
                                              <CheckCircle color="success" sx={{ mr: 2 }} />
                                          )}
                                      </MDBox>
                                  </AccordionSummary>
                
                                  <AccordionDetails>
                                      <Grid container spacing={3}>
                                          {section.fields.map((field) => (
                                              <Grid item xs={12} md={field.name === 'description' || field.name === 'locationDescription' ? 12 : 6} key={field.name}>
                                                  {renderField(field, values, setFieldValue)}
                                              </Grid>
                                          ))}
                                      </Grid>
                  
                                    
                                  </AccordionDetails>
                              </Accordion>
                          ))}

                          <Divider sx={{ my: 3 }} />

                          {/* Boutons d'action principaux */}
                          <MDBox display="flex" justifyContent="space-between" alignItems="center">
                              <MDButton
                                  variant="outlined"
                                  color="secondary"
                                  onClick={onCancel}
                                  disabled={isSubmitting}
                              >
                                  Cancel
                              </MDButton>
              
                              <MDBox display="flex" gap={2}>
                                  <MDButton
                                      variant="outlined"
                                      color="info"
                                      startIcon={<Save />}
                                      disabled={isSubmitting}
                                  >
                                      Save Draft
                                  </MDButton>
                
                                  <MDButton
                                      variant="contained"
                                      color="primary"
                                      type="submit"
                                      disabled={isSubmitting}
                                  >
                                      {isSubmitting ? 'Creating...' : 'Create Property'}
                                  </MDButton>
                              </MDBox>
                          </MDBox>

                          {/* Affichage des erreurs de validation */}
                          {errors.submit && (
                              <MDBox mt={2}>
                                  <Typography color="error" variant="body2">
                                      {errors.submit}
                                  </Typography>
                              </MDBox>
                          )}
                      </Form>
                  )
              }}
      </Formik>
    </Card>
  );
};

CompletePropertyForm.propTypes = {
  initialData: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool
};

export default CompletePropertyForm; 