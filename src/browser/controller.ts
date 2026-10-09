/** Bridge browser events and elapsed time to the engine; rendering consumes snapshots. */
import { Game } from "../engine/game";
import type { Snapshot } from "../engine/types";
/** Browser document visibility boundary; the controller owns its subscription. */
export interface Visibility extends EventTarget {
  readonly hidden: boolean;
}
/** Finite monotonic milliseconds with one origin shared by now() and frame timestamps. */
export interface Clock {
  now(): number;
  request(callback: FrameRequestCallback): number;
  cancel(id: number): void;
}
import { Input } from "./input";
const KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "]);
/** Own chronological input/frame scheduling and browser lifecycle subscriptions. The injected clock must be monotonic. */
export class Controller {
  private last: number;
  private readonly input = new Input();
  private frameId = 0;
  private disposed = false;
  private spaceHeld = false;
  constructor(
    private readonly game: Game,
    private readonly keys: EventTarget,
    private readonly restart: EventTarget,
    private readonly clock: Clock,
    private readonly render: (s: Snapshot) => void,
    private readonly visibility?: Visibility,
  ) {
    this.last = clock.now();
    keys.addEventListener("keydown", this.keydown);
    keys.addEventListener("keyup", this.keyup);
    restart.addEventListener("click", this.reset);
    keys.addEventListener("blur", this.blur);
    visibility?.addEventListener("visibilitychange", this.visibilityChanged);
    this.draw();
    this.frameId = clock.request(this.frame);
  }
  private draw = (): void => {
    this.render(this.game.snapshot());
  };
  /** Segment foreground elapsed time at each repeat; engine timers always run first. */
  private tick(at: number): void {
    while (this.input.nextTime() <= at) {
      const due = this.input.nextTime();
      this.game.advance(Math.max(0, due - this.last));
      this.last = due;
      if (this.game.snapshot().status === "gameOver") {
        this.input.clear();
        break;
      }
      for (const action of this.input.take(due)) this.game.apply(action);
    }
    this.game.advance(Math.max(0, at - this.last));
    this.last = at;
    if (this.game.snapshot().status !== "running") this.input.clear();
  }
  private frame: FrameRequestCallback = (at) => {
    if (this.disposed) return;
    this.tick(at);
    this.draw();
    this.frameId = this.clock.request(this.frame);
  };
  private keydown = (event: Event): void => {
    const e = event as KeyboardEvent;
    if (!KEYS.has(e.key)) return;
    e.preventDefault();
    if (e.repeat || (e.key === " " && this.spaceHeld)) return;
    const at = this.clock.now();
    this.tick(at);
    if (e.key === " ") {
      this.spaceHeld = true;
      const status = this.game.snapshot().status;
      if (status === "running") this.game.apply("pause");
      else if (status === "paused") this.game.apply("resume");
      this.input.clear();
      this.last = at;
    } else if (this.game.snapshot().status === "running") {
      for (const action of this.input.press(e.key, at))
        if (action !== "togglePause") this.game.apply(action);
    }
    this.draw();
  };
  private keyup = (event: Event): void => {
    const e = event as KeyboardEvent;
    if (!KEYS.has(e.key)) return;
    e.preventDefault();
    const at = this.clock.now();
    this.tick(at);
    if (e.key === " ") this.spaceHeld = false;
    this.input.release(e.key, at);
    this.draw();
  };
  /** Focus loss pauses without an automatic resume when the browser returns. */
  private blur = (): void => {
    const at = this.clock.now();
    this.tick(at);
    this.game.apply("pause");
    this.input.clear();
    this.spaceHeld = false;
    this.last = at;
    this.draw();
  };
  private visibilityChanged = (): void => {
    if (this.visibility?.hidden) this.blur();
  };
  private reset = (): void => {
    this.input.clear();
    this.spaceHeld = false;
    this.game.apply("restart");
    this.last = this.clock.now();
    this.draw();
  };
  /** Cancel the loop and release subscriptions; repeated disposal is harmless. */
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.clock.cancel(this.frameId);
    this.keys.removeEventListener("keydown", this.keydown);
    this.keys.removeEventListener("keyup", this.keyup);
    this.input.clear();
    this.restart.removeEventListener("click", this.reset);
    this.keys.removeEventListener("blur", this.blur);
    this.visibility?.removeEventListener(
      "visibilitychange",
      this.visibilityChanged,
    );
  }
}
