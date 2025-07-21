import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function InputFileUpload({ label, onChange }) {
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
          tabIndex={-1}
          sx={{
            backgroundColor: '#4472c4',
            color: '#fff',
            borderRadius: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#3a5f9e',
            },
          }}
     
    >
      {label}
      <VisuallyHiddenInput
        type="file"
        onChange={onChange}
        multiple
      />
    </Button>
  );
}
