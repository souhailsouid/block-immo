import { useState } from "react";
import PropTypes from "prop-types";

// @mui material components
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Icons
import CloseIcon from "@mui/icons-material/Close";

// Images
import masterCardLogo from "assets/images/logos/mastercard.png";
import visaLogo from "assets/images/logos/visa.png";

const AddCardModal = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardType: "visa" // visa ou mastercard
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Générer les années d'expiration (année actuelle + 10 ans)
  const currentYear = new Date().getFullYear();
  const expiryYears = Array.from({ length: 10 }, (_, i) => currentYear + i);
  
  // Générer les mois
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return { value: month.toString().padStart(2, '0'), label: month.toString().padStart(2, '0') };
  });

  // Détecter le type de carte basé sur le numéro
  const detectCardType = (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'visa';
    if (cleanNumber.startsWith('5')) return 'mastercard';
    if (cleanNumber.startsWith('3')) return 'amex';
    return 'visa'; // par défaut
  };

  // Formater le numéro de carte
  const formatCardNumber = (value) => {
    const cleanValue = value.replace(/\s/g, '');
    const groups = cleanValue.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleanValue;
  };

  // Mettre à jour le type de carte automatiquement
  const handleCardNumberChange = (value) => {
    const formattedValue = formatCardNumber(value);
    const detectedType = detectCardType(value);
    
    setFormData(prev => ({
      ...prev,
      cardNumber: formattedValue,
      cardType: detectedType
    }));
    
    if (errors.cardNumber) {
      setErrors(prev => ({ ...prev, cardNumber: '' }));
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      newErrors.cardNumber = "Invalid card number (16 digits required)";
    }
    
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }
    
    if (!formData.expiryMonth) {
      newErrors.expiryMonth = "Expiration month is required";
    }
    
    if (!formData.expiryYear) {
      newErrors.expiryYear = "Année d'expiration requise";
    }
    
    if (!formData.cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = "CVV invalide (3-4 chiffres)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Préparer les données de la carte
      const cardData = {
        ...formData,
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        lastFourDigits: formData.cardNumber.replace(/\s/g, '').slice(-4),
        cardType: detectCardType(formData.cardNumber),
        isDefault: false
      };
      
      onSave(cardData);
    } catch (error) {
      // Gérer l'erreur silencieusement ou afficher une notification
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClose = () => {
    setFormData({
      cardNumber: "",
      cardholderName: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      cardType: "visa"
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '500px'
        }
      }}
    >
      <DialogTitle>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h5" fontWeight="medium">
            Add a new card
          </MDTypography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </MDBox>
      </DialogTitle>
      
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <MDBox mt={2}>
            {/* Type de carte */}
            <MDBox mb={3}>
              <MDTypography variant="button" fontWeight="medium" color="text" mb={1}>
                Card type
              </MDTypography>
              <MDBox display="flex" gap={2}>
                <MDBox
                  onClick={() => setFormData(prev => ({ ...prev, cardType: 'visa' }))}
                  sx={{
                    cursor: 'pointer',
                    opacity: formData.cardType === 'visa' ? 1 : 0.5,
                    transition: 'opacity 0.2s'
                  }}
                >
                  <img src={visaLogo} alt="Visa" style={{ height: '40px' }} />
                </MDBox>
                <MDBox
                  onClick={() => setFormData(prev => ({ ...prev, cardType: 'mastercard' }))}
                  sx={{
                    cursor: 'pointer',
                    opacity: formData.cardType === 'mastercard' ? 1 : 0.5,
                    transition: 'opacity 0.2s'
                  }}
                >
                  <img src={masterCardLogo} alt="Mastercard" style={{ height: '40px' }} />
                </MDBox>
              </MDBox>
            </MDBox>

            {/* Numéro de carte */}
            <MDBox mb={3}>
              <TextField
                fullWidth
                label="Card number"
                value={formData.cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                error={!!errors.cardNumber}
                helperText={errors.cardNumber}
                placeholder="1234 5678 9012 3456"
                inputProps={{ maxLength: 19 }}
              />
            </MDBox>

            {/* Nom du titulaire */}
            <MDBox mb={3}>
              <TextField
                fullWidth
                label="Cardholder name"
                value={formData.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                error={!!errors.cardholderName}
                helperText={errors.cardholderName}
                placeholder="JOHN DOE"
              />
            </MDBox>

            {/* Date d'expiration et CVV */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth error={!!errors.expiryMonth}>
                  <InputLabel>Month</InputLabel>
                  <Select
                    value={formData.expiryMonth}
                    onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
                    label="Month"
                  >
                    {months.map((month) => (
                      <MenuItem key={month.value} value={month.value}>
                        {month.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth error={!!errors.expiryYear}>
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={formData.expiryYear}
                    onChange={(e) => handleInputChange('expiryYear', e.target.value)}
                    label="Year"
                  >
                    {expiryYears.map((year) => (
                      <MenuItem key={year} value={year.toString()}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* CVV */}
            <MDBox mt={3}>
              <TextField
                fullWidth
                label="CVV"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                error={!!errors.cvv}
                helperText={errors.cvv}
                placeholder="123"
                inputProps={{ maxLength: 4 }}
                type="password"
              />
            </MDBox>

            {/* Informations de sécurité */}
            <MDBox mt={3}>
              <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
                <MDTypography variant="caption" fontWeight="medium">
                  🔒 Your payment information is secure and encrypted.
                </MDTypography>
              </Alert>
            </MDBox>
          </MDBox>
        </form>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <MDButton 
          variant="outlined" 
          color="dark" 
          onClick={handleClose}
          disabled={isSubmitting}
        >
          Cancel
        </MDButton>
        <MDButton 
          variant="gradient" 
          color="dark" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding card..." : "Add card"}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

AddCardModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default AddCardModal; 