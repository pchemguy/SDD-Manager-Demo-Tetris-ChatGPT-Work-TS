/** Valid bag-backed public-command scenarios; never inject production state. */
import { Game } from "../../src/engine/game";
import { bagSource } from "./random";
import { TEST_BAG, CLEAR_TRACE } from "./fixtures";
export { TEST_BAG, CLEAR_TRACE, CLEAR_TOP_OUT_TRACE } from "./fixtures";
/** Start with O, then consume every other kind before another O can appear. */
export const bagGame = () => new Game(bagSource(TEST_BAG));
/** Move a legal matrix origin, including negative origins with fitting occupied cells. */
export function moveTo(game: Game, x: number): void {
  let guard = 0;
  while (game.snapshot().active!.x !== x)
    if (++guard > 20 || !game.apply(game.snapshot().active!.x > x ? "left" : "right"))
      throw Error("Unreachable fixture column");
}
/** Soft-drop until grounded, without locking. */
export function ground(game: Game): void {
  let guard = 0;
  while (game.apply("softDrop")) if (++guard > 20) throw Error("Unbounded descent");
}
/** Lock any current piece at its current orientation using the complete gravity interval. */
export function placePiece(game: Game, x: number): void {
  moveTo(game, x); ground(game); game.advance(game.snapshot().gravityInterval);
}
/** Count locked cells using detached public observations. */
export function occupied(game: Game): number {
  return game.snapshot().board.flat().filter(x => x !== null).length;
}
/** Stack the conforming stream at its spawn column until the next spawn is obstructed. */
export function topOut(game: Game): number {
  let locks = 0;
  while (game.snapshot().status === "running") {
    if (++locks > 50) throw Error("Fixture failed to top out");
    ground(game); game.advance(game.snapshot().gravityInterval);
  }
  return locks;
}
/** Prepare a trace piece through clockwise commands at spawn then horizontal movement. */
export function prepareTrace(game: Game, index: number): void {
  const step = CLEAR_TRACE[index]!;
  if (game.snapshot().active?.kind !== step.kind) throw Error("Unexpected fixture kind");
  for (let r = 0; r < step.orientation; r++)
    if (!game.apply("rotateClockwise")) throw Error("Fixture rotation failed");
  moveTo(game, step.x); ground(game);
}
/** Execute a prefix with real drop/lock/clear transitions. */
export function playTrace(game: Game, count: number): void {
  for (let i = 0; i < count; i++) { prepareTrace(game, i); game.advance(game.snapshot().gravityInterval); }
}
