import { Box, Typography, Button } from "@mui/material";

interface Props {
  category: string;
  getCategory: () => void;
  gameStatus: string;
}

export default function DisplayCategory({ category, getCategory, gameStatus }: Props) {
  return (
    <Box sx={{ textAlign: "center", padding: "1.2em" }}>
      <Box>
        <Typography disabled={gameStatus !== "ready"} component={Button} onClick={getCategory} variant="body1">{category} </Typography>
      </Box>
    </Box>)
    ;
}
