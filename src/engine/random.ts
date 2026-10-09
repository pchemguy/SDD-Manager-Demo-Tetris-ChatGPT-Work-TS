/** Seven-bag piece selection through a caller-controlled conforming random source. */
import { KINDS } from "./pieces";
import type { Kind } from "./types";
/** Instance-private lazy seven-bag selector. reset discards unused kinds without rewinding randomness. */
export class Bag {
  private remaining: Kind[] = [];
  constructor(private readonly random: () => number) {}
  /** Draw forward from a fresh descending Fisher–Yates shuffle only when exhausted. */
  next(): Kind {
    if (this.remaining.length === 0) {
      this.remaining = [...KINDS];
      for (let i = 6; i > 0; i--) {
        const j = Math.floor((i + 1) * this.random());
        [this.remaining[i], this.remaining[j]] = [this.remaining[j]!, this.remaining[i]!];
      }
    }
    return this.remaining.shift()!;
  }
  /** Discard the bag; the next request creates a fresh six-draw permutation. */
  reset(): void { this.remaining = []; }
}
