import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

interface Props {
  spectators: Array<{
    name: string;
    id: string;
  }>,
  playerStatus: boolean,
  gameStatus: string,
  swapPlayer: (name: string) => void,
}

export default function Spectators({
  spectators,
  swapPlayer,
  playerStatus,
  gameStatus,
}: Props): React.ReactElement<Props> {

 

  return (
    <Box sx={{ padding: '.5em', display: 'flex', alignItems: 'center', flexDirection: {xs: 'column', lg: 'row'}}}>
      Spectators:
      {spectators.length > 0
        ? spectators.map(
            (spectator: { name: string; id: string }, idx: number) => {
              return <span key={`${spectator.id}${idx}`}> 
              {spectator.name} 
              <Button disabled={!playerStatus || gameStatus !=='end'} onClick={() => swapPlayer(spectator.name)}>swap</Button>
              </span>;
            }
          )
        : "no spectators"}
    </Box>
  );
}
