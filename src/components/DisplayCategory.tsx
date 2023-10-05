import { Box, Typography, Button } from "@mui/material";

interface Props {
  category: string;
  getCategory: () => void;
  gameStatus: string;
  playerStatus: boolean;
}

export default function DisplayCategory({ category, getCategory, gameStatus, playerStatus }: Props) {
  return (
    <Box sx={{ textAlign: "center", padding: ".5em" }}>
      <Box>
        <Typography disabled={!playerStatus || gameStatus !== "ready"} component={Button} onClick={getCategory} variant="body1">{category} </Typography>
      </Box>
    </Box>)
    ;
}
