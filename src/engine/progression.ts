/** Pure scoring and progression formulas, independent of session storage. */
/** Award a legal 0–4-row simultaneous clear at the level before that clear. */
export function lineAward(cleared: number, level: number): number {
  return ([0, 100, 300, 500, 800][cleared] ?? 0) * level;
}
/** Derive level from cumulative cleared lines, advancing at every ten-line threshold. */
export function levelFor(lines: number): number {
  return 1 + Math.floor(lines / 10);
}
/** Return unrounded milliseconds; gravity and fresh grounded delays share this interval. */
export function gravity(level: number): number {
  return Math.max(100, 1000 * 0.8 ** (level - 1));
}
