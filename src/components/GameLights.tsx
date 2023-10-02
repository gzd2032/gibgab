import React from "react";
import Card from "@mui/material/Card";

interface Props {
  BOARDSIZE: number;
  highlightedSpace: number;
  afterColor: string;
  beforeColor: string;
  highlightColor: string;
}

export default function GameLights({
  BOARDSIZE,
  highlightedSpace,
  afterColor,
  beforeColor,
  highlightColor,
}: Props): React.ReactElement {
  const spaces: Array<number> = new Array(BOARDSIZE * 2 + 1).fill("  ᎒  ");
  const highlightImage = "🔵";

  return (
    <Card sx={{height: '2.5em', display: 'flex', alignItems: 'center'}}>
      {spaces.map(
        (space: number, boardLocation: number): React.ReactElement => {
          const reactKeyValue: string = `${space}${boardLocation}`;
          const isHighlightedSpace: boolean =
            boardLocation === highlightedSpace;
          const isBeforeHighlightedSpace: boolean =
            boardLocation < highlightedSpace;
          let backgroundColor: string = isBeforeHighlightedSpace
            ? beforeColor
            : afterColor;
          if (isHighlightedSpace) backgroundColor = highlightColor;

          return (
            <span
              style={{
                padding: "10px",
                background: "white",
                color: backgroundColor,
              }}
              key={reactKeyValue}
            >
              {isHighlightedSpace ? highlightImage : space}
            </span>
          );
        }
      )}
    </Card>
  );
}
