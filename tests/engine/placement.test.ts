/** Literal landing expectations catch tunneling and mutation in the shared projection. */
import { it, expect } from "vitest";
import { emptyBoard } from "../../src/engine/board";
import { spawn } from "../../src/engine/pieces";
import { landingDistance } from "../../src/engine/placement";
it("projects to floor or the first uneven obstruction without tunneling", () => {
  const b = emptyBoard(), p = spawn("O");
  expect(landingDistance(b, p)).toBe(18);
  b[10]![4] = "I";
  b[17]![5] = "T";
  const before = structuredClone(b);
  expect(landingDistance(b, p)).toBe(8);
  expect(landingDistance(b, { ...p, y: 8 })).toBe(0);
  expect(b).toEqual(before);
  expect(p).toEqual(spawn("O"));
});
