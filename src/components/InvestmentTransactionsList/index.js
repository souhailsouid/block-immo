import { useMemo } from 'react';

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Custom components
import InvestmentTransaction from "components/InvestmentTransaction";

const InvestmentTransactionsList = ({ transactions, selectedProperty, onClearFilter }) => {
  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let groupKey;
      if (date.toDateString() === today.toDateString()) {
        groupKey = 'today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = 'yesterday';
      } else {
        groupKey = 'older';
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(transaction);
    });
    
    // Sort transactions within each group by date (newest first)
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => new Date(b.date) - new Date(a.date));
    });
    
    return groups;
  }, [transactions]);

  const getGroupTitle = (key) => {
    switch (key) {
      case 'today':
        return 'Today';
      case 'yesterday':
        return 'Yesterday';
      case 'older':
        return 'Earlier';
      default:
        return key;
    }
  };

  const getTransactionIcon = (type) => {
    return type === 'BUY' ? 'add' : 'remove';
  };

  const getTransactionColor = (type) => {
    return type === 'BUY' ? 'error' : 'success';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Investment Transactions
        </MDTypography>
        <MDBox display="flex" alignItems="flex-start">
          <MDBox color="text" mr={0.5} lineHeight={0}>
            <Icon color="inherit" fontSize="small">
              date_range
            </Icon>
          </MDBox>
          <MDTypography variant="button" color="text" fontWeight="regular">
            {selectedProperty ? 'Filtered' : 'All Properties'}
          </MDTypography>
        </MDBox>
      </MDBox>
      
      {selectedProperty && (
        <MDBox px={2} pb={1}>
          <MDButton
            size="small"
            color="info"
            variant="outlined"
            onClick={onClearFilter}
          >
            Clear Filter
          </MDButton>
        </MDBox>
      )}
      
      <MDBox pt={3} pb={2} px={2}>
        {Object.keys(groupedTransactions).length > 0 ? (
          Object.entries(groupedTransactions).map(([groupKey, groupTransactions]) => (
            <MDBox key={groupKey}>
              <MDBox mb={2}>
                <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
                  {getGroupTitle(groupKey)}
                </MDTypography>
              </MDBox>
              <MDBox
                component="ul"
                display="flex"
                flexDirection="column"
                p={0}
                m={0}
                sx={{ listStyle: "none" }}
              >
                {groupTransactions.map((transaction) => (
                  <InvestmentTransaction
                    key={transaction.id}
                    color={getTransactionColor(transaction.type)}
                    icon={getTransactionIcon(transaction.type)}
                    propertyName={transaction.property}
                    description={formatDate(transaction.date)}
                    value={`${transaction.type === 'BUY' ? '-' : '+'} €${transaction.amount.toLocaleString()}`}
                    blocks={transaction.blocks}
                    status={transaction.status}
                  />
                ))}
              </MDBox>
            </MDBox>
          ))
        ) : (
          <MDBox textAlign="center" py={4}>
            <Icon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }}>
              receipt_long
            </Icon>
            <MDTypography variant="h6" color="text" mb={1}>
              {selectedProperty ? 'No transactions for this property' : 'No transactions'}
            </MDTypography>
            <MDTypography variant="body2" color="text">
              {selectedProperty 
                ? 'No transactions found for the selected property.' 
                : 'You haven\'t made any investments yet.'
              }
            </MDTypography>
          </MDBox>
        )}
      </MDBox>
    </Card>
  );
}

export default InvestmentTransactionsList; 