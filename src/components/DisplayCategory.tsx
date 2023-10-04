import { Box, Typography, Button } from "@mui/material";

interface Props {
  category: string;
  getCategory: () => void;
  gameStatus: string;
}

export default function DisplayCategory({ category, getCategory, gameStatus }: Props) {
  return gameStatus === "ready" ? (
    <Box>
      <Box>
        <Typography variant="body1">Category: {category} </Typography>
      </Box>
      <Box>
        <Button onClick={getCategory}>change</Button>
      </Box>
    </Box>
  ) : <></>;
}
