import PropTypes from 'prop-types';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import MDBox from 'components/MDBox';
import { Grid, Card, Typography, IconButton } from '@mui/material';
import MDButton from 'components/MDButton';
import FormField from 'layouts/pages/users/new-user/components/FormField';
import MDDatePicker from 'components/MDDatePicker';
import FormFieldSelect from 'components/FormFieldSelect';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { propertyTimelineValidation } from 'validations/propertyValidation';
import { PROPERTY_TIMELINE_STATUS_CONFIG, PROPERTY_TIMELINE_STATUS_OPTIONS } from 'constants/propertyConstants';
import { formatDateForDisplay } from 'utils/date';
import { onSubmitForm } from 'utils/validateForms';
import { mergeInitialValues } from 'utils/formUtils';
import { DEFAULT_VALUES_PROPERTY_TIMELINE } from 'utils/formInitialValues';
import { useNotification } from 'context/NotificationContext';

const PropertyTimelineForm = ({ initialData = {}, onSave, onCancel }) => {
  const { showNotification } = useNotification();

  const initialValues = mergeInitialValues(
    { timelineData: initialData.timelineData },
    DEFAULT_VALUES_PROPERTY_TIMELINE
  );

  // 🎯 Configuration spécifique pour ce formulaire
  const formConfig = {
    cleanFields: ['updatedAt', 'createdAt', 'propertyId'],
    validate: (values) => {
      // Validation spécifique pour la timeline
      if (!values.timelineData || values.timelineData.length === 0) {
        showNotification(
          'Business Validation Error',
          'At least one timeline event is required',
          'error',
          { duration: 3000, autoHide: true }
        );
        return 'At least one timeline event is required';
      }

      // Validation de chaque événement
      for (let i = 0; i < values.timelineData.length; i++) {
        const event = values.timelineData[i];
        if (!event.title || event.title.trim() === '') {
          showNotification(
            'Business Validation Error',
            `Event ${i + 1} title is required`,
            'error',
            { duration: 3000, autoHide: true }
          );
          return `Event ${i + 1} title is required`;
        }
        if (!event.description || event.description.trim() === '') {
          showNotification(
            'Business Validation Error',
            `Event ${i + 1} description is required`,
            'error',
            { duration: 3000, autoHide: true }
          );
          return `Event ${i + 1} description is required`;
        }
        if (!event.date) {
          showNotification(
            'Business Validation Error',
            `Event ${i + 1} date is required`,
            'error',
            { duration: 3000, autoHide: true }
          );
          return `Event ${i + 1} date is required`;
        }
      }
      return null;
    }
  };

  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    // Process the data before saving
    const processedData = {
      timelineData: values.timelineData.map((event, index) => {
        const config = PROPERTY_TIMELINE_STATUS_CONFIG[event.status];

        return {
          ...event,
          color: config.color,
          icon: event.icon,
          dateTime: formatDateForDisplay(event.date),
          lastItem: index === values.timelineData.length - 1, // Auto-set lastItem
        };
      }),
    };

    onSubmitForm(processedData, onSave, {
      setSubmitting,
      setErrors,
      cleanFields: formConfig.cleanFields,
      validate: formConfig.validate
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={propertyTimelineValidation}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting, handleSubmit, setFieldValue }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <MDBox mb={3}>
              <Typography variant="body2" color="textSecondary">
                Configure the timeline events for your property investment. Events will be displayed
                in chronological order.
              </Typography>
            </MDBox>

            <FieldArray name="timelineData">
              {({ push, remove }) => (
                <Grid container spacing={3}>
                  {values.timelineData.map((event, index) => {
                    const statusInfo = PROPERTY_TIMELINE_STATUS_CONFIG[event.status];
                    return (
                      <Grid item xs={12} key={index}>
                        <Card sx={{ p: 3, position: 'relative' }}>
                          <MDBox
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2}
                          >
                            <Typography variant="h6">
                              Event {index + 1}
                              {index === values.timelineData.length - 1 && (
                                <Typography
                                  component="span"
                                  variant="caption"
                                  color="textSecondary"
                                  ml={1}
                                >
                                  (Last Event)
                                </Typography>
                              )}
                            </Typography>
                            <IconButton
                              color="error"
                              onClick={() => remove(index)}
                              disabled={values.timelineData.length <= 1}
                            >
                              <DeleteIcon sx={{ color: 'white', borderRadius: '50%' }} />
                            </IconButton>
                          </MDBox>

                          <Grid container spacing={2}>
                            {/* Event Title */}
                            <Grid item xs={12} md={6}>
                              <FormField
                                label="Event Title"
                                name={`timelineData.${index}.title`}
                                placeholder="e.g., Property funding complete!"
                              />
                            </Grid>

                            {/* Event Date */}
                            <Grid item xs={12} md={6}>
                              <MDDatePicker
                                label="Event Date"
                                name={`timelineData.${index}.date`}
                                value={event.date}
                                onChange={(e) => {
                                  setFieldValue(`timelineData.${index}.date`, e.target.value);
                                }}
                              />
                            </Grid>

                            {/* Event Description */}
                            <Grid item xs={12}>
                              <FormField
                                label="Event Description"
                                name={`timelineData.${index}.description`}
                                multiline
                                rows={3}
                                placeholder="Describe what happens at this event..."
                              />
                            </Grid>

                            {/* Status and Icon */}
                            <Grid item xs={12} md={6}>
                              <FormFieldSelect
                                label="Status"
                                name={`timelineData.${index}.status`}
                                options={PROPERTY_TIMELINE_STATUS_OPTIONS}
                                onChange={(e) => {
                                  const newStatus = e.target.value;
                                  setFieldValue(`timelineData.${index}.status`, newStatus);
                                  // Auto-set default icon for the status if current icon is the old default
                                  const currentIcon = values.timelineData[index].icon;
                                  const oldStatus = event.status;
                                  const oldDefaultIcon = PROPERTY_TIMELINE_STATUS_CONFIG[oldStatus]?.defaultIcon;
                                  if (currentIcon === oldDefaultIcon) {
                                    setFieldValue(
                                      `timelineData.${index}.icon`,
                                      PROPERTY_TIMELINE_STATUS_CONFIG[newStatus]?.defaultIcon
                                    );
                                  }
                                }}
                              />
                              {statusInfo && (
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                  sx={{ mt: 0.5, display: 'block' }}
                                >
                                  {statusInfo.description}
                                </Typography>
                              )}
                            </Grid>
                          </Grid>
                        </Card>
                      </Grid>
                    );
                  })}

                  {/* Add New Event Button */}
                  <Grid item xs={12}>
                    <MDButton
                      variant="outlined"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={() =>
                        push({
                          status: 'pending',
                          icon: 'schedule',
                          title: '',
                          date: new Date(),
                          description: '',
                        })
                      }
                      fullWidth
                    >
                      Add New Timeline Event
                    </MDButton>
                  </Grid>
                </Grid>
              )}
            </FieldArray>

            {/* Submit Buttons */}
            <MDBox mt={4} display="flex" justifyContent="flex-end" gap={2}>
              <MDButton variant="outlined" color="secondary" onClick={() => onCancel(null)}>
                Cancel
              </MDButton>
              <MDButton
                variant="contained"
                color="customBlue"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Timeline'}
              </MDButton>
            </MDBox>
          </Form>
        );
      }}
    </Formik>
  );
};

PropertyTimelineForm.propTypes = {
  initialData: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PropertyTimelineForm;
