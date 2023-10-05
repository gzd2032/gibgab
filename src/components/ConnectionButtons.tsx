import { useMemo } from "react";
import { Button, TextField, Typography, Stack } from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

interface Props {
  connected: boolean;
  username: string;
  disconnect: () => void;
  connect: (username: string) => void;
  setUsername: (name: string) => void;
}

export default function ConnectionButtons({
  connected,
  username,
  disconnect,
  connect,
  setUsername,
}: Props) {
  const connectButton = useMemo(() => {
    return (
      <Button
        disabled={connected ? true : false}
        onClick={() => connect(username)}
        variant="contained"
      >
        Connect
      </Button>
    );
  }, [connected, connect, username]);

  const disconnectButton = useMemo(() => {
    return (
      <Button
        disabled={!connected ? true : false}
        onClick={disconnect}
        sx={{ color: "green" }}
      >
        <PowerSettingsNewIcon />
      </Button>
    );
  }, [connected, disconnect]);

  return (
    <Stack direction="column" spacing={1}>
      {!connected && (
        <Typography
          sx={{ typography: { md: "h5", sm: "overline", xs: "caption" } }}
        >
          Welcome to Gibgab online!
        </Typography>
      )}
      <Stack direction="row" spacing={1} alignItems="center">
        {!connected && (
          <TextField
            id="username"
            label="username"
            variant="outlined"
            value={username}
            placeholder="Enter Username"
            style={{ marginTop: ".5em" }}
            inputProps={{ maxLength: 10 }}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}

        {!connected ? connectButton : disconnectButton}
      </Stack>
    </Stack>
  );
}
