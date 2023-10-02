import {
  render,
  screen,
  cleanup,
  act,
  fireEvent,
} from "@testing-library/react";
import App from "./App";


interface EventItem { 
  [event: string]: {(): void}[]
}

interface Player {name: string, id: string}

const EVENTS: EventItem = {};

function emit(event: string, ...args: Array<string | any>): void {
  if(EVENTS[event]) EVENTS[event].forEach((func: (...args: Array<string>) => void) => func(...args));
}

const socket = {
  on(event: string, func: () => void) {
    if (EVENTS[event]) {
      return EVENTS[event].push(func);
    }
    EVENTS[event] = [func];
  },
  off(event: string, func: () => void) {
    return;
  },
  connect(event: string, func: () => void) {
    emit("connect");
  },
  emit,
};

jest.mock("socket.io-client", () => {
  return {
    io: () => {
      return socket;
    },
  };
});

describe("display elements", () => {
  it("should display the title", () => {
    render(<App />);
    const linkElement = screen.getByText(/Gibgab online!/i);
    expect(linkElement).toBeInTheDocument();
  });

  it("should have a connect button", () => {
    render(<App />);
    const btnElement = screen.getByRole("button", { name: "Connect" });
    expect(btnElement).toBeInTheDocument();
  });

  it("should have a disconnect button", () => {
    render(<App />);
    const btnElement = screen.getByRole("button", { name: "Disconnect" });
    expect(btnElement).toBeInTheDocument();
  });

  it("should have an username input element", () => {
    render(<App />);
    const inputElement = screen.getByRole("textbox", { name: /username/i });
    expect(inputElement).toBeInTheDocument();
  });
});

describe("socket functions", () => {

  const player1 = {
    name: "bill",
    id: "3d33d"
  }

  const player2 = {
    name: "john",
    id: "d229"
  }

  afterEach(cleanup);

  it("should start disconnected", () => {
    render(<App />);
    socket.emit("disconnect");
    const heading = screen.getByRole('heading', { name: /Not Connected/i});
    expect(heading).toBeInTheDocument();

  });

  it("should show connected when Connect button is clicked", () => {
    render(<App />);
    const connectBtn = screen.getByRole("button", { name: "Connect" });
    const userInput = screen.getByRole("textbox", { name: "username" });
    act(() => {
      fireEvent.change(userInput, { target: { value: player1.name } });
      connectBtn.click();
      socket.emit("players", [player1]);
      socket.emit("game", "hello world");
    });
    const connectMsg = screen.getByTestId("status-section");
    expect(connectMsg).toBeInTheDocument();
    const message = screen.getByRole("heading", { name: "hello world" });
    expect(message).toBeInTheDocument();
  });

  it("should show null button after connecting", () => {
    render(<App />);
    const connectBtn = screen.getByRole("button", { name: "Connect" });
    const userInput = screen.getByRole("textbox", { name: "username" });
    act(() => {
      fireEvent.change(userInput, { target: { value: player1.name } });
      connectBtn.click();
    });
    const startBtn = screen.getByRole('button', {name: /wait/i})
    expect(startBtn).toBeInTheDocument();
  });

  it("should start a game when the server emits 'start game'", () => {
    render(<App />);
    const connectBtn = screen.getByRole("button", { name: "Connect" });
    const userInput = screen.getByRole("textbox", { name: "username" });
    act(() => {
      fireEvent.change(userInput, { target: { value: player1.name  } });
      connectBtn.click();
      socket.emit("game start", "ready to go")
    });
    const startBtn = screen.queryByRole('button', {name: /start/i});
    const readyMsg = screen.getByRole('heading', {name: /ready to go/i});
    expect(startBtn).not.toBeInTheDocument();
    expect(readyMsg).toBeInTheDocument();
  });

  it("should change users when notified by the server", () => {
    render(<App />);
    const connectBtn = screen.getByRole("button", { name: "Connect" });
    const userInput = screen.getByRole("textbox", { name: "username" });
    act(() => {
      fireEvent.change(userInput, { target: { value: player1.name  } });
      connectBtn.click();
      const players: Player[] = [player1, player2]
      socket.emit("players", players);
      socket.emit("game start", "Go!")
      socket.emit("game turn", player1.name);

    });
    const playerName = screen.getByRole('heading', {name: `Turn: ${player1.name}`});
    expect(playerName).toBeInTheDocument();
  });
});
