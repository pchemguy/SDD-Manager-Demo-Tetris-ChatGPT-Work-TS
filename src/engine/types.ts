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
  | "hardDrop"
  | "hold"
  | "pause"
  | "resume"
  | "restart";
/** Detached observation. Ghost retains paused geometry; hold eligibility includes lifecycle state. */
export interface Snapshot {
  status: Status;
  board: Board;
  active: (ActivePiece & { cells: Point[] }) | null;
  /** First-obstruction landing cells, null exactly when active is absent. */
  ghost: Point[] | null;
  held: Kind | null;
  /** Running, active and unused since the last successful lock/successor spawn. */
  canHold: boolean;
  next: Kind;
  score: number;
  lines: number;
  level: number;
  gravityInterval: number;
}
