/** Exercise the composed engine/controller through controlled clocks and browser event boundaries. */
import { it, expect } from "vitest";
import { Controller, type Clock } from "../../src/browser/controller";
import { bagGame, placePiece, occupied, ground, playTrace, topOut, moveTo } from "../helpers/scenarios";
export function harness() {
  let time = 0,
    callback: FrameRequestCallback = () => {},
    cancelled = false;
  const keys = new EventTarget(),
    restart = new EventTarget(),
    visibility = Object.assign(new EventTarget(), { hidden: false }),
    game = bagGame();
  const snapshots: ReturnType<typeof game.snapshot>[] = [];
  const clock: Clock = {
    now: () => time,
    request: (fn) => {
      callback = fn;
      return 1;
    },
    cancel: () => {
      cancelled = true;
    },
  };
  const controller = new Controller(
    game,
    keys,
    restart,
    clock,
    (s) => snapshots.push(s),
    visibility,
  );
  return {
    game,
    keys,
    restart,
    visibility,
    snapshots,
    controller,
    at: (at: number) => { time = at; },
    frame: (at: number) => {
      time = at;
      callback(at);
    },
    key: (key: string, repeat = false) => {
      const event = new Event("keydown", { cancelable: true });
      Object.assign(event, { key, repeat });
      keys.dispatchEvent(event);
      return event;
    },
    release: (key: string) => {
      const event = new Event("keyup", { cancelable: true });
      Object.assign(event, { key });
      keys.dispatchEvent(event);
    },
    cancelled: () => cancelled,
  };
}
it("composes initial rendering, timed gravity, discrete keys and restart", () => {
  const h = harness();
  expect(h.snapshots).toHaveLength(1);
  h.frame(1000);
  expect(h.game.snapshot().active!.y).toBe(1);
  expect(h.key("ArrowLeft").defaultPrevented).toBe(true);
  expect(h.game.snapshot().active!.x).toBe(3);
  h.key("ArrowLeft", true);
  expect(h.game.snapshot().active!.x).toBe(3);
  h.key("ArrowDown");
  expect(h.game.snapshot().score).toBe(1);
  h.restart.dispatchEvent(new Event("click"));
  expect(h.game.snapshot().score).toBe(0);
  expect(h.game.snapshot().active!.y).toBe(0);
  h.controller.dispose();
  expect(h.cancelled()).toBe(true);
});
it("renders real public-command row clears and top out without a state loader", () => {
  const h = harness();
  playTrace(h.game, 7);
  h.frame(0);
  expect(h.snapshots.at(-1)!.lines).toBe(2);
  topOut(h.game);
  h.frame(0);
  expect(h.snapshots.at(-1)!.status).toBe("gameOver");
  expect(occupied(h.game)).toBeGreaterThan(0);
  h.controller.dispose();
});

it("processes a foreground stall as chronological repeat deadlines, equivalent to small frames", () => {
  const a = harness(),
    b = harness();
  a.key("ArrowDown");
  b.key("ArrowDown");
  a.frame(5000);
  for (let t = 25; t <= 5000; t += 25) b.frame(t);
  expect(a.game.snapshot()).toEqual(b.game.snapshot());
  expect(a.game.snapshot().score).toBeGreaterThan(18);
  a.controller.dispose();
  b.controller.dispose();
});
it("locks before an equal-time horizontal repeat applies to the newly spawned piece", () => {
  const h = harness();
  ground(h.game);
  h.frame(850);
  h.key("ArrowRight");
  h.frame(1000);
  expect(h.game.snapshot().board[19]![5]).toBe("O");
  expect(h.game.snapshot().active).toMatchObject({kind:"I",x:4});
  h.controller.dispose();
});
it("releasing a held down key ends its repeat schedule", () => {
  const h = harness();
  h.key("ArrowDown");
  h.frame(100);
  const before = h.game.snapshot().score;
  const e = new Event("keyup");
  Object.assign(e, { key: "ArrowDown" });
  h.keys.dispatchEvent(e);
  h.frame(999);
  expect(h.game.snapshot().score).toBe(before);
  h.controller.dispose();
});

it("P requires release across pause, excludes inactive time and retains engine remainders", () => {
  const h = harness();
  h.frame(900);
  expect(h.key("p").defaultPrevented).toBe(true);
  expect(h.game.snapshot().status).toBe("paused");
  h.frame(50000);
  h.key("P", true);
  h.key("p");
  expect(h.game.snapshot().status).toBe("paused");
  h.release("P");
  h.key("p");
  expect(h.game.snapshot().status).toBe("running");
  h.frame(50099);
  expect(h.game.snapshot().active!.y).toBe(0);
  h.frame(50100);
  expect(h.game.snapshot().active!.y).toBe(1);
  h.controller.dispose();
});
it("blur and hidden transitions pause, clear holds and require explicit resume", () => {
  const h = harness();
  h.key("ArrowRight");
  h.frame(100);
  h.keys.dispatchEvent(new Event("blur"));
  expect(h.game.snapshot().status).toBe("paused");
  h.frame(10000);
  h.keys.dispatchEvent(new Event("focus"));
  expect(h.game.snapshot().status).toBe("paused");
  h.key("p");
  h.frame(10149);
  expect(h.game.snapshot().active!.x).toBe(5);
  h.visibility.hidden = true;
  h.visibility.dispatchEvent(new Event("visibilitychange"));
  expect(h.game.snapshot().status).toBe("paused");
  h.visibility.hidden = false;
  h.visibility.dispatchEvent(new Event("visibilitychange"));
  expect(h.game.snapshot().status).toBe("paused");
  h.controller.dispose();
});
it("restart from pause clears holds and rebases elapsed time", () => {
  const h = harness();
  h.key("ArrowDown");
  h.frame(100);
  h.key("p");
  h.frame(50000);
  h.restart.dispatchEvent(new Event("click"));
  h.frame(50999);
  expect(h.game.snapshot()).toMatchObject({
    score: 0,
    status: "running",
    active: { y: 0 },
  });
  h.frame(51000);
  expect(h.game.snapshot().active!.y).toBe(1);
  h.controller.dispose();
});
it("repeated disposal removes every event subscription and stops even an already queued frame", () => {
  const h = harness();
  const before = h.game.snapshot(),
    count = h.snapshots.length;
  h.controller.dispose();
  h.controller.dispose();
  h.key("ArrowDown");
  h.key("p");
  h.keys.dispatchEvent(new Event("blur"));
  h.visibility.hidden = true;
  h.visibility.dispatchEvent(new Event("visibilitychange"));
  h.restart.dispatchEvent(new Event("click"));
  h.frame(100000);
  expect(h.game.snapshot()).toEqual(before);
  expect(h.snapshots).toHaveLength(count);
  expect(h.cancelled()).toBe(true);
});

it("Space drops once without changing arrow repeat deadlines or pausing", () => {
  const h = harness(); h.key("ArrowRight"); h.frame(100);
  expect(h.key(" ").defaultPrevented).toBe(true);
  expect(h.game.snapshot()).toMatchObject({ status: "running", score: 36, active: { y: 18, x: 5 } });
  h.key(" "); h.key(" ", true);
  expect(h.game.snapshot().score).toBe(36);
  h.frame(150); expect(h.game.snapshot().active!.x).toBe(6);
  h.key("p"); h.key("P");
  expect(h.game.snapshot().status).toBe("paused");
  h.key(" "); h.release("P"); h.key("P");
  expect(h.game.snapshot().status).toBe("running");
  h.controller.dispose();
});
it("controlled C case holds once and later arrow repeats move the replacement", () => {
  const h=harness();h.key("ArrowRight");h.frame(100);
  expect(h.key("c").defaultPrevented).toBe(true);h.key("C");
  expect(h.game.snapshot()).toMatchObject({held:"O",canHold:false,active:{kind:"I",x:3},next:"T"});
  h.frame(150);expect(h.game.snapshot().active!.x).toBe(4);h.controller.dispose();
});
it("C and Space latches remain held across lock and require a physical release", () => {
  const h=harness();h.key("c");h.key(" ");h.frame(1000);
  expect(h.game.snapshot()).toMatchObject({active:{kind:"T",y:0},held:"O",canHold:true});
  const before=h.game.snapshot();h.key("C");h.key(" ");
  expect(h.game.snapshot()).toEqual(before);
  h.release("C");h.key("C");expect(h.game.snapshot()).toMatchObject({active:{kind:"O"},held:"T",canHold:false});
  h.controller.dispose();
});
it("advances lock expiry before an equal-time hold or drop key targets the successor", () => {
  const h=harness();h.key(" ");h.release(" ");h.frame(999);
  h.at(1000);h.key("c");
  expect(h.game.snapshot()).toMatchObject({held:"I",active:{kind:"T",y:0},next:"S"});
  expect(occupied(h.game)).toBe(4);h.key(" ");
  expect(h.game.snapshot().active!.y).toBeGreaterThan(0);h.controller.dispose();
});
it("inactive C, Space and arrows cannot arm replay on manual resume or restart", () => {
  const h=harness();h.key("p");h.key("c");h.key(" ");h.key("ArrowDown");h.frame(100000);
  h.release("P");h.key("P");h.frame(100150);
  expect(h.game.snapshot()).toMatchObject({held:null,score:0,active:{y:0}});
  h.keys.dispatchEvent(new Event("blur"));h.key("P",true);expect(h.game.snapshot().status).toBe("paused");
  h.restart.dispatchEvent(new Event("click"));h.frame(100300);
  expect(h.game.snapshot()).toMatchObject({held:null,score:0,active:{y:0}});h.controller.dispose();
});

import { EMPTY_HOLD_FAILURE } from "../helpers/fixtures";
it("a hold top-out clears repeats immediately and restart cannot replay them", () => {
  const h=harness();
  for(const step of EMPTY_HOLD_FAILURE){
    for(let r=0;r<step.orientation;r++)h.game.apply("rotateClockwise");
    moveTo(h.game,step.x);ground(h.game);h.game.advance(h.game.snapshot().gravityInterval);
  }
  h.key("ArrowRight");h.key("c");expect(h.game.snapshot().status).toBe("gameOver");
  const before=h.game.snapshot();h.frame(10000);expect(h.game.snapshot()).toEqual(before);
  h.restart.dispatchEvent(new Event("click"));h.frame(10150);
  expect(h.game.snapshot()).toMatchObject({score:0,held:null,active:{x:4,y:0}});h.controller.dispose();
});
