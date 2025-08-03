import React from 'react';
import { useRole } from 'context/RoleContext';

// Material Dashboard 3 PRO React components
import MDBadge from 'components/MDBadge';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

const UserRoleBadge = ({ showIcon = true, showLabel = true, size = 'medium' }) => {
  const { userRole, getRoleConfig, loading } = useRole();

  if (loading) {
    return (
      <MDBox display="flex" alignItems="center" gap={1}>
        <MDBadge
          variant="contained"
          color="secondary"
          size={size}
          badgeContent="..."
        />
      </MDBox>
    );
  }

  if (!userRole) {
    return null;
  }

  const roleConfig = getRoleConfig();
  if (!roleConfig) {
    return null;
  }

  return (
    <MDBox display="flex" alignItems="center" gap={1}>
      {showIcon && (
        <MDTypography variant="body2" color="text">
          {roleConfig.icon}
        </MDTypography>
      )}
      
      <MDBadge
        variant="contained"
        color={roleConfig.color}
        size={size}
        badgeContent={showLabel ? roleConfig.label : ''}
        sx={{
          '& .MuiBadge-badge': {
            fontSize: size === 'small' ? '0.7rem' : '0.8rem',
            fontWeight: 600,
            padding: size === 'small' ? '4px 8px' : '6px 12px'
          }
        }}
      />
    </MDBox>
  );
};

export default UserRoleBadge; 