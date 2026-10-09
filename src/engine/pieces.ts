/** Canonical tetromino geometry and centered spawn placement; no board or browser state. */
import type { ActivePiece, Kind, Point } from "./types";
export const KINDS: readonly Kind[] = ["I", "O", "T", "S", "Z", "J", "L"];
const DEFINITIONS: Record<
  Kind,
  { size: number; points: readonly (readonly [number, number])[] }
> = {
  I: {
    size: 4,
    points: [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
    ],
  },
  O: {
    size: 2,
    points: [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ],
  },
  T: {
    size: 3,
    points: [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
  },
  S: {
    size: 3,
    points: [
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
    ],
  },
  Z: {
    size: 3,
    points: [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
  },
  J: {
    size: 3,
    points: [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
  },
  L: {
    size: 3,
    points: [
      [2, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
  },
};
/** Return a new piece at its canonical centered spawn position and orientation. */
export function spawn(kind: Kind): ActivePiece {
  return {
    kind,
    x: Math.floor((10 - DEFINITIONS[kind].size) / 2),
    y: 0,
    orientation: 0,
  };
}
/** Return detached occupied world coordinates. Orientation counts clockwise quarter turns. */
export function cells(piece: ActivePiece): Point[] {
  const d = DEFINITIONS[piece.kind];
  return d.points.map(([initialX, initialY]) => {
    let x = initialX,
      y = initialY;
    if (piece.kind !== "O")
      for (let i = 0; i < ((piece.orientation % 4) + 4) % 4; i++)
        [x, y] = [d.size - 1 - y, x];
    return { x: x + piece.x, y: y + piece.y };
  });
}
