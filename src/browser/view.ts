/** HTML statistics/status presentation consumes snapshots without changing gameplay. */
import type { Snapshot } from "../engine/types";
export type TextTarget = Pick<HTMLElement, "textContent">;
export type ViewTargets = Record<
  "score" | "lines" | "level" | "status",
  TextTarget
> & { next?: TextTarget };
/** Project engine statistics into accessible textual elements. */
export class View {
  constructor(private readonly targets: ViewTargets) {}
  private write(target: TextTarget, text: string): void {
    if (target.textContent !== text) target.textContent = text;
  }
  /** Synchronize all visible statistics and explicit lifecycle labels. */
  render(snapshot: Snapshot): void {
    this.write(this.targets.score, String(snapshot.score));
    this.write(this.targets.lines, String(snapshot.lines));
    this.write(this.targets.level, String(snapshot.level));
    if (this.targets.next) this.write(this.targets.next, snapshot.next);
    this.write(
      this.targets.status,
      { running: "Playing", paused: "Paused", gameOver: "Game over" }[
        snapshot.status
      ],
    );
  }
}
