/** Verify lifecycle outcomes, timer preservation and invalid-time atomicity in every session state. */
import { it, expect } from "vitest";
import { repeatedO, ground, occupied, placeO } from "../helpers/scenarios";
it("pause/resume preserve gravity and grounded remainders and report effective outcomes", () => {
  const g = repeatedO();
  g.advance(900);
  expect(g.apply("pause")).toBe(true);
  const paused = g.snapshot();
  expect(g.apply("pause")).toBe(false);
  for (const command of [
    "left",
    "right",
    "softDrop",
    "rotateClockwise",
  ] as const)
    expect(g.apply(command)).toBe(false);
  g.advance(50000);
  expect(g.snapshot()).toEqual(paused);
  expect(g.apply("resume")).toBe(true);
  expect(g.apply("resume")).toBe(false);
  g.advance(99);
  expect(g.snapshot().active!.y).toBe(0);
  g.advance(1);
  expect(g.snapshot().active!.y).toBe(1);
  ground(g);
  g.advance(700);
  g.apply("pause");
  g.advance(50000);
  g.apply("resume");
  g.advance(299);
  expect(occupied(g)).toBe(0);
  g.advance(1);
  expect(occupied(g)).toBe(4);
});
it("rejects nonfinite and negative elapsed before mutation in every lifecycle state", () => {
  for (const state of ["running", "paused", "gameOver"]) {
    const g = repeatedO();
    if (state === "paused") g.apply("pause");
    if (state === "gameOver") for (let i = 0; i < 10; i++) placeO(g, 4);
    for (const time of [-1, NaN, Infinity, -Infinity]) {
      const before = g.snapshot();
      expect(() => g.advance(time)).toThrow(RangeError);
      expect(g.snapshot()).toEqual(before);
    }
    const before = g.snapshot();
    g.advance(0);
    expect(g.snapshot()).toEqual(before);
  }
});
it("game over rejects play, pause and resume; restart resets progress and timers", () => {
  const g = repeatedO();
  for (let i = 0; i < 10; i++) placeO(g, 4);
  const before = g.snapshot();
  for (const cmd of [
    "left",
    "right",
    "softDrop",
    "rotateClockwise",
    "pause",
    "resume",
  ] as const)
    expect(g.apply(cmd)).toBe(false);
  g.advance(10000);
  expect(g.snapshot()).toEqual(before);
  expect(g.apply("restart")).toBe(true);
  expect(g.snapshot()).toMatchObject({
    status: "running",
    score: 0,
    lines: 0,
    level: 1,
  });
  expect(occupied(g)).toBe(0);
  g.advance(999);
  expect(g.snapshot().active!.y).toBe(0);
  g.advance(1);
  expect(g.snapshot().active!.y).toBe(1);
});
it("restart from pause clears a pending lock countdown", () => {
  const g = repeatedO();
  ground(g);
  g.advance(999);
  g.apply("pause");
  g.apply("restart");
  g.advance(1);
  expect(occupied(g)).toBe(0);
  expect(g.snapshot().active!.y).toBe(0);
});
