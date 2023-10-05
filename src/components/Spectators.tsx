import React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { Typography } from "@mui/material";

const Item = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  margin: theme.spacing(0.5),
  textAlign: "center",
  color: theme.palette.text.primary,
}));

interface Props {
  spectators: Array<{
    name: string;
    id: string;
  }>;
  playerStatus: boolean;
  gameStatus: string;
  swapPlayer: (name: string) => void;
}

export default function Spectators({
  spectators,
  swapPlayer,
  playerStatus,
  gameStatus,
}: Props): React.ReactElement<Props> {
  return (
    <Box
      sx={{ alignItems: "center", display: "flex", flexDirection: "column" }}
    >
      <Typography variant="h6">Spectators:</Typography>
      <Stack
        direction="row"
        useFlexGap
        flexWrap="wrap"
        alignItems="flex-start"
        sx={{
          height: "25%",
          maxWidth: "400px",
          overflow: "hidden",
          overflowY: "scroll",
        }}
      >
        {spectators.length > 0
          ? spectators.map(
              (spectator: { name: string; id: string }, idx: number) => {
                return (
                  <Item
                    key={`${spectator.id}${idx}`}
                    disabled={!playerStatus || gameStatus !== "end"}
                    onClick={() => swapPlayer(spectator.name)}
                  >
                    {spectator.name}
                    <AutorenewIcon fontSize="small"  />
                  </Item>
                );
              }
            )
          : "no spectators"}
      </Stack>
    </Box>
  );
}
