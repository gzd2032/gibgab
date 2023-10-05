import { useMemo, useState, useEffect, useCallback } from "react";
import { Typography, Card, Box, CssBaseline, Stack } from "@mui/material";
import { socket } from "./socket/socket";

import GameBoard from "./components/GameBoard";
import GameLights from "./components/GameLights";
import Spectators from "./components/Spectators";
import PlayerNames from "./components/PlayerNames";
import ConnectionStatus from "./components/ConnectionStatus";
import PlayersButtons from "./components/PlayersButtons";
import DisplayCategory from "./components/DisplayCategory";
import ConnectionButtons from "./components/ConnectionButtons";
import "./App.css";

interface Player {
  name: string;
  id: string;
}

function App() {
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState("");
  const [selectedTime, setSelectedTime] = useState(0);
  const [gameMessage, setGameMessage] = useState("");

  const [subMessage, setSubMessage] = useState("");
  const [playerStatus, setPlayerStatus] = useState(false);
  const [playerPosition, setPlayerPosition] = useState("center");
  const [gameSpeed, setGameSpeed] = useState("med");
  const [gameStatus, setGameStatus] = useState("pending");
  const [category, setCategory] = useState("");

  const [players, setPlayers] = useState<Player[]>([]);
  const [spectators, setSpectators] = useState<Player[]>([]);
  const [delayBtn, setDelayBtn] = useState(true);

  const BOARDSIZE: number = 6;
  const highlightedSpace: number = selectedTime + Math.ceil(BOARDSIZE);
  const beforeColor: string = "#2a9d8f";
  const afterColor: string = "#f4a261";
  const highlightColor: string = "#264653";

  useEffect(() => {
    const onConnect = () => {
      setConnected(true);
    };

    const onDisconnect = () => {
      setConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    const gameStart = (msg: string): void => {
      setGameMessage(msg);
      setGameStatus("playing");
      setDelayBtn(true);
    };

    const gameTick = (msg: number) => {
      if (typeof msg === "number") setSelectedTime(msg);
    };

    const gameAction = (msg: string): void => {
      if (typeof msg === "string") setGameMessage(msg);
    };

    const gamePending = (): void => {
      setGameMessage("Need 1 more to play!!");
    };

    const gameReady = (): void => {
      setGameMessage("Ready to Play!!");
      setGameStatus("ready");
      setCategory("click here for a category");
    };

    const gameSubMessage = (msg: string): void => {
      setSubMessage(msg);
    };

    const gameEnd = (msg: string): void => {
      setGameMessage(msg);
      setGameStatus("end");
      setSubMessage("");
      setTimeout((): void => {
        setDelayBtn(false);
      }, 2000);
    };

    const loadPlayers = (players: Player[]): void => {
      setPlayers(players);
      if (players.find((player: Player): boolean => player.name === username)) {
        setPlayerPosition(
          Boolean(players.map((player) => player.name).indexOf(username))
            ? "flex-end"
            : "flex-start"
        );
        setPlayerStatus(true);
      } else {
        setPlayerPosition("center");
        setPlayerStatus(false);
        setGameMessage("Spectating!");
      }
    };

    const loadSpectators = (
      spectators: Array<{ name: string; id: string }>
    ) => {
      setSpectators(spectators);
    };

    const loadCategory = (msg: string) => {
      setCategory(msg);
    };

    const gameReset = () => {
      setGameMessage("Ready to Start!");
      setGameStatus("ready");
      setSelectedTime(0);
      setSubMessage("");
    };

    socket.on("game start", gameStart);
    socket.on("game", gameAction);
    socket.on("game tick", gameTick);
    socket.on("players", loadPlayers);
    socket.on("spectators", loadSpectators);
    socket.on("game end", gameEnd);
    socket.on("game submessage", gameSubMessage);
    socket.on("game reset", gameReset);
    socket.on("game pending", gamePending);
    socket.on("category", loadCategory);
    socket.on("game ready", gameReady);

    return () => {
      socket.off("game start", gameStart);
      socket.off("game", gameAction);
      socket.on("game tick", gameTick);
      socket.off("players", loadPlayers);
      socket.off("spectators", loadSpectators);
      socket.off("game end", gameEnd);
      socket.off("game submessage", gameSubMessage);
      socket.off("game reset", gameReset);
      socket.off("game pending", gamePending);
      socket.off("category", loadCategory);
      socket.off("game ready", gameReady);
    };
  }, [gameStatus, username, playerStatus, spectators]);

  const connect = (username: string) => {
    if (username === "") return alert("Please enter a username");

    if (!connected) {
      socket.connect();
      socket.emit("join user", username);
    }
  };

  const disconnect = () => {
    socket.disconnect();
  };

  const startGame = useCallback(() => {
    if (category === "click here for a category") {
      alert("select a category");
    } else {
      socket.emit("game start", username, BOARDSIZE);
    }
  }, [username, BOARDSIZE, category]);

  const resetGame = useCallback(() => {
    socket.emit("game reset");
  }, []);

  const changeTurn = useCallback(() => {
    socket.emit("turn", username);
  }, [username]);

  const memoPlayerNames = useMemo(() => {
    return (
      <PlayerNames
        players={players}
        afterColor={afterColor}
        beforeColor={beforeColor}
      />
    );
  }, [players]);

  const memoPlayer1Buttons = useMemo(() => {
    return (
      <PlayersButtons
        playersName={players[0]?.name}
        isTurn={subMessage !== username}
        username={username}
        playerStatus={playerStatus}
        gameStatus={gameStatus}
        playerPosition={playerPosition}
        startGame={startGame}
        changeTurn={changeTurn}
        resetGame={resetGame}
        delayBtn={delayBtn}
        btncolor={beforeColor}
      />
    );
  }, [
    subMessage,
    username,
    playerStatus,
    gameStatus,
    playerPosition,
    players,
    changeTurn,
    resetGame,
    startGame,
    delayBtn,
  ]);

  const memoPlayer2Buttons = useMemo(() => {
    return (
      <PlayersButtons
        playersName={players[1]?.name}
        isTurn={subMessage !== username}
        playerStatus={playerStatus}
        username={username}
        gameStatus={gameStatus}
        playerPosition={playerPosition}
        startGame={startGame}
        changeTurn={changeTurn}
        resetGame={resetGame}
        delayBtn={delayBtn}
        btncolor={afterColor}
      />
    );
  }, [
    subMessage,
    username,
    playerStatus,
    gameStatus,
    playerPosition,
    players,
    changeTurn,
    resetGame,
    startGame,
    delayBtn,
  ]);

  const getCategory = useCallback(() => {
    socket.emit("game category");
  }, []);

  const swapPlayer = (newPlayerID: string): void => {
    socket.emit("swap", newPlayerID, username);
  };

  const changeSpeed = (): void => {
    setGameSpeed(prev => {
      let newSpeed = 'low';
      if (prev === 'med') newSpeed = 'high'
      if (prev === 'low') newSpeed = 'med'
      return newSpeed;
    } )
  }

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
          padding: "1em",
          background: "#F3F6F9",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <ConnectionButtons
            connected={connected}
            username={username}
            disconnect={disconnect}
            connect={connect}
            setUsername={setUsername}
          />
          {connected && <Typography variant="h6">Gibgab online!</Typography>}
        </Stack>
        <ConnectionStatus connected={connected} username={username} />
        <Card
          sx={{
            width: { lg: "60vw", xs: "95vw" },
            minHeight: { lg: "40vh", xs: "30vh" },
            margin: ".5em",
            display: "flex",
            padding: "1em",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          {connected ? (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <GameBoard gameSpeed={gameSpeed} changeSpeed={changeSpeed} gameMessage={gameMessage} subMessage={subMessage}>
                <>
                  <DisplayCategory
                    category={category}
                    getCategory={getCategory}
                    gameStatus={gameStatus}
                    playerStatus={playerStatus}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: "center",
                    }}
                  >
                    {memoPlayer1Buttons}
                    <GameLights
                      BOARDSIZE={BOARDSIZE}
                      highlightedSpace={highlightedSpace}
                      afterColor={afterColor}
                      beforeColor={beforeColor}
                      highlightColor={highlightColor}
                    />
                    {memoPlayer2Buttons}
                  </Box>
                </>
              </GameBoard>
              {memoPlayerNames}
              <Spectators
                spectators={spectators}
                swapPlayer={swapPlayer}
                playerStatus={playerStatus}
                gameStatus={gameStatus}
              />
            </Box>
          ) : (
            "not connected to server"
          )}
        </Card>
      </Box>
    </>
  );
}

export default App;
