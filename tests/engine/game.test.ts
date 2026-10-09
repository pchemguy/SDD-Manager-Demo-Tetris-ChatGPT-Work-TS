/** Public command/snapshot scenarios verify session state, collisions and detached observation. */
import { it, expect } from "vitest";
import { Game } from "../../src/engine/game";
it("draws active then next and restarts with fresh source draws", () => {
  const values = [0.15, 0.3, 0.72, 0.9999];
  const g = new Game(() => values.shift()!);
  expect(g.snapshot().active?.kind).toBe("O");
  expect(g.snapshot().next).toBe("T");
  expect(g.apply("restart")).toBe(true);
  expect(g.snapshot().active?.kind).toBe("J");
  expect(g.snapshot().next).toBe("L");
  expect(g.snapshot().score).toBe(0);
});
it("moves only valid cells and blocked actions preserve state", () => {
  const g = new Game(() => 0.15);
  for (let i = 0; i < 4; i++) expect(g.apply("left")).toBe(true);
  expect(g.snapshot().active?.x).toBe(0);
  const before = g.snapshot();
  expect(g.apply("left")).toBe(false);
  expect(g.snapshot()).toEqual(before);
  expect(g.apply("softDrop")).toBe(true);
  expect(g.snapshot().active?.y).toBe(1);
  expect(g.snapshot().score).toBe(1);
  expect(g.apply("rotateClockwise")).toBe(false);
});
it("rotates a T through four orientations without wall kicks", () => {
  const g = new Game(() => 0.3);
  for (let i = 0; i < 4; i++) expect(g.apply("rotateClockwise")).toBe(true);
  expect(g.snapshot().active?.orientation).toBe(0);
});
it("snapshots are detached from engine and later commands", () => {
  const g = new Game(() => 0.3);
  const view = g.snapshot();
  view.board[0]![0] = "I";
  view.active!.cells[0]!.x = 99;
  view.active!.x = 99;
  expect(g.snapshot().board[0]![0]).toBe(null);
  expect(g.snapshot().active?.x).toBe(3);
  const retained = g.snapshot();
  g.apply("right");
  expect(retained.active?.x).toBe(3);
  expect(g.snapshot().active?.x).toBe(4);
});
it("provides nonmutating detached ghost cells in running and paused snapshots", () => {
  let draws = 0;
  const g = new Game(() => { draws++; return .15; });
  const s = g.snapshot();
  expect(s.ghost).toEqual([{x:4,y:18},{x:5,y:18},{x:4,y:19},{x:5,y:19}]);
  s.ghost![0]!.x = 99;
  expect(g.snapshot().ghost![0]!.x).toBe(4);
  g.apply("pause");
  const paused = g.snapshot();
  expect(paused.ghost).toEqual(g.snapshot().ghost);
  expect(draws).toBe(2);
  g.advance(50000);
  expect(g.snapshot()).toEqual(paused);
});
