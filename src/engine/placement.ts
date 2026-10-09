/** Pure placement queries; session transitions and timers remain with Game. */
import { fits } from "./board";
import { cells } from "./pieces";
import type { ActivePiece, Board } from "./types";
/** Return the contiguous legal downward displacement for a fitting active piece. */
export function landingDistance(board: Board, piece: ActivePiece): number {
  let distance = 0;
  while (fits(board, cells({ ...piece, y: piece.y + distance + 1 }))) distance++;
  return distance;
}
/** Return the first fitting clockwise horizontal candidate, or null for O/all failed. */
export function clockwiseCandidate(board: Board, piece: ActivePiece): ActivePiece | null {
  if (piece.kind === "O") return null;
  for (const offset of [0, -1, 1, -2, 2]) {
    const candidate = { ...piece, x: piece.x + offset, orientation: (piece.orientation + 1) % 4 };
    if (fits(board, cells(candidate))) return candidate;
  }
  return null;
}
