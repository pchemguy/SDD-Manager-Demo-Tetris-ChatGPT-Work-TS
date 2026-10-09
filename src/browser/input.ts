/** Pure held-key schedule: browser native repeat never drives commands. */
import type { Command } from "../engine/types";
export type InputAction = Command | "togglePause";
const ACTIONS: Record<string, InputAction> = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowDown: "softDrop",
  ArrowUp: "rotateClockwise",
  " ": "hardDrop",
  p: "togglePause",
  c: "hold",
};
/** Retain physical holds and expose absolute repeat deadlines for chronological control. */
export class Input {
  private held = new Set<string>();
  private horizontal: string | null = null;
  private horizontalAt = Infinity;
  private downAt = Infinity;
  /** Return initial actions only for a fresh recognized keydown. */
  press(key: string, at: number, repeat = false): InputAction[] {
    key = key.length === 1 ? key.toLowerCase() : key;
    const action = ACTIONS[key];
    if (!action || repeat || this.held.has(key)) return [];
    this.held.add(key);
    if (key === "ArrowLeft" || key === "ArrowRight") {
      this.horizontal = key;
      this.horizontalAt = at + 150;
    }
    if (key === "ArrowDown") this.downAt = at + 50;
    return [action];
  }
  /** Release a hold; an opposing horizontal survivor starts a fresh delay without an action. */
  release(key: string, at: number): void {
    key = key.length === 1 ? key.toLowerCase() : key;
    this.held.delete(key);
    if (key === "ArrowDown") this.downAt = Infinity;
    if (key === this.horizontal) {
      const other = key === "ArrowLeft" ? "ArrowRight" : "ArrowLeft";
      this.horizontal = this.held.has(other) ? other : null;
      this.horizontalAt = this.horizontal ? at + 150 : Infinity;
    }
  }
  /** Earliest scheduled repeat, or Infinity when no repeatable keys are held. */
  nextTime(): number {
    return Math.min(this.horizontalAt, this.downAt);
  }
  /** Consume an exact deadline; coincident horizontal actions precede down. */
  take(at: number): Command[] {
    const result: Command[] = [];
    if (at === this.horizontalAt && this.horizontal) {
      result.push(this.horizontal === "ArrowLeft" ? "left" : "right");
      this.horizontalAt += 50;
    }
    if (at === this.downAt) {
      result.push("softDrop");
      this.downAt += 50;
    }
    return result;
  }
  /** Drop all gameplay holds and deadlines at a lifecycle boundary. */
  clear(): void {
    this.held.clear();
    this.horizontal = null;
    this.horizontalAt = Infinity;
    this.downAt = Infinity;
  }
}
