import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  Button,
  TextField,
  Typography,
  ButtonGroup,
  Card,
  Box,
  CssBaseline,
} from "@mui/material";
import { socket } from "./socket/socket";

import GameBoard from "./components/GameBoard";
import GameLights from "./components/GameLights";
import Spectators from "./components/Spectators";
import PlayerNames from "./components/PlayerNames";
import ConnectionStatus from "./components/ConnectionStatus";
import "./App.css";
import PlayersButtons from "./components/PlayersButtons";

interface Player {
  name: string;
  id: string;
}

function App() {
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState("");
  const [selectedTime, setSelectedTime] = useState(0);
  const [gameMessage, setGameMessage] = useState("");

  const [activeTurn, setActiveTurn] = useState("");
  const [playerStatus, setPlayerStatus] = useState(false);
  const [playerPosition, setPlayerPosition] = useState("center");

  const [gameStatus, setGameStatus] = useState("pending");

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
    };

    const gameTurn = (msg: string): void => {
      setActiveTurn(msg);
    };

    const gameEnd = (msg: string): void => {
      setGameMessage(msg);
      setGameStatus("end");
      setActiveTurn("");
      setTimeout((): void => {
        setDelayBtn(false);
      }, 3000);
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

    const gameReset = () => {
      setGameMessage("Ready to Start!");
      setGameStatus("ready");
      setSelectedTime(0);
      setActiveTurn("");
    };

    socket.on("game start", gameStart);
    socket.on("game", gameAction);
    socket.on("game tick", gameTick);
    socket.on("players", loadPlayers);
    socket.on("spectators", loadSpectators);
    socket.on("game end", gameEnd);
    socket.on("game turn", gameTurn);
    socket.on("game reset", gameReset);
    socket.on("game pending", gamePending);
    socket.on("game ready", gameReady);

    return () => {
      socket.off("game start", gameStart);
      socket.off("game", gameAction);
      socket.on("game tick", gameTick);
      socket.off("players", loadPlayers);
      socket.off("spectators", loadSpectators);
      socket.off("game end", gameEnd);
      socket.off("game turn", gameTurn);
      socket.off("game reset", gameReset);
      socket.off("game pending", gamePending);
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
    socket.emit("game start", username, BOARDSIZE);
  }, [username, BOARDSIZE]);

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
        isTurn={activeTurn !== username}
        username={username}
        playerStatus={playerStatus}
        gameStatus={gameStatus}
        playerPosition={playerPosition}
        startGame={startGame}
        changeTurn={changeTurn}
        resetGame={resetGame}
        delayBtn={delayBtn}
      />
    );
  }, [activeTurn, username, playerStatus, gameStatus, playerPosition, players, changeTurn, resetGame, startGame, delayBtn]);


  const memoPlayer2Buttons = useMemo(() => {
    return (
      <PlayersButtons
        playersName={players[1]?.name}
        isTurn={activeTurn !== username}
        playerStatus={playerStatus}
        username={username}
        gameStatus={gameStatus}
        playerPosition={playerPosition}
        startGame={startGame}
        changeTurn={changeTurn}
        resetGame={resetGame}
        delayBtn={delayBtn}
      />
    );
  }, [activeTurn, username, playerStatus, gameStatus, playerPosition, players, changeTurn, resetGame, startGame, delayBtn]);

  const swapPlayer = (newPlayerID: string): void => {
    socket.emit("swap", newPlayerID, username);
  };

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
        <Typography variant="h2">Gibgab online!</Typography>
        <ConnectionStatus connected={connected} />
        <Card
          sx={{
            width: "70vw",
            height: "50vh",
            margin: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          {connected ? (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {memoPlayerNames}
              <GameBoard gameMessage={gameMessage} activeTurn={activeTurn}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
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
              </GameBoard>
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

        {!connected ? (
          <TextField
            id="username"
            label="username"
            variant="outlined"
            value={username}
            placeholder="Enter Username"
            style={{ margin: "10px" }}
            onChange={(e) => setUsername(e.target.value)}
          />
        ) : (
          <Typography variant="h6">User: {username}</Typography>
        )}

        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button
            disabled={connected ? true : false}
            onClick={() => connect(username)}
          >
            Connect
          </Button>
          <Button disabled={!connected ? true : false} onClick={disconnect}>
            Disconnect
          </Button>
        </ButtonGroup>
      </Box>
    </>
  );
}

export default App;
