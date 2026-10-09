/** Independent piece selection through a caller-controlled conforming random source. */
import { KINDS } from "./pieces";
import type { Kind } from "./types";
/** Map one caller-provided finite value in [0,1) to the canonical kind order. */
export function select(random: () => number): Kind {
  return KINDS[Math.floor(7 * random())]!;
}
