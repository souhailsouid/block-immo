import { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import { formatCurrency } from 'utils';

const BuySharesModal = ({ onSubmit, onClose, initalData }) => {
  const blockValue = 10;
  const propertyPrice = parseFloat(initalData?.value.replace(/[^0-9.]/g, '')) || 1000000;
  const returnRate = parseFloat(initalData?.investmentReturn || 10);

  const maxBlocks = Math.floor(propertyPrice / blockValue);
  const [blockCount, setBlockCount] = useState(1);
  const [customAmount, setCustomAmount] = useState('10');

  const investmentAmount = blockCount * blockValue;
  const ownershipPercentage = ((investmentAmount / propertyPrice) * 100).toFixed(4);
  const estimatedReturnYear = ((investmentAmount * returnRate) / 100).toFixed(2);
  const estimatedReturnQuarter = (estimatedReturnYear / 4).toFixed(2);

  // Options d&apos;investissement prédéfinies plus accessibles
  const investmentOptions = [
    { label: 'Découverte', amount: 10, blocks: 1, description: 'Testez avec 1 bloc' },
    { label: 'Débutant', amount: 50, blocks: 5, description: '5 blocs pour commencer' },
    { label: 'Investisseur', amount: 100, blocks: 10, description: '10 blocs' },
    { label: 'Confirmé', amount: 500, blocks: 50, description: '50 blocs' },
    { label: 'Expert', amount: 1000, blocks: 100, description: '100 blocs' },
  ];

  const handleQuickSelect = (blocks) => {
    setBlockCount(blocks);
    setCustomAmount((blocks * blockValue).toString());
  };

  const handleCustomAmountChange = (event) => {
    const value = event.target.value;
    setCustomAmount(value);
    
    const numValue = parseFloat(value) || 0;
    if (numValue >= 10) {
      // Arrondir au multiple de 10 le plus proche (1 bloc = 10€)
      const blockValue = Math.round(numValue / 10) * 10;
      const calculatedBlocks = Math.floor(blockValue / 10);
      setBlockCount(calculatedBlocks);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      blocks: blockCount,
      investment: investmentAmount,
    });
    onClose();
  };

  const getMinInvestment = () => {
    return 10; // Minimum investment = 10€ (1 block)
  };

  const getMaxInvestment = () => {
    return Math.min(propertyPrice, 100000); // Limiter à 100K€ pour l&apos;accessibilité
  };

  const isValidInvestment = () => {
    return investmentAmount >= getMinInvestment() && investmentAmount <= getMaxInvestment();
  };

  return (
    <MDBox px={3} py={2}>
      <MDTypography variant="h5" fontWeight="bold" mb={1} color="customBlue">
        🏠 Investissez dans l&apos;immobilier dès 10€
      </MDTypography>
      
      <MDTypography variant="body2" color="text" mb={3}>
        Propriété d&apos;une valeur de <strong>{formatCurrency(propertyPrice, 'EUR')}</strong>
        <br />
        Rendement annuel estimé : <strong>{returnRate}%</strong>
      </MDTypography>

      {/* Options d&apos;investissement rapides */}
      <MDBox mb={3}>
        <MDTypography variant="subtitle2" fontWeight="medium" mb={2}>
          🚀 Choisissez votre profil d&apos;investisseur
        </MDTypography>
        <MDBox display="flex" gap={1} flexWrap="wrap">
          {investmentOptions.map((option) => (
            <MDButton
              key={option.amount}
              variant={blockCount === option.blocks ? "contained" : "outlined"}
              color="customBlue"
              size="small"
              onClick={() => handleQuickSelect(option.blocks)}
              sx={{ 
                minWidth: 'auto',
                px: 2,
                py: 1,
                fontSize: '0.8rem'
              }}
            >
              <MDBox textAlign="center">
                <MDTypography variant="caption" display="block" fontWeight="bold">
                  {option.label}
                </MDTypography>
                <MDTypography variant="caption" display="block">
                  {option.amount}€
                </MDTypography>
              </MDBox>
            </MDButton>
          ))}
        </MDBox>
      </MDBox>

      {/* Saisie du montant exact */}
      <MDBox mb={3}>
        <MDTypography variant="subtitle2" fontWeight="medium" mb={2}>
          🎯 Ou saisissez votre montant exact
        </MDTypography>
        
        <TextField
          fullWidth
          label="Montant à investir"
          type="number"
          value={customAmount}
          onChange={handleCustomAmountChange}
          InputProps={{
            startAdornment: <InputAdornment position="start">€</InputAdornment>,
          }}
          helperText={`Minimum: ${formatCurrency(getMinInvestment(), 'EUR')} (1 bloc) | Maximum: ${formatCurrency(getMaxInvestment(), 'EUR')} (${Math.floor(getMaxInvestment() / blockValue).toLocaleString()} blocs)`}
          error={!isValidInvestment()}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#4472c4',
              },
            },
            mb: 2
          }}
        />

        {/* Affichage du montant actuel */}
        <MDBox display="flex" justifyContent="center" mb={2}>
          <MDTypography variant="h6" color="customBlue" fontWeight="bold">
            {formatCurrency(investmentAmount, 'EUR')}
          </MDTypography>
        </MDBox>
        
        <MDBox display="flex" justifyContent="space-between" mt={1}>
          <MDTypography variant="caption" color="text">
            {blockCount} bloc{blockCount > 1 ? 's' : ''} sélectionné{blockCount > 1 ? 's' : ''}
          </MDTypography>
          <MDTypography variant="caption" color="text">
            {formatCurrency(investmentAmount, 'EUR')}
          </MDTypography>
        </MDBox>
      </MDBox>

      {/* Résumé de l&apos;investissement */}
      <MDBox mb={3} py={2} px={2} borderRadius="md" sx={{ 
        border: '1px solid #e0e0e0', 
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
      }}>
        <MDTypography variant="subtitle2" fontWeight="bold" mb={2} color="customBlue">
          📊 Résumé de votre investissement
        </MDTypography>
        
        <InfoLine 
          label="📦 Blocs achetés" 
          value={`${blockCount.toLocaleString()} bloc${blockCount > 1 ? 's' : ''}`} 
        />
        <InfoLine 
          label="💰 Montant investi" 
          value={formatCurrency(investmentAmount, 'EUR')} 
          highlight
        />
        <InfoLine 
          label="🏠 Part de la propriété" 
          value={`${ownershipPercentage}%`} 
        />
        <InfoLine 
          label="📈 Rendement annuel estimé" 
          value={formatCurrency(estimatedReturnYear, 'EUR')} 
          color="success"
        />
        <InfoLine 
          label="📅 Revenu trimestriel" 
          value={formatCurrency(estimatedReturnQuarter, 'EUR')} 
          color="success"
        />
      </MDBox>

      {/* Boutons d&apos;action */}
      <MDBox display="flex" justifyContent="space-between" alignItems="center" gap={2}>
        <MDButton variant="outlined" color="secondary" onClick={onClose}>
          Annuler
        </MDButton>
        <MDButton
          variant="contained"
          color="customBlue"
          onClick={handleSubmit}
          disabled={!isValidInvestment()}
          sx={{ px: 4, py: 1.5, fontWeight: 'bold' }}
        >
          Investir {formatCurrency(investmentAmount, 'EUR')}
        </MDButton>
      </MDBox>

      {/* Messages d&apos;encouragement */}
      <MDBox mt={2} textAlign="center">
        <MDTypography variant="caption" color="text">
          💡 <strong>Conseil :</strong> Commencez petit, grandissez avec nous !
        </MDTypography>
        <br />
        <MDTypography variant="caption" color="text">
          🔒 Investissement sécurisé • Liquidité garantie • Transparence totale
        </MDTypography>
      </MDBox>
    </MDBox>
  );
};

const InfoLine = ({ label, value, highlight, color = "text" }) => (
  <MDBox display="flex" justifyContent="space-between" py={0.5}>
    <MDTypography variant="body2" color="text">
      {label}
    </MDTypography>
    <MDTypography 
      variant="body2" 
      fontWeight={highlight ? "bold" : "medium"}
      color={color}
      sx={highlight ? { fontSize: '1.1rem' } : {}}
    >
      {value}
    </MDTypography>
  </MDBox>
);

BuySharesModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  initalData: PropTypes.object.isRequired,
};

export default BuySharesModal;
