/** Protect exact deadlines, fractional partitions and post-clear spawn ordering with legal scenarios. */
import { it, expect } from "vitest";
import { bagSource } from "../helpers/random";
import { Game } from "../../src/engine/game";
import {
  bagGame,
  CLEAR_TOP_OUT_TRACE,
  TEST_BAG,
  playTrace,
  prepareTrace,
  placePiece,
  ground,
  moveTo,
  occupied,
} from "../helpers/scenarios";
it("does not fire gravity or lock even a small fraction before their deadline", () => {
  const g = bagGame(),
    before = 1000 - 1e-8,
    remainder = 1000 - before;
  g.advance(before);
  expect(g.snapshot().active!.y).toBe(0);
  g.advance(remainder);
  expect(g.snapshot().active!.y).toBe(1);
  ground(g);
  g.advance(before);
  expect(occupied(g)).toBe(0);
  g.advance(remainder);
  expect(occupied(g)).toBe(4);
});
it("preserves fractional progression partitions, lock ties and paused remainders", () => {
  const a = bagGame(),
    b = bagGame();
  for (const g of [a, b]) {
    playTrace(g, 39);
    ground(g);
    g.advance(123.125);
    g.apply("pause");
    g.advance(100000);
    g.apply("resume");
  }
  a.advance(20000);
  for (let i = 0; i < 160; i++) b.advance(125);
  expect(a.snapshot()).toEqual(b.snapshot());
});
it("clears a row before checking a differently shaped obstructed next spawn", () => {
  let draws = 0; const source = bagSource(TEST_BAG);
  const g = new Game(() => { draws++; return source(); });
  for (const [index, step] of CLEAR_TOP_OUT_TRACE.entries()) {
    expect(g.snapshot().active!.kind).toBe(step.kind);
    for (let r=0;r<step.orientation;r++) expect(g.apply("rotateClockwise")).toBe(true);
    moveTo(g,step.x); ground(g);
    const lines = g.snapshot().lines, beforeDraws = draws;
    g.advance(g.snapshot().gravityInterval);
    expect(g.snapshot().lines - lines).toBe(step.cleared);
    if (index === CLEAR_TOP_OUT_TRACE.length - 1) {
      expect(step.cleared).toBe(1);
      expect(g.snapshot()).toMatchObject({status:"gameOver",active:null,ghost:null,next:"O"});
      expect(draws).toBe(beforeDraws);
      expect(g.snapshot().board[0]!.every(c=>c===null)).toBe(true);
    }
  }
});

it("partitions through a bag-backed clear/level transition and successor gravity", () => {
  const a = bagGame(), b = bagGame();
  for (const g of [a,b]) { playTrace(g,31); prepareTrace(g,31); g.advance(900); }
  a.advance(2500); for (let n=0;n<25;n++) b.advance(100);
  expect(a.snapshot()).toEqual(b.snapshot());
  expect(a.snapshot()).toMatchObject({lines:11,level:2,gravityInterval:800,active:{y:3}});
  a.advance(799); b.advance(799); expect(a.snapshot()).toEqual(b.snapshot());
  a.advance(1); b.advance(1); expect(a.snapshot().active!.y).toBe(4);
  expect(a.snapshot()).toEqual(b.snapshot());
});
