import React, { ReactElement } from "react";
import { Stack, Typography, Box } from "@mui/material";

interface Props {
  gameMessage: string;
  subMessage: string;
  children: React.ReactElement;
}

export default function GameBoard({
  gameMessage,
  subMessage,
  children,
}: Props): ReactElement {
  return (
    <Stack direction="column" spacing={0} alignItems="center">
      <Typography
        variant="h4"
        sx={{ typography: { lg: "h4", sm: "body1", xs: "h6" } }}
      >
        {gameMessage}
      </Typography>
      <Typography
        variant="h6"
        sx={{ typography: { lg: "h6", sm: "body1", xs: "h6" } }}
      >
        : {subMessage} :
      </Typography>
      <Box>{children}</Box>
    </Stack>
  );
}
