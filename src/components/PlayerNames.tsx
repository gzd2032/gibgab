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
    <Box sx={{display: 'flex', flexDirextion: 'row', justifyContent:{ xs:'space-around', sm:'space-between'} , position: { xs: "relative", sm:"none"}, top: {xs: "-67px", sm:"0"}}}>
        <Typography sx={{ color: beforeColor, typography: { xs: 'body1', sm: 'h6', lg:'h5'}}}>{players[0]?.name}</Typography>
        <Typography sx={{ color: afterColor, typography: { xs: 'body1', sm: 'h6', lg:'h5'}}}>{players[1]?.name}</Typography>
    </Box>
  );
}
