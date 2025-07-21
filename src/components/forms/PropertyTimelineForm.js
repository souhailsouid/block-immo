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

const validationSchema = Yup.object().shape({
  timelineData: Yup.array()
    .of(
      Yup.object().shape({
        status: Yup.string()
          .oneOf(['completed', 'pending', 'projected'])
          .required('Status is required'),
        icon: Yup.string().required('Icon is required'),
        title: Yup.string().required('Event title is required'),
        date: Yup.date().required('Event date is required'),
        description: Yup.string().required('Event description is required'),
        badges: Yup.array().of(Yup.string()),
      })
    )
    .min(1, 'At least one timeline event is required'),
});

// Mapping status to color and icon
const statusConfig = {
  completed: {
    color: 'success',
    defaultIcon: 'check',
    label: 'Completed',
    description: 'Event has been completed successfully',
  },
  pending: {
    color: 'info',
    defaultIcon: 'schedule',
    label: 'Pending',
    description: 'Event is currently in progress or waiting',
  },
  projected: {
    color: 'secondary',
    defaultIcon: 'event',
    label: 'Projected',
    description: 'Event is planned for the future',
  },
};

// Helper function to format date for display
const formatDateForDisplay = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return d.toLocaleDateString('en-US', options);
};

const PropertyTimelineForm = ({ initialData = {}, onSave, hideButtons = false }) => {
  const defaultTimelineData = [
    {
      status: 'completed',
      icon: 'check',
      title: 'Property funding complete!',
      date: new Date('2025-07-10'),
      description: 'The property has been fully funded by investors.',
      badges: ['check'],
    },
    {
      status: 'pending',
      icon: 'vpn_key',
      title: 'Share certificates issued',
      date: new Date('2025-07-25'),
      description:
        'Your Property Share Certificates will be issued 2 weeks after the property is funded.',
      badges: ['check'],
    },
    {
      status: 'projected',
      icon: 'payments',
      title: 'First rental payment',
      date: new Date('2025-09-30'),
      description:
        'We project that the first rental payment will be paid by 31 August 2025, with a guaranteed payment date no later than 30 September 2025.',
      badges: ['check'],
    },
  ];

  const initialValues = {
    timelineData: initialData.timelineData || defaultTimelineData,
  };

  const statusOptions = [
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'projected', label: 'Projected' },
  ];

  const handleSubmit = (values, { setSubmitting }) => {
    // Process the data before saving
    const processedData = {
      timelineData: values.timelineData.map((event, index) => {
        const config = statusConfig[event.status];

        return {
          ...event,
          color: config.color,
          icon: event.icon,
          dateTime: formatDateForDisplay(event.date),
          lastItem: index === values.timelineData.length - 1, // Auto-set lastItem
        };
      }),
    };

    onSave(processedData);
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
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
                    const statusInfo = statusConfig[event.status];
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
                                options={statusOptions}
                                onChange={(e) => {
                                  const newStatus = e.target.value;
                                  setFieldValue(`timelineData.${index}.status`, newStatus);
                                  // Auto-set default icon for the status if current icon is the old default
                                  const currentIcon = values.timelineData[index].icon;
                                  const oldStatus = event.status;
                                  const oldDefaultIcon = statusConfig[oldStatus]?.defaultIcon;
                                  if (currentIcon === oldDefaultIcon) {
                                    setFieldValue(
                                      `timelineData.${index}.icon`,
                                      statusConfig[newStatus]?.defaultIcon
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
            {!hideButtons && (
              <MDBox mt={4} display="flex" justifyContent="flex-end" gap={2}>
                <MDButton variant="outlined" color="secondary" onClick={() => onSave(null)}>
                  Cancel
                </MDButton>
                <MDButton
                  variant="contained"
                  color="customBlue"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Timeline'}
                </MDButton>
              </MDBox>
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

PropertyTimelineForm.propTypes = {
  initialData: PropTypes.object,
  onSave: PropTypes.func,
  hideButtons: PropTypes.bool,
};

export default PropertyTimelineForm;
