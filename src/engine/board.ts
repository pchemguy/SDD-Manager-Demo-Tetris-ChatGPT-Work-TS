/** Board collision, atomic detached placement, and stable simultaneous row compaction. */
import type { Board, Kind, Point } from "./types";
/** Allocate independent empty rows; mutating a returned board never affects another allocation. */
export function emptyBoard(): Board {
  return Array.from({ length: 20 }, () => Array<Kind | null>(10).fill(null));
}
/** Check only occupied cells, requiring integral coordinates inside the playable rectangle. */
export function fits(board: Board, occupied: readonly Point[]): boolean {
  return occupied.every(
    ({ x, y }) =>
      Number.isInteger(x) &&
      Number.isInteger(y) &&
      x >= 0 &&
      x < 10 &&
      y >= 0 &&
      y < 20 &&
      board[y]?.[x] === null,
  );
}
/** Return a detached legal placement; throw RangeError before modifying either board on collision. */
export function place(
  board: Board,
  occupied: readonly Point[],
  kind: Kind,
): Board {
  if (!fits(board, occupied))
    throw new RangeError("Piece placement overlaps or exceeds the board");
  const result = board.map((row) => [...row]);
  for (const { x, y } of occupied) result[y]![x] = kind;
  return result;
}
/** Remove all full rows together, preserve surviving order, and prepend empty rows. */
export function clearRows(board: Board): { board: Board; cleared: number } {
  const remaining = board
    .filter((row) => row.some((cell) => cell === null))
    .map((row) => [...row]);
  const cleared = 20 - remaining.length;
  return {
    board: [
      ...Array.from({ length: cleared }, () =>
        Array<Kind | null>(10).fill(null),
      ),
      ...remaining,
    ],
    cleared,
  };
}
