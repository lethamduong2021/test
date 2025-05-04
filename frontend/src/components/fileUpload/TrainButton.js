import React from 'react';
import { Button } from '@mui/material';

const TrainButton = ({ onClick, disabled, children }) => (
  <Button
    variant="contained"
    color="secondary"
    onClick={onClick}
    sx={{ marginTop: 2 }}
    disabled={disabled}
  >
    {children}
  </Button>
);

export default TrainButton;
