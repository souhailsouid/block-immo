import { useState, useEffect } from 'react';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDBadge from 'components/MDBadge';

// Material-UI components
import { Grid, Card } from '@mui/material';
import Icon from '@mui/material/Icon';

// Examples
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import InvestmentCard from 'examples/Cards/InvestmentCard';
import InvestmentTransactionsList from 'components/InvestmentTransactionsList';

// Services
import investmentService from 'services/api/modules/investments/investmentService';
import { useAuth } from 'hooks/useAuth';
import { useNotification } from 'context/NotificationContext';

// Utils
import { formatCurrency } from 'utils';

// Images par défaut
import booking1 from 'assets/images/products/product-1-min.jpg';
import booking2 from 'assets/images/products/product-2-min.jpg';
import booking3 from 'assets/images/products/product-3-min.jpg';

const InvestorDashboard = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const { user } = useAuth();
  const { showNotification } = useNotification();

  // Fonction pour obtenir une image par défaut
  const getDefaultImage = (index) => {
    const images = [booking1, booking2, booking3];
    return images[index % images.length];
  };

  // Fonction pour filtrer les transactions par propriété
  const getFilteredTransactions = () => {
    if (!portfolio?.recentTransactions) return [];
    
    if (selectedProperty) {
      return portfolio.recentTransactions.filter(tx => tx.propertyId === selectedProperty);
    }
    
    return portfolio.recentTransactions;
  };

  // Fonction pour obtenir le nombre de transactions par propriété
  const getTransactionCount = (propertyId) => {
    if (!portfolio?.recentTransactions) return 0;
    return portfolio.recentTransactions.filter(tx => tx.propertyId === propertyId).length;
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Utiliser l'ID de l'utilisateur connecté
      const userId = user?.username || user?.userId || user?.id || user?.sub || user?.attributes?.sub || 'test-user';
      
      // Appel à l'API pour récupérer le portfolio
      const portfolioData = await investmentService.getPortfolio(userId);
      
      // Adapter les données de l'API au format attendu par la page
      const adaptedPortfolio = {
        totalValue: portfolioData.totalValue,
        totalInvested: portfolioData.totalInvested,
        totalReturn: portfolioData.totalReturn,
        returnRate: portfolioData.stats?.averageReturn || 0,
        properties: (() => {
          // Group properties by propertyId
          const propertyGroups = {};
          
          portfolioData.properties?.forEach((property) => {
            const propertyId = property.propertyId;
            
            if (!propertyGroups[propertyId]) {
              propertyGroups[propertyId] = {
                id: propertyId,
                name: property.propertyTitle || 'Property',
                location: property.propertyLocation || 'Location',
                investedAmount: 0,
                currentValue: 0,
                return: 0,
                returnRate: property.returnRate || 0,
                blocks: 0,
                ownership: 0,
                status: property.status,
                transactions: [],
              };
            }
            
            // Aggregate values
            propertyGroups[propertyId].investedAmount += property.investedAmount || 0;
            propertyGroups[propertyId].currentValue += property.currentValue || 0;
            propertyGroups[propertyId].return += property.return || 0;
            propertyGroups[propertyId].blocks += property.blocks || 0;
            propertyGroups[propertyId].ownership += parseFloat(property.ownership) || 0;
          });
          
          return Object.values(propertyGroups);
        })(),
        recentTransactions: portfolioData.transactions?.map((tx, index) => ({
          id: tx.transactionId || `tx-${index}`,
          type: tx.type,
          property: tx.propertyTitle || 'Property',
          propertyId: tx.propertyId,
          amount: tx.amount,
          blocks: tx.blocks,
          date: tx.timestamp ? new Date(tx.timestamp).toLocaleString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }) : new Date().toLocaleString('fr-FR'),
          status: tx.status,
        })) || [],
      };
      
      setPortfolio(adaptedPortfolio);
    } catch (error) {
      setError(error.message);
      showNotification('error', 'Erreur lors du chargement du portfolio');
      
      // Fallback vers des données mockées en cas d'erreur
      const mockPortfolio = {
        totalValue: 25000,
        totalInvested: 20000,
        totalReturn: 5000,
        returnRate: 25,
        properties: [
          {
            id: '1',
            name: 'Luxury Apartment Paris',
            location: 'Paris, France',
            investedAmount: 10000,
            currentValue: 12500,
            return: 2500,
            returnRate: 25,
            blocks: 1000,
            ownership: 0.5,
            status: 'ACTIVE',
          },
          {
            id: '2',
            name: 'Commercial Building Lyon',
            location: 'Lyon, France',
            investedAmount: 5000,
            currentValue: 6000,
            return: 1000,
            returnRate: 20,
            blocks: 500,
            ownership: 0.25,
            status: 'ACTIVE',
          },
          {
            id: '3',
            name: 'Residential Complex Nice',
            location: 'Nice, France',
            investedAmount: 5000,
            currentValue: 6500,
            return: 1500,
            returnRate: 30,
            blocks: 500,
            ownership: 0.25,
            status: 'ACTIVE',
          }
        ],
        recentTransactions: [
          {
            id: 'TXN-001',
            type: 'BUY',
            property: 'Luxury Apartment Paris',
            amount: 10000,
            blocks: 1000,
            date: '2024-01-15',
            status: 'CONFIRMED'
          },
          {
            id: 'TXN-002',
            type: 'BUY',
            property: 'Commercial Building Lyon',
            amount: 5000,
            blocks: 500,
            date: '2024-02-01',
            status: 'CONFIRMED'
          },
          {
            id: 'TXN-003',
            type: 'BUY',
            property: 'Residential Complex Nice',
            amount: 5000,
            blocks: 500,
            date: '2024-02-15',
            status: 'CONFIRMED'
          }
        ]
      };

      // Fallback vers des données mockées en cas d'erreur
      setPortfolio(mockPortfolio);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'error';
      default: return 'info';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ACTIVE': return 'Active';
      case 'PENDING': return 'Pending';
      case 'CANCELLED': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <MDTypography variant="h6" color="text">
            Loading your portfolio...
          </MDTypography>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <MDTypography variant="h6" color="error">
            {error}
          </MDTypography>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {/* Header avec statistiques globales */}
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDBox mb={3}>
                  <MDTypography variant="h4" fontWeight="bold" color="customBlue">
                    🏠 My Investment Portfolio
                  </MDTypography>
                  <MDTypography variant="body2" color="text" mt={1}>
                    Track your fractional real estate investments and their real-time performance. 
                    Each property represents a share of your diversified portfolio.
                  </MDTypography>
                </MDBox>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <MDBox textAlign="center">
                      <MDTypography variant="h6" color="text" mb={1}>
                        💰 Total Portfolio Value
                      </MDTypography>
                      <MDTypography variant="h4" color="success" fontWeight="bold">
                        {formatCurrency(portfolio.totalValue, 'EUR')}
                      </MDTypography>
                      <MDTypography variant="caption" color="text">
                        Current total value
                      </MDTypography>
                    </MDBox>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <MDBox textAlign="center">
                      <MDTypography variant="h6" color="text" mb={1}>
                        💸 Total Invested
                      </MDTypography>
                      <MDTypography variant="h4" color="info" fontWeight="bold">
                        {formatCurrency(portfolio.totalInvested, 'EUR')}
                      </MDTypography>
                      <MDTypography variant="caption" color="text">
                        Initial capital invested
                      </MDTypography>
                    </MDBox>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <MDBox textAlign="center">
                      <MDTypography variant="h6" color="text" mb={1}>
                        📈 Total Return
                      </MDTypography>
                      <MDTypography variant="h4" color="success" fontWeight="bold">
                        +{formatCurrency(portfolio.totalReturn, 'EUR')}
                      </MDTypography>
                      <MDTypography variant="caption" color="text">
                        Total gains realized
                      </MDTypography>
                    </MDBox>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <MDBox textAlign="center">
                      <MDTypography variant="h6" color="text" mb={1}>
                        🎯 Return Rate
                      </MDTypography>
                      <MDTypography variant="h4" color="success" fontWeight="bold">
                        +{portfolio.returnRate?.toFixed(2)}%
                      </MDTypography>
                      <MDTypography variant="caption" color="text">
                        Average return rate
                      </MDTypography>
                    </MDBox>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>

          {/* Mes propriétés */}
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h5" fontWeight="bold" mb={3} color="customBlue">
                  📦 My Properties
                </MDTypography>
                
                <Grid container spacing={3}>
                  {portfolio.properties?.map((property, index) => (
                    <Grid item xs={12} md={6} lg={4} key={property.id}>
                      <MDBox mt={3}>
                        <InvestmentCard
                          image={getDefaultImage(index)}
                          title={property.name}
                          location={property.location}
                          investedAmount={property.investedAmount}
                          currentValue={property.currentValue}
                          returnAmount={property.return}
                          returnRate={property.returnRate}
                          blocks={property.blocks}
                          ownership={property.ownership}
                          status={property.status}
                          link={`/properties/${property.id}`}
                        />
                        <MDBox mt={1} display="flex" justifyContent="space-between" alignItems="center">
                          <MDTypography variant="caption" color="text">
                            {getTransactionCount(property.id)} transactions
                          </MDTypography>
                          <MDButton
                            size="small"
                            color={selectedProperty === property.id ? "customBlue" : "info"}
                            variant={selectedProperty === property.id ? "contained" : "outlined"}
                            onClick={() => setSelectedProperty(selectedProperty === property.id ? null : property.id)}
                          >
                            {selectedProperty === property.id ? "Show All" : "Filter"}
                          </MDButton>
                        </MDBox>
                      </MDBox>
                    </Grid>
                  ))}
                </Grid>
              </MDBox>
            </Card>
          </Grid>

          {/* Transactions récentes */}
          <Grid item xs={12}>
            <InvestmentTransactionsList
              transactions={getFilteredTransactions()}
              selectedProperty={selectedProperty}
              onClearFilter={() => setSelectedProperty(null)}
            />
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default InvestorDashboard; 