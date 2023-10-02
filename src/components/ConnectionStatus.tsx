
import React from 'react';
import { Typography } from '@mui/material';

interface Props {
  connected: boolean
}

export default function ConnectionStatus ({connected}: Props) {

    return (
        <div data-testid="status-section">
        <Typography variant="h5" color={connected ? "green" : "red"}>
          {connected ? "Connected" : "Not Connected"}
        </Typography>
      </div>
    )
    
}