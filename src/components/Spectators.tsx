import React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  margin: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

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
    <Box>
      Spectators:
      <Stack sx={{ padding: '.5em', display: 'flex', alignItems: 'center', width: '50%', flexDirection: { xs: 'column', lg: 'row' } }}>
        {spectators.length > 0
          ? spectators.map(
            (spectator: { name: string; id: string }, idx: number) => {
              return <><Item key={`${spectator.id}${idx}`}>
                {spectator.name}
                <Button disabled={!playerStatus || gameStatus !== 'end'} onClick={() => swapPlayer(spectator.name)}>swap</Button>
              </Item></>
            }
          )
          : "no spectators"}
      </Stack></Box>
  );
}
