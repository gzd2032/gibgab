import React, { useMemo } from "react";
import { Button, Box } from "@mui/material";

interface Props {
  playersName: string;
  isTurn: boolean;
  playerStatus: boolean;
  gameStatus: string;
  username: string;
  playerPosition: string;
  startGame: () => void;
  changeTurn: () => void;
  resetGame: () => void;
  delayBtn: boolean;
}

const PlayersButtons = ({
  playersName,
  isTurn,
  playerStatus,
  username,
  gameStatus,
  playerPosition,
  startGame,
  changeTurn,
  resetGame,
  delayBtn,
}: Props): React.ReactElement => {
  const btnStyle = {
    borderRadius: "50%",
    height: "4em",
  };

  const StartButton = (): React.ReactElement => {
    return (
      <Button
        variant="contained"
        style={btnStyle}
        onClick={startGame}
        disabled={playersName !== username}
      >
        {playersName?.slice(0, 3)}
      </Button>
    );
  };

  const ResetButton = (): React.ReactElement => {
    return (
      <Button disabled={delayBtn} onClick={resetGame}>
        Rematch
      </Button>
    );
  };

  const PlayButton = (): React.ReactElement => {
    return (
      <Button variant="contained" style={btnStyle} onClick={changeTurn}>
        {playersName?.slice(0, 3)}
      </Button>
    );
  };

  const NullButton = (): React.ReactElement => {
    return (
      <Button variant="contained" disabled={true} style={btnStyle}>
        {playersName?.slice(0, 3)}
      </Button>
    );
  };

  type Lookup = { [status: string]: () => React.ReactElement };

  const lookup: Lookup = {
    ready: StartButton,
    end: ResetButton,
    play: PlayButton,
    null: NullButton,
  };

  const setMode: keyof Lookup = useMemo((): string => {
    if (!playerStatus) return "null";
    if (playersName !== username) return "ready";

    if (gameStatus === "ready") return gameStatus;
    if (gameStatus === "end") return gameStatus;
    if (isTurn) return "null";

    return "play";
  }, [gameStatus, playerStatus, isTurn, playersName, username]);

  const DisplayButton: () => React.ReactElement = lookup[setMode];
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: playerPosition }}>
        <DisplayButton />
      </Box>
    </>
  );
};

export default PlayersButtons;
