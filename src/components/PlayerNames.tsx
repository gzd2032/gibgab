import React from "react";
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";

interface Props {
  players: {
    name: string,
    id: string
  }[],
  afterColor: string,
  beforeColor: string,
};

export default function PlayerNames({players, afterColor, beforeColor}: Props): React.ReactElement {
  return (
    <Box sx={{display: 'flex', flexDirextion: 'row', width: '100%', justifyContent:'space-between'}}>
      <Box sx={{color: beforeColor}}>
        <Typography variant="body1" sx={{ typography: { xs: '1em', lg: 'h4'}}}>{players[0]?.name}</Typography>
      </Box>
      <div></div>
      <Box sx={{ color: afterColor}}>
        <Typography variant="body1" sx={{ typography: { xs: '1em', lg: 'h4'}}}>{players[1]?.name}</Typography>
      </Box>
    </Box>
  );
}
