import React, { ReactElement } from "react";
import { Grid, Typography, Box } from "@mui/material";

interface Props {
  gameMessage: string,
  activeTurn: string,
  children: React.ReactElement
}

export default function GameBoard({
  gameMessage,
  activeTurn,
  children
}: Props): ReactElement {

  return (
    <Grid
      container
      direction="column"
      alignContent="center"
      alignItems="center"
    >
      <Grid item>
        <Typography variant="h4">{gameMessage}</Typography>
        <Typography variant="h6">Turn: {activeTurn}</Typography>
      </Grid>
      <Grid item>
        <Box>
          {children}
        </Box>
      </Grid>
    </Grid>
  );
}
