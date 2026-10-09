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
import { clockwiseCandidate } from "../../src/engine/placement";
it("chooses fixed-y first-fit kicks on both walls and around stacked cells", () => {
  const b=emptyBoard();
  expect(clockwiseCandidate(b,{kind:"I",x:-2,y:4,orientation:1})).toEqual({kind:"I",x:0,y:4,orientation:2});
  expect(clockwiseCandidate(b,{kind:"I",x:7,y:4,orientation:1})).toEqual({kind:"I",x:6,y:4,orientation:2});
  expect(clockwiseCandidate(b,spawn("T"))).toEqual({...spawn("T"),orientation:1});
  b[2]![4]="I";
  expect(clockwiseCandidate(b,spawn("T"))).toEqual({...spawn("T"),x:2,orientation:1});
  b[2]![3]="I";
  expect(clockwiseCandidate(b,spawn("T"))).toEqual({...spawn("T"),x:4,orientation:1});
  b[2]![5]="I";
  expect(clockwiseCandidate(b,spawn("T"))).toEqual({...spawn("T"),x:1,orientation:1});
});
it("rejects O, floor-only failures and all five blocked translations without mutation", () => {
  const b=emptyBoard();for(let x=3;x<=7;x++)b[13]![x]="O";
  const before=structuredClone(b), p={kind:"I" as const,x:3,y:10,orientation:0};
  expect(clockwiseCandidate(b,p)).toBe(null);expect(b).toEqual(before);
  expect(p.orientation).toBe(0);
  expect(clockwiseCandidate(emptyBoard(),{...spawn("I"),y:18})).toBe(null);
  expect(clockwiseCandidate(emptyBoard(),spawn("O"))).toBe(null);
});
