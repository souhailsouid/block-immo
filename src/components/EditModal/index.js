import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';;
import MDBox from 'components/MDBox';

const EditModal = ({ open, onClose, title, children}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold" color="dark">
            {title}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: 'grey.500',
              '&:hover': {
                color: 'grey.700',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ pb: 2 }}>
        <MDBox>
          {children}
        </MDBox>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal; 