import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MDBox from 'components/MDBox';

import MDButton from 'components/MDButton';
import { Grid, Card, Typography, Avatar } from '@mui/material';
import FormField from 'layouts/pages/users/new-user/components/FormField';
import FormFieldSelect from 'components/FormFieldSelect';
import { Phone, Business, Person } from '@mui/icons-material';

const validationSchema = Yup.object().shape({
  // Agent information
  agentName: Yup.string()
    .required('Agent name is required')
    .min(2, 'Agent name must be at least 2 characters'),
  agentEmail: Yup.string()
    .email('Invalid email format')
    .required('Agent email is required'),
  agentPhone: Yup.string()
    .required('Agent phone is required')
    .matches(/^[+]?[1-9][\d]{0,15}$/, 'Invalid phone number format'),
  agentPosition: Yup.string().required('Agent position is required'),
  
  // Agency information
  agencyName: Yup.string()
    .required('Agency name is required')
    .min(2, 'Agency name must be at least 2 characters'),
  agencyEmail: Yup.string()
    .email('Invalid email format')
    .required('Agency email is required'),
  agencyPhone: Yup.string()
    .required('Agency phone is required')
    .matches(/^[+]?[1-9][\d]{0,15}$/, 'Invalid phone number format'),
  agencyWebsite: Yup.string().url('Invalid website URL'),
  
  // Office information
  officeAddress: Yup.string().required('Office address is required'),
  officeCity: Yup.string().required('Office city is required'),
  officeCountry: Yup.string().required('Office country is required'),
  officePostalCode: Yup.string().required('Office postal code is required'),
  
  // Contact preferences
  preferredContactMethod: Yup.string().required('Preferred contact method is required'),
  availabilityHours: Yup.string().required('Availability hours is required'),
  responseTime: Yup.string().required('Response time is required'),
  
  // Additional information
  languages: Yup.array().min(1, 'At least one language is required'),
  specializations: Yup.array().min(1, 'At least one specialization is required'),
  notes: Yup.string(),
});

const PropertyContactForm = ({ initialData = {}, onSave, hideButtons = false }) => {
  const initialValues = {
    // Agent information
    agentName: initialData.agentName || 'Sarah Johnson',
    agentEmail: initialData.agentEmail || 'sarah.johnson@blocktech.com',
    agentPhone: initialData.agentPhone || '+971501234567',
    agentPosition: initialData.agentPosition || 'Senior Real Estate Agent',
    
    // Agency information
    agencyName: initialData.agencyName || 'BlockTech Real Estate',
    agencyEmail: initialData.agencyEmail || 'info@blocktech.com',
    agencyPhone: initialData.agencyPhone || '+97141234567',
    agencyWebsite: initialData.agencyWebsite || 'https://blocktech.com',
    
    // Office information
    officeAddress: initialData.officeAddress || 'Sheikh Zayed Road, Tower 1',
    officeCity: initialData.officeCity || 'Dubai',
    officeCountry: initialData.officeCountry || 'United Arab Emirates',
    officePostalCode: initialData.officePostalCode || '12345',
    
    // Contact preferences
    preferredContactMethod: initialData.preferredContactMethod || 'phone',
    availabilityHours: initialData.availabilityHours || '9:00 AM - 6:00 PM',
    responseTime: initialData.responseTime || 'within_2_hours',
    
    // Additional information
    languages: initialData.languages || ['English', 'Arabic'],
    specializations: initialData.specializations || ['Residential', 'Luxury'],
    notes: initialData.notes || 'Specialized in luxury properties in Dubai Marina and Palm Jumeirah areas.',
  };

  const contactMethods = [
    { value: 'phone', label: '📞 Phone' },
    { value: 'email', label: '📧 Email' },
    { value: 'whatsapp', label: '💬 WhatsApp' },
    { value: 'sms', label: '📱 SMS' },
    { value: 'video_call', label: '📹 Video Call' },
  ];

  const responseTimes = [
    { value: 'immediate', label: '⚡ Immediate' },
    { value: 'within_1_hour', label: '⏰ Within 1 hour' },
    { value: 'within_2_hours', label: '⏰ Within 2 hours' },
    { value: 'within_24_hours', label: '📅 Within 24 hours' },
    { value: 'next_business_day', label: '🏢 Next business day' },
  ];

  const languageOptions = [
    { value: 'English', label: '🇺🇸 English' },
    { value: 'Arabic', label: '🇸🇦 Arabic' },
    { value: 'French', label: '🇫🇷 French' },
    { value: 'Spanish', label: '🇪🇸 Spanish' },
    { value: 'German', label: '🇩🇪 German' },
    { value: 'Italian', label: '🇮🇹 Italian' },
    { value: 'Russian', label: '🇷🇺 Russian' },
    { value: 'Chinese', label: '🇨🇳 Chinese' },
    { value: 'Hindi', label: '🇮🇳 Hindi' },
    { value: 'Portuguese', label: '🇵🇹 Portuguese' },
  ];

  const specializationOptions = [
    { value: 'Residential', label: '🏠 Residential' },
    { value: 'Commercial', label: '🏢 Commercial' },
    { value: 'Luxury', label: '💎 Luxury' },
    { value: 'Investment', label: '💰 Investment' },
    { value: 'Off-Plan', label: '🏗️ Off-Plan' },
    { value: 'Rental', label: '🔑 Rental' },
    { value: 'Villa', label: '🏡 Villa' },
    { value: 'Apartment', label: '🏢 Apartment' },
    { value: 'Penthouse', label: '🏙️ Penthouse' },
    { value: 'Land', label: '🌍 Land' },
  ];

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        onSave(values);
        setSubmitting(false);
      }}
    >
      {({ values, isSubmitting, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <MDBox mb={3}>
            <Typography variant="body2" color="textSecondary">
              Update contact information for this property listing.
            </Typography>
          </MDBox>

          <Grid container spacing={3}>
            {/* Agent Information */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <MDBox display="flex" alignItems="center" gap={1} mb={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                    <Person />
                  </Avatar>
                  <Typography variant="h6">
                    Agent Information
                  </Typography>
                </MDBox>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormField
                      label="Agent Name"
                      name="agentName"
                      placeholder="Sarah Johnson"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormField
                      label="Agent Email"
                      name="agentEmail"
                      type="email"
                      placeholder="sarah.johnson@blocktech.com"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormField
                      label="Agent Phone"
                      name="agentPhone"
                      placeholder="+971501234567"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormField
                      label="Agent Position"
                      name="agentPosition"
                      placeholder="Senior Real Estate Agent"
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Agency Information */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <MDBox display="flex" alignItems="center" gap={1} mb={2}>
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                    <Business />
                  </Avatar>
                  <Typography variant="h6">
                    Agency Information
                  </Typography>
                </MDBox>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormField
                      label="Agency Name"
                      name="agencyName"
                      placeholder="BlockTech Real Estate"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormField
                      label="Agency Email"
                      name="agencyEmail"
                      type="email"
                      placeholder="info@blocktech.com"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormField
                      label="Agency Phone"
                      name="agencyPhone"
                      placeholder="+97141234567"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormField
                      label="Agency Website"
                      name="agencyWebsite"
                      placeholder="https://blocktech.com"
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Office Address */}
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <MDBox display="flex" alignItems="center" gap={1} mb={2}>
                  <Avatar sx={{ bgcolor: 'info.main', width: 32, height: 32 }}>
                    <Business />
                  </Avatar>
                  <Typography variant="h6">
                    Office Address
                  </Typography>
                </MDBox>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormField
                      label="Office Address"
                      name="officeAddress"
                      placeholder="Sheikh Zayed Road, Tower 1"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormField
                      label="City"
                      name="officeCity"
                      placeholder="Dubai"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormField
                      label="Postal Code"
                      name="officePostalCode"
                      placeholder="12345"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormField
                      label="Country"
                      name="officeCountry"
                      placeholder="United Arab Emirates"
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Contact Preferences */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <MDBox display="flex" alignItems="center" gap={1} mb={2}>
                  <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                    <Phone />
                  </Avatar>
                  <Typography variant="h6">
                    Contact Preferences
                  </Typography>
                </MDBox>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormFieldSelect
                      label="Preferred Contact Method"
                      name="preferredContactMethod"
                      options={contactMethods}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormField
                      label="Availability Hours"
                      name="availabilityHours"
                      placeholder="9:00 AM - 6:00 PM"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormFieldSelect
                      label="Response Time"
                      name="responseTime"
                      options={responseTimes}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Languages & Specializations */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <MDBox display="flex" alignItems="center" gap={1} mb={2}>
                  <Avatar sx={{ bgcolor: 'warning.main', width: 32, height: 32 }}>
                    <Person />
                  </Avatar>
                  <Typography variant="h6">
                    Languages & Specializations
                  </Typography>
                </MDBox>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormFieldSelect
                      label="Languages Spoken"
                      name="languages"
                      options={languageOptions}
                      multiple={true}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormFieldSelect
                      label="Specializations"
                      name="specializations"
                      options={specializationOptions}
                      multiple={true}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Additional Notes */}
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  📝 Additional Notes
                </Typography>
                <FormField
                  label="Notes"
                  name="notes"
                  multiline
                  rows={4}
                  placeholder="Any additional information about the agent, agency, or contact preferences..."
                />
              </Card>
            </Grid>

            {/* Contact Summary */}
            <Grid item xs={12}>
              <Card sx={{ p: 3, backgroundColor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>
                  📞 Contact Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <MDBox textAlign="center">
                      <Typography variant="h6" color="primary">
                        {values.agentName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {values.agentPosition}
                      </Typography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <MDBox textAlign="center">
                      <Typography variant="h6" color="success.main">
                        {values.agentPhone}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Agent Phone
                      </Typography>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <MDBox textAlign="center">
                      <Typography variant="h6" color="info.main">
                        {values.agentEmail}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Agent Email
                      </Typography>
                    </MDBox>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>

          {/* Submit Buttons */}
          {!hideButtons && (
            <MDBox mt={4} display="flex" justifyContent="flex-end" gap={2}>
              <MDButton
                variant="outlined"
                color="secondary"
                onClick={() => onSave(null)}
              >
                Cancel
              </MDButton>
              <MDButton
                variant="contained"
                color="customBlue"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Contact Information'}
              </MDButton>
            </MDBox>
          )}
        </Form>
      )}
    </Formik>
  );
};

PropertyContactForm.propTypes = {
  initialData: PropTypes.object,
  onSave: PropTypes.func,
  hideButtons: PropTypes.bool,
};

export default PropertyContactForm; 