/** Browser-independent game data. Snapshots are detached values, never live engine storage. */
export type Kind = "I" | "O" | "T" | "S" | "Z" | "J" | "L";
export interface Point {
  x: number;
  y: number;
}
export interface ActivePiece {
  kind: Kind;
  x: number;
  y: number;
  orientation: number;
}
export type Board = (Kind | null)[][];
export type Status = "running" | "paused" | "gameOver";
export type Command =
  | "left"
  | "right"
  | "rotateClockwise"
  | "softDrop"
  | "pause"
  | "resume"
  | "restart";
export interface Snapshot {
  status: Status;
  board: Board;
  active: (ActivePiece & { cells: Point[] }) | null;
  next: Kind;
  score: number;
  lines: number;
  level: number;
  gravityInterval: number;
}
