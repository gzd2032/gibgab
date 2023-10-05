
import React from 'react';
import { Typography } from '@mui/material';

interface Props {
  connected: boolean,
  username: string,
}

export default function ConnectionStatus ({connected, username}: Props) {

    return (
        <div data-testid="status-section">
        <Typography sx={{ margin: ".5em"}} variant="h5" color={connected ? "green" : "red"}>
          {connected ? `Connected - ${username}` : "Not Connected"}
        </Typography>
      </div>
    )
    
}