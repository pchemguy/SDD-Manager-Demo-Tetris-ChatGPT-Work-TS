/** Check exact scoring formulas and real gameplay through cumulative level transitions. */
import { it, expect } from "vitest";
import { lineAward, levelFor, gravity } from "../../src/engine/progression";
import {
  bagGame,
  playTrace,
  prepareTrace,
  placePiece,
  ground,
  occupied,
  moveTo,
} from "../helpers/scenarios";
it("awards 0–4 clears using the pre-clear level", () => {
  expect([0, 1, 2, 3, 4].map((n) => lineAward(n, 3))).toEqual([
    0, 300, 900, 1500, 2400,
  ]);
});
it("handles single/multiple line threshold crossings and fractional gravity floor", () => {
  expect([0, 9, 10, 19, 21].map(levelFor)).toEqual([1, 1, 2, 2, 3]);
  expect(gravity(2)).toBe(800);
  expect(gravity(3)).toBeCloseTo(640, 12);
  expect(gravity(8)).toBeCloseTo(209.7152, 12);
  expect(gravity(30)).toBe(100);
});
it("integrates bag-backed threshold crossing, pre-clear awards and the new full interval", () => {
  const g = bagGame(); playTrace(g, 31);
  expect(g.snapshot()).toMatchObject({lines:9,level:1});
  prepareTrace(g, 31); const before = g.snapshot().score;
  g.advance(1000);
  expect(g.snapshot()).toMatchObject({lines:11,level:2,gravityInterval:800});
  expect(g.snapshot().score - before).toBe(300);
  g.advance(799); expect(g.snapshot().active!.y).toBe(0);
  g.advance(1); expect(g.snapshot().active!.y).toBe(1);
  ground(g); const cells = occupied(g), score = g.snapshot().score;
  expect(g.apply("softDrop")).toBe(false); expect(g.snapshot().score).toBe(score);
  g.advance(799); expect(occupied(g)).toBe(cells);
  g.advance(1); expect(occupied(g)).toBe(cells + 4);
});
