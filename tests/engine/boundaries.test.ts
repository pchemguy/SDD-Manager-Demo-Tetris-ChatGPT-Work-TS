/** Protect exact deadlines, fractional partitions and post-clear spawn ordering with legal scenarios. */
import { it, expect } from "vitest";
import { Game } from "../../src/engine/game";
import {
  repeatedO,
  placeO,
  ground,
  moveTo,
  occupied,
} from "../helpers/scenarios";
it("does not fire gravity or lock even a small fraction before their deadline", () => {
  const g = repeatedO(),
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
  const a = repeatedO(),
    b = repeatedO();
  for (const g of [a, b]) {
    for (let n = 0; n < 10; n++) for (const x of [0, 2, 4, 6, 8]) placeO(g, x);
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
  let draw = 0;
  const sequence = [...Array<number>(13).fill(0.15), 0.8, 0];
  const g = new Game(() => sequence[draw++] ?? 0);
  placeO(g, 8);
  for (let i = 0; i < 10; i++) placeO(g, 6);
  placeO(g, 4);
  placeO(g, 2);
  expect(g.snapshot().active!.kind).toBe("J");
  for (let i = 0; i < 3; i++) expect(g.apply("rotateClockwise")).toBe(true);
  moveTo(g, 0);
  ground(g);
  g.advance(1000);
  expect(g.snapshot()).toMatchObject({
    lines: 1,
    status: "gameOver",
    active: null,
    next: "I",
  });
  expect(g.snapshot().board[0]!.every((c) => c === null)).toBe(true);
  expect(g.snapshot().board[1]![6]).toBe("O");
  expect(draw).toBe(15);
});
