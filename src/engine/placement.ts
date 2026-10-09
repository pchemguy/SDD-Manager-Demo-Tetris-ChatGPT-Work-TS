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
