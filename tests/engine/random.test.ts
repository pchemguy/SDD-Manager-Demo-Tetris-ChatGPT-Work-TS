/** Literal boundary inputs verify independent selection rather than a bag/shuffle policy. */
import { it, expect } from "vitest";
import { select } from "../../src/engine/random";
it("maps each index and allows immediate repetitions", () => {
  const values = [0, 0.15, 0.3, 0.44, 0.58, 0.72, 0.999999];
  expect(values.map((value) => select(() => value))).toEqual([
    "I",
    "O",
    "T",
    "S",
    "Z",
    "J",
    "L",
  ]);
  expect([select(() => 0.15), select(() => 0.15)]).toEqual(["O", "O"]);
});
import { Bag } from "../../src/engine/random";
import { bagSource } from "../helpers/random";
import { KINDS } from "../../src/engine/pieces";
it("shuffles with six descending draws and consumes forward with lazy refill", () => {
  let draws = 0;
  const bag = new Bag(() => { draws++; return 0; });
  expect(Array.from({length:7},()=>bag.next())).toEqual(["O","T","S","Z","J","L","I"]);
  expect(draws).toBe(6);
  expect(bag.next()).toBe("O"); expect(draws).toBe(12);
});
it("supports literal chosen permutations, boundary duplicates, reset and instance isolation", () => {
  const first = [...KINDS], second = ["L","J","Z","S","T","O","I"] as const;
  let calls = 0; const source = bagSource(first, [...second]);
  const a = new Bag(() => { calls++; return source(); }), b = new Bag(bagSource(first));
  expect(Array.from({length:7},()=>a.next())).toEqual(first);
  expect(a.next()).toBe("L"); // First bag ends L; next bag starts L.
  expect(b.next()).toBe("I");
  a.reset(); expect(calls).toBe(12);
  expect(a.next()).toBe("I"); expect(calls).toBe(18);
});
