// @mui material components
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';

const MDNavTabs = ({ tabs, activeTab, setActiveTab, activeTabColor = '#4472c4' }) => {
  const handleTabType = (_event, newValue) => setActiveTab(newValue);
  return (
    <Container>
      <Grid container item justifyContent="center" xs={12} lg={4}>
        <AppBar position="static">
          <Tabs 
            value={activeTab} 
            onChange={handleTabType} 
            sx={{ 
              backgroundColor: '#fff',
              borderRadius: '10px',
              '& .MuiTabs-indicator': {
                display: 'none', // Cache l'indicateur par défaut
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab 
                key={index} 
                label={tab.label}
                sx={{
                  backgroundColor: activeTab === index ? activeTabColor : 'transparent',
                  fontWeight: activeTab === index ? 'bold' : 'normal',
                  color: activeTab === index ? '#fff !important' : '#666',
                  borderRadius: activeTab === index ? '8px' : '0px',
                  margin: '4px',
                  minHeight: '40px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: activeTab === index ? '#5a7fd4' : '#e8f0ff',
                    color: activeTab === index ? '#fff !important' : '#4472c4',
                    borderRadius: '8px' 
                  },
                  '&.Mui-selected': {
                    color: '#fff !important',
                    backgroundColor: activeTabColor,
                  },
                }} 
              />
            ))}
          </Tabs>
        </AppBar>
      </Grid>
    </Container>
  );
};

MDNavTabs.propTypes = {
  tabs: PropTypes.array.isRequired,
  activeTab: PropTypes.number.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  activeTabColor: PropTypes.string,
};

export default MDNavTabs;
