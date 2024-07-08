import React from 'react';
import { Button } from '@mui/material';

export const PrimaryButton = ({ children, ...props }) => (
  <Button
    variant="contained"
    color="primary"
    sx={{
      fontWeight: 'bold',
      padding: '10px 20px',
      fontSize: '1rem',
    }}
    {...props}
  >
    {children}
  </Button>
);

export const SecondaryButton = ({ children, ...props }) => (
  <Button
    variant="outlined"
    color="primary"
    sx={{
      fontWeight: 'bold',
      padding: '10px 20px',
      fontSize: '1rem',
      borderWidth: 2,
    }}
    {...props}
  >
    {children}
  </Button>
);