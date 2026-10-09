/** Explicit elapsed-time boundaries detect immediate-lock and remaining-tick substitutions. */
import { it, expect } from "vitest";
import { bagSource } from "../helpers/random";
import { Game } from "../../src/engine/game";
import {
  bagGame,
  playTrace,
  TEST_BAG,
  topOut,
  ground,
  moveTo,
  placePiece,
  occupied,
} from "../helpers/scenarios";
it("gravity retains residual milliseconds", () => {
  const g = bagGame();
  g.advance(999);
  expect(g.snapshot().active?.y).toBe(0);
  g.advance(1);
  expect(g.snapshot().active?.y).toBe(1);
  g.advance(1500);
  expect(g.snapshot().active?.y).toBe(2);
  g.advance(500);
  expect(g.snapshot().active?.y).toBe(3);
});
it("late-in-cycle landing receives a full independent interval", () => {
  const g = bagGame();
  g.advance(900);
  ground(g);
  expect(g.snapshot().active?.y).toBe(18);
  g.advance(999);
  expect(occupied(g)).toBe(0);
  expect(g.apply("softDrop")).toBe(false);
  g.advance(1);
  expect(occupied(g)).toBe(4);
  expect(g.snapshot().active?.y).toBe(0);
});
it("grounded movement does not refresh the countdown", () => {
  const g = bagGame();
  ground(g);
  g.advance(900);
  expect(g.apply("left")).toBe(true);
  g.advance(100);
  expect(occupied(g)).toBe(4);
});
it("becoming airborne cancels the old timer and re-grounding starts fresh", () => {
  const g = bagGame();
  placePiece(g, 4);
  ground(g);
  g.advance(900);
  moveTo(g, 0);
  g.advance(100);
  expect(occupied(g)).toBe(4);
  expect(g.snapshot().active?.y).toBe(17);
  ground(g);
  g.advance(999);
  expect(occupied(g)).toBe(4);
  g.advance(1);
  expect(occupied(g)).toBe(8);
});
it("time partitioning remains equivalent across locks and spawns", () => {
  const a = bagGame(),
    b = bagGame();
  a.advance(50000);
  for (let i = 0; i < 100; i++) b.advance(500);
  expect(a.snapshot()).toEqual(b.snapshot());
  expect(occupied(a)).toBeGreaterThan(0);
});
it("row compaction and next spawn integrate through real commands", () => {
  const g = bagGame();
  playTrace(g, 7);
  expect(g.snapshot().lines).toBe(2);
  expect(occupied(g)).toBe(8);
  expect(g.snapshot().score).toBe(321);
});
it("blocked post-lock spawn retains next and requests no replacement draw", () => {
  let draws = 0; const source = bagSource(TEST_BAG);
  const g = new Game(() => { draws++; return source(); });
  const locks = topOut(g);
  expect(g.snapshot()).toMatchObject({status:"gameOver",active:null,ghost:null});
  expect(occupied(g)).toBe(locks * 4);
  expect(draws).toBe(Math.ceil((locks + 1) / 7) * 6);
  const before = draws; g.snapshot(); g.apply("hardDrop"); expect(draws).toBe(before);
});
