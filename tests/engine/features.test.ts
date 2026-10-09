/** Feature contracts exercised through commands, elapsed time and detached observations. */
import { it, expect } from "vitest";
import { repeatedO, placeO, moveTo, occupied } from "../helpers/scenarios";
it("hard drop scores its exact projection and waits a full late-cycle interval", () => {
  const g = repeatedO();
  g.advance(900);
  const ghost = g.snapshot().ghost;
  expect(g.apply("hardDrop")).toBe(true);
  expect(g.snapshot()).toMatchObject({ score: 36, lines: 0, active: { y: 18 } });
  expect(g.snapshot().active!.cells).toEqual(ghost);
  expect(occupied(g)).toBe(0);
  g.advance(999);
  const grounded = g.snapshot();
  expect(g.apply("hardDrop")).toBe(false);
  expect(g.snapshot()).toEqual(grounded);
  g.advance(1);
  expect(occupied(g)).toBe(4);
  expect(g.snapshot().active!.y).toBe(0);
});
it("drop preserves gravity age, inactive state and countdown through grounded movement", () => {
  const g = repeatedO();
  g.advance(900); g.apply("hardDrop");
  g.advance(900); g.apply("left"); g.advance(100);
  expect(occupied(g)).toBe(4);
  g.apply("pause"); const s = g.snapshot();
  expect(g.apply("hardDrop")).toBe(false);
  expect(g.snapshot()).toEqual(s);
});
it("airborne adjustment cancels drop lock and a second landing gets a fresh full interval", () => {
  const g = repeatedO(); placeO(g, 4);
  g.apply("hardDrop"); g.advance(900); moveTo(g, 2);
  g.advance(100);
  expect(occupied(g)).toBe(4);
  const before = g.snapshot().score;
  expect(g.apply("hardDrop")).toBe(true);
  expect(g.snapshot().score - before).toBe(2);
  g.advance(999); expect(occupied(g)).toBe(4);
  g.advance(1); expect(occupied(g)).toBe(8);
});
it("timer expiry occurs before a command at the successor boundary", () => {
  const g = repeatedO(); g.apply("hardDrop"); g.advance(1000);
  expect(g.apply("hardDrop")).toBe(true);
  expect(g.snapshot().active!.y).toBe(16);
  expect(occupied(g)).toBe(4);
});
