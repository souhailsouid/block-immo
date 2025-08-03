import { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { useNotification } from 'context/NotificationContext';
import { useInvestment } from 'context/InvestmentContext';
import { useAuth } from 'hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import investmentService from 'services/api/modules/investments/investmentService';

import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import { formatCurrency } from 'utils';

const BuySharesModal = ({ onSave, onClose, initialData }) => {
  const { showNotification } = useNotification();
  const { addTransaction, setLoading, setError } = useInvestment();
  const { user } = useAuth();
  console.log('user', user);
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState('selection'); // 'selection', 'confirmation', 'payment', 'success'
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Debug temporaire
  // console.log('🔍 BuySharesModal initialData:', initialData);
  
  const blockValue = 10;
  const propertyPrice = parseFloat(initialData?.propertyPrice?.toString().replace(/[^0-9.]/g, '')) || 1000000;
  const returnRate = parseFloat(initialData?.yearlyInvestmentReturn || 7);

  const [blockCount, setBlockCount] = useState(1);
  const [customAmount, setCustomAmount] = useState('10');

  const investmentAmount = parseFloat(customAmount) || (blockCount * blockValue);
  const ownershipPercentage = ((investmentAmount / propertyPrice) * 100).toFixed(4);
  const estimatedReturnYear = ((investmentAmount * returnRate) / 100).toFixed(2);
  const estimatedReturnQuarter = (estimatedReturnYear / 4).toFixed(2);

  // Options d'investissement prédéfinies plus accessibles
  const investmentOptions = [
    { label: 'Discovery', amount: 10, blocks: 1, description: 'Test with 1 block' },
    { label: 'Beginner', amount: 50, blocks: 5, description: '5 blocks to start' },
    { label: 'Investor', amount: 100, blocks: 10, description: '10 blocks' },
    { label: 'Confirmed', amount: 500, blocks: 50, description: '50 blocks' },
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
      const calculatedBlockValue = Math.round(numValue / 10) * 10;
      const calculatedBlocks = Math.floor(calculatedBlockValue / 10);
      setBlockCount(calculatedBlocks);
    } else {
      setBlockCount(0);
    }
  };

  const handleConfirmInvestment = () => {
    setCurrentStep('confirmation');
  };

  const handleProceedToPayment = () => {
    setCurrentStep('payment');
  };

  const handlePaymentSuccess = async () => {
    setIsProcessing(true);
    try {
      // Validation du propertyId
      if (!initialData?.propertyId) {
        throw new Error('Property ID is missing. Please try again.');
      }
      
      // Validation du userId
      const userId = user?.username || user?.userId || user?.id || user?.sub || user?.attributes?.sub || 'test-user-id';
      if (!userId || userId === 'test-user-id') {
        console.log('🔍 User object:', user);
        throw new Error('User ID is missing. Please log in again.');
      }
      
      // Validation des données avant envoi
      const customAmountValue = parseFloat(customAmount);
      console.log('🔍 Debug values:', {
        customAmount,
        customAmountValue,
        blockCount,
        propertyId: initialData?.propertyId,
        userId: user?.id || user?.sub
      });
      
      if (isNaN(customAmountValue) || customAmountValue < 10) {
        throw new Error('Please enter a valid amount (minimum 10€)');
      }
      
      // Recalculer les valeurs pour s'assurer qu'elles sont synchronisées
      const recalculatedBlockValue = Math.round(customAmountValue / 10) * 10;
      const recalculatedBlocks = Math.floor(recalculatedBlockValue / 10);
      const recalculatedInvestmentAmount = recalculatedBlockValue;
      
      console.log('🔍 Recalculated values:', {
        recalculatedBlockValue,
        recalculatedBlocks,
        recalculatedInvestmentAmount
      });
      
      if (recalculatedBlocks <= 0) {
        throw new Error('Please select a valid number of blocks (minimum 1)');
      }
      
      if (recalculatedInvestmentAmount <= 0) {
        throw new Error('Please enter a valid investment amount (minimum 10€)');
      }

      // Préparer les données d'achat avec les valeurs recalculées
      const purchaseData = {
        propertyId: initialData.propertyId,
        userId: userId,
        investment: Number(recalculatedInvestmentAmount),
        blocks: Number(recalculatedBlocks),
        ownershipPercentage: ((recalculatedInvestmentAmount / propertyPrice) * 100).toFixed(4),
        returnRate: Number(returnRate),
        currency: 'EUR',
        paymentMethod: 'BANK_TRANSFER',
        propertyTitle: initialData?.propertyTitle || 'Property',
        propertyLocation: initialData?.propertyLocation || 'Location',
        propertyImage: initialData?.propertyImage || '/src/assets/images/products/product-1-min.jpg',
      };

      // Effectuer l'achat
      const result = await investmentService.buyShares(purchaseData);
      
      if (result.success) {
        // Créer les données d'investissement pour le callback
        const investmentData = {
          blocks: recalculatedBlocks,
          investment: recalculatedInvestmentAmount,
          propertyId: initialData?.propertyId,
          propertyPrice: propertyPrice,
          returnRate: returnRate,
          ownershipPercentage: ((recalculatedInvestmentAmount / propertyPrice) * 100).toFixed(4),
          estimatedReturnYear: ((recalculatedInvestmentAmount * returnRate) / 100).toFixed(2),
          estimatedReturnQuarter: (((recalculatedInvestmentAmount * returnRate) / 100) / 4).toFixed(2),
          paymentId: result.data.transactionId,
          transactionId: result.data.transactionId,
          status: result.data.status,
        };

        // Ajouter la transaction au contexte
        const transaction = {
          transactionId: result.data.transactionId,
          investmentId: result.data.investmentId,
          propertyId: initialData?.propertyId,
          propertyTitle: result.data.propertyTitle,
          amount: recalculatedInvestmentAmount,
          blocks: recalculatedBlocks,
          status: result.data.status,
          timestamp: result.data.timestamp,
          type: 'PURCHASE',
          returnRate: result.data.returnRate,
        };
        
        addTransaction(transaction);
        console.log('🔍 Investment data:', investmentData);
        // Pas besoin d'appeler onSave car l'appel API est déjà fait
        // await onSave(investmentData);
        
        // Rafraîchir le portfolio dans le dashboard investor
        // Invalider les requêtes React Query pour forcer le refresh
        if (queryClient) {
          queryClient.invalidateQueries(['portfolio']);
          queryClient.invalidateQueries(['recent-transactions']);
        }
        
        setCurrentStep('success');
        showNotification('success', `Investment successful! You now own ${recalculatedBlocks} block(s) in this property.`);
        
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        throw new Error('Investment failed');
      }
    } catch (error) {
      showNotification('error', error.message || 'Payment failed. Please try again.');
      setCurrentStep('payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'confirmation') {
      setCurrentStep('selection');
    } else if (currentStep === 'payment') {
      setCurrentStep('confirmation');
    }
  };

  const getMinInvestment = () => {
    return 10; // Minimum investment = 10€ (1 block)
  };

  const getMaxInvestment = () => {
    return Math.min(propertyPrice, 100000); // Limiter à 100K€ pour l'accessibilité
  };

  const isValidInvestment = () => {
    return investmentAmount >= getMinInvestment() && investmentAmount <= getMaxInvestment();
  };

  // Rendu de l'étape de sélection
  const renderSelectionStep = () => (
    <>
      <MDTypography variant="h5" fontWeight="bold" mb={1} color="customBlue">
        🏠 Invest in real estate from 10€
      </MDTypography>
      
      <MDTypography variant="body2" color="text" mb={3}>
        Property value of <strong>{formatCurrency(propertyPrice, 'EUR')}</strong>
        <br />
        Estimated annual return: <strong>{returnRate}%</strong>
      </MDTypography>

      {/* Options d'investissement rapides */}
      <MDBox mb={3}>
        <MDTypography variant="subtitle2" fontWeight="medium" mb={2}>
          🚀 Choose your investor profile
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
          🎯 Or enter your exact amount
        </MDTypography>
        
        <TextField
          fullWidth
          label="Investment amount"
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
            {blockCount} block{blockCount > 1 ? 's' : ''} selected{blockCount > 1 ? 's' : ''}
          </MDTypography>
          <MDTypography variant="caption" color="text">
            {formatCurrency(investmentAmount, 'EUR')}
          </MDTypography>
        </MDBox>
      </MDBox>

      {/* Résumé de l'investissement */}
      <MDBox mb={3} py={2} px={2} borderRadius="md" sx={{ 
        border: '1px solid #e0e0e0', 
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
      }}>
        <MDTypography variant="subtitle2" fontWeight="bold" mb={2} color="customBlue">
          📊 Summary of your investment
        </MDTypography>
        
        <InfoLine 
          label="📦 Bought blocks" 
          value={`${blockCount.toLocaleString()} bloc${blockCount > 1 ? 's' : ''}`} 
        />
        <InfoLine 
          label="💰 Invested amount" 
          value={formatCurrency(investmentAmount, 'EUR')} 
          highlight
        />
        <InfoLine 
          label="🏠 Ownership percentage" 
          value={`${ownershipPercentage}%`} 
        />
        <InfoLine 
          label="📈 Estimated annual return" 
          value={formatCurrency(estimatedReturnYear, 'EUR')} 
          color="success"
        />
        <InfoLine 
          label="📅 Estimated quarterly return" 
          value={formatCurrency(estimatedReturnQuarter, 'EUR')} 
          color="success"
        />
      </MDBox>

      {/* Boutons d'action */}
      <MDBox display="flex" justifyContent="space-between" alignItems="center" gap={2}>
        <MDButton variant="outlined" color="secondary" onClick={onClose}>
          Cancel
        </MDButton>
        <MDButton
          variant="contained"
          color="customBlue"
          onClick={handleConfirmInvestment}
          disabled={!isValidInvestment()}
          sx={{ px: 4, py: 1.5, fontWeight: 'bold' }}
        >
          Continue to Review
        </MDButton>
      </MDBox>
    </>
  );

  // Rendu de l'étape de confirmation
  const renderConfirmationStep = () => (
    <>
      <MDTypography variant="h5" fontWeight="bold" mb={2} color="customBlue">
        📋 Review Your Investment
      </MDTypography>
      
      <MDBox mb={3} py={3} px={3} borderRadius="md" sx={{ 
        border: '2px solid #e0e0e0', 
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
      }}>
        <MDTypography variant="h6" fontWeight="bold" mb={3} color="customBlue" textAlign="center">
          Investment Summary
        </MDTypography>
        
        <InfoLine 
          label="🏠 Property" 
          value="Real Estate Investment" 
        />
        <InfoLine 
          label="📦 Blocks purchased" 
          value={`${blockCount.toLocaleString()} bloc${blockCount > 1 ? 's' : ''}`} 
        />
        <InfoLine 
          label="💰 Total investment" 
          value={formatCurrency(investmentAmount, 'EUR')} 
          highlight
        />
        <InfoLine 
          label="🏠 Ownership" 
          value={`${ownershipPercentage}%`} 
        />
        <InfoLine 
          label="📈 Annual return" 
          value={`${returnRate}%`} 
          color="success"
        />
        <InfoLine 
          label="💵 Estimated annual profit" 
          value={formatCurrency(estimatedReturnYear, 'EUR')} 
          color="success"
        />
        
        <MDBox mt={3} p={2} borderRadius="md" sx={{ 
          backgroundColor: 'success.light', 
          border: '1px solid #4caf50' 
        }}>
          <MDTypography variant="body2" color="success.dark" textAlign="center">
            ✅ This investment is fully compliant with regulations
          </MDTypography>
        </MDBox>
      </MDBox>

      {/* Boutons d'action */}
      <MDBox display="flex" justifyContent="space-between" alignItems="center" gap={2}>
        <MDButton variant="outlined" color="secondary" onClick={handleBack}>
          Back
        </MDButton>
        <MDButton
          variant="contained"
          color="customBlue"
          onClick={handleProceedToPayment}
          sx={{ px: 4, py: 1.5, fontWeight: 'bold' }}
        >
          Proceed to Payment
        </MDButton>
      </MDBox>
    </>
  );

  // Rendu de l'étape de paiement
  const renderPaymentStep = () => (
    <>
      <MDTypography variant="h5" fontWeight="bold" mb={2} color="customBlue">
        💳 Secure Payment
      </MDTypography>
      
      <MDBox mb={3} py={3} px={3} borderRadius="md" sx={{ 
        border: '2px solid #e0e0e0', 
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
      }}>
        <MDTypography variant="h6" fontWeight="bold" mb={3} color="customBlue" textAlign="center">
          Payment Details
        </MDTypography>
        
        <InfoLine 
          label="💰 Amount to pay" 
          value={formatCurrency(investmentAmount, 'EUR')} 
          highlight
        />
        <InfoLine 
          label="🏦 Payment method" 
          value="Bank Transfer (SEPA)" 
        />
        <InfoLine 
          label="⏱️ Processing time" 
          value="1-2 business days" 
        />
        <InfoLine 
          label="🔒 Security" 
          value="256-bit SSL encryption" 
        />
        
        <MDBox mt={3} p={2} borderRadius="md" sx={{ 
          backgroundColor: 'info.light', 
          border: '1px solid #2196f3' 
        }}>
          <MDTypography variant="body2" color="info.dark" textAlign="center">
            🔒 Your payment is protected by our secure payment system
          </MDTypography>
        </MDBox>
      </MDBox>

      {/* Boutons d'action */}
      <MDBox display="flex" justifyContent="space-between" alignItems="center" gap={2}>
        <MDButton variant="outlined" color="secondary" onClick={handleBack}>
          Back
        </MDButton>
        <MDButton
          variant="contained"
          color="customBlue"
          onClick={handlePaymentSuccess}
          disabled={isProcessing}
          sx={{ px: 4, py: 1.5, fontWeight: 'bold' }}
        >
          {isProcessing ? 'Processing...' : 'Confirm Payment'}
        </MDButton>
      </MDBox>
    </>
  );

  // Rendu de l'étape de succès
  const renderSuccessStep = () => (
    <>
      <MDBox textAlign="center" py={3}>
        <MDBox
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'success.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            mb: 3
          }}
        >
          <MDTypography variant="h3" color="white">
            ✅
          </MDTypography>
        </MDBox>
        
        <MDTypography variant="h5" fontWeight="bold" mb={2} color="success.main">
          Investment Successful!
        </MDTypography>
        
        <MDTypography variant="body1" color="text" mb={3}>
          Congratulations! You have successfully invested <strong>{formatCurrency(investmentAmount, 'EUR')}</strong> 
          in this property. You now own <strong>{blockCount} block{blockCount > 1 ? 's' : ''}</strong> 
          representing <strong>{ownershipPercentage}%</strong> of the property.
        </MDTypography>
        
        <MDBox py={2} px={3} borderRadius="md" sx={{ 
          backgroundColor: 'success.light', 
          border: '1px solid #4caf50' 
        }}>
          <MDTypography variant="body2" color="success.dark">
            📧 A confirmation email has been sent to your registered email address.
            <br />
            📱 You can track your investment in your portfolio dashboard.
          </MDTypography>
        </MDBox>
      </MDBox>
    </>
  );

  return (
    <MDBox px={3} py={2}>
      {currentStep === 'selection' && renderSelectionStep()}
      {currentStep === 'confirmation' && renderConfirmationStep()}
      {currentStep === 'payment' && renderPaymentStep()}
      {currentStep === 'success' && renderSuccessStep()}

      {/* Messages d'encouragement - seulement à l'étape de sélection */}
      {currentStep === 'selection' && (
        <MDBox mt={2} textAlign="center">
          <MDTypography variant="caption" color="text">
            💡 <strong>Advice:</strong> Start small, grow with us!
          </MDTypography>
          <br />
          <MDTypography variant="caption" color="text">
            🔒 Secure investment • Guaranteed liquidity • Total transparency
          </MDTypography>
        </MDBox>
      )}
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
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  initialData: PropTypes.object.isRequired,
};

export default BuySharesModal;
