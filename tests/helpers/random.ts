/** Test-only conforming shuffle sources; every requested bag must be a permutation. */
const KINDS = ["I","O","T","S","Z","J","L"] as const;
import type { Kind } from "../../src/engine/types";
/** Construct six mid-bin draws for a chosen descending Fisher–Yates permutation. */
export function drawsForBag(target: readonly Kind[]): number[] {
  if (target.length !== 7 || new Set(target).size !== 7 || target.some(k => !KINDS.includes(k)))
    throw new Error("Expected a permutation of all seven kinds");
  const work: Kind[] = [...KINDS], draws: number[] = [];
  for (let i = 6; i > 0; i--) {
    const j = work.indexOf(target[i]!);
    draws.push((j + .5) / (i + 1));
    [work[i], work[j]] = [work[j]!, work[i]!];
  }
  return draws;
}
/** Cycle chosen valid bags without rewinding the caller-visible source on restart. */
export function bagSource(...bags: readonly Kind[][]): () => number {
  const values = (bags.length ? bags : [[...KINDS]]).flatMap(drawsForBag);
  let cursor = 0;
  return () => values[cursor++ % values.length]!;
}
