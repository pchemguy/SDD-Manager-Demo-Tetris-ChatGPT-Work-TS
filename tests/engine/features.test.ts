/** Feature contracts exercised through commands, elapsed time and detached observations. */
import { it, expect } from "vitest";
import { bagGame, placePiece, moveTo, occupied } from "../helpers/scenarios";
it("hard drop scores its exact projection and waits a full late-cycle interval", () => {
  const g = bagGame();
  g.advance(900);
  const ghost = g.snapshot().ghost;
  expect(g.apply("hardDrop")).toBe(true);
  expect(g.snapshot()).toMatchObject({ score: 36, lines: 0, active: { y: 18 } });
  expect(g.snapshot().active!.cells).toEqual(ghost);
  expect(occupied(g)).toBe(0);
  g.advance(999);
  const grounded = g.snapshot();
  expect(g.apply("hardDrop")).toBe(false);
  expect(g.snapshot()).toEqual(grounded);
  g.advance(1);
  expect(occupied(g)).toBe(4);
  expect(g.snapshot().active!.y).toBe(0);
});
it("drop preserves gravity age, inactive state and countdown through grounded movement", () => {
  const g = bagGame();
  g.advance(900); g.apply("hardDrop");
  g.advance(900); g.apply("left"); g.advance(100);
  expect(occupied(g)).toBe(4);
  g.apply("pause"); const s = g.snapshot();
  expect(g.apply("hardDrop")).toBe(false);
  expect(g.snapshot()).toEqual(s);
});
it("airborne adjustment cancels drop lock and a second landing gets a fresh full interval", () => {
  const g = bagGame(); placePiece(g, 4);
  g.apply("hardDrop"); g.advance(900); moveTo(g, 0);
  g.advance(100);
  expect(occupied(g)).toBe(4);
  const before = g.snapshot().score;
  expect(g.apply("hardDrop")).toBe(true);
  expect(g.snapshot().score - before).toBe(2);
  g.advance(999); expect(occupied(g)).toBe(4);
  g.advance(1); expect(occupied(g)).toBe(8);
});
it("timer expiry occurs before a command at the successor boundary", () => {
  const g = bagGame(); g.apply("hardDrop"); g.advance(1000);
  expect(g.apply("hardDrop")).toBe(true);
  expect(g.snapshot().active!.y).toBe(16);
  expect(occupied(g)).toBe(4);
});
import { Game } from "../../src/engine/game";
import { bagSource } from "../helpers/random";
import { TEST_BAG } from "../helpers/fixtures";
it("empty and occupied hold use canonical fresh pieces, once per lock, with exact preview use", () => {
  let draws=0; const source=bagSource(TEST_BAG);
  const g=new Game(()=>{draws++;return source();});
  expect(g.snapshot()).toMatchObject({held:null,canHold:true});
  g.apply("right");g.apply("softDrop");g.advance(900);
  expect(g.apply("hold")).toBe(true);
  expect(g.snapshot()).toMatchObject({held:"O",canHold:false,active:{kind:"I",x:3,y:0,orientation:0},next:"T",score:1});
  const before=g.snapshot();expect(g.apply("hold")).toBe(false);expect(g.snapshot()).toEqual(before);
  g.advance(999);expect(g.snapshot().active!.y).toBe(0);
  g.advance(1);expect(g.snapshot().active!.y).toBe(1);
  g.apply("hardDrop");g.advance(1000);expect(g.snapshot().canHold).toBe(true);
  const next=g.snapshot().next, calls=draws;
  expect(g.apply("hold")).toBe(true);
  expect(g.snapshot()).toMatchObject({held:"T",canHold:false,active:{kind:"O",x:4,y:0,orientation:0},next});
  expect(draws).toBe(calls);
  g.apply("restart");expect(g.snapshot()).toMatchObject({held:null,canHold:true});
});
it("hold availability follows lifecycle and a same-kind swap is effective", () => {
  const g=bagGame();g.apply("pause");const before=g.snapshot();
  expect(before.canHold).toBe(false);expect(g.apply("hold")).toBe(false);expect(g.snapshot()).toEqual(before);
  g.apply("resume");expect(g.snapshot().canHold).toBe(true);g.apply("hold");
  for(let i=0;i<6;i++){g.apply("hardDrop");g.advance(1000);}
  expect(g.snapshot()).toMatchObject({active:{kind:"O"},held:"O",canHold:true});
  const next=g.snapshot().next;expect(g.apply("hold")).toBe(true);
  expect(g.snapshot()).toMatchObject({active:{kind:"O",y:0},held:"O",next,canHold:false});
});

import { EMPTY_HOLD_FAILURE, OCCUPIED_HOLD_FAILURE, GROUNDED_HOLD } from "../helpers/fixtures";
import { ground } from "../helpers/scenarios";
function trace(g: Game, steps: readonly {kind:string;orientation:number;x:number}[]) {
  for(const step of steps){
    expect(g.snapshot().active!.kind).toBe(step.kind);
    for(let r=0;r<step.orientation;r++) expect(g.apply("rotateClockwise")).toBe(true);
    moveTo(g,step.x);ground(g);g.advance(g.snapshot().gravityInterval);
  }
}
it("empty and occupied hold obstruction retain outgoing held kind, next/progress/board and draw nothing", () => {
  for(const occupiedHold of [false,true]){
    let draws=0; const source=bagSource(TEST_BAG),g=new Game(()=>{draws++;return source();});
    if(occupiedHold){expect(g.apply("hold")).toBe(true);trace(g,OCCUPIED_HOLD_FAILURE);}
    else trace(g,EMPTY_HOLD_FAILURE);
    const before=g.snapshot(),calls=draws;
    expect(g.apply("hold")).toBe(true);
    expect(g.snapshot()).toMatchObject({status:"gameOver",active:null,ghost:null,held:before.active!.kind,canHold:false,next:before.next,board:before.board,score:before.score,lines:before.lines,level:before.level});
    expect(draws).toBe(calls);const failed=g.snapshot();
    expect(g.apply("hold")).toBe(false);expect(g.snapshot()).toEqual(failed);
  }
});
it("grounded-at-spawn held replacement starts a fresh complete interval and does not carry old timers", () => {
  const g=bagGame();g.apply("hold");trace(g,GROUNDED_HOLD);
  g.advance(900);expect(g.apply("hold")).toBe(true);
  expect(g.snapshot().active).toMatchObject({kind:"O",x:4,y:0,orientation:0});
  expect(g.snapshot().ghost).toEqual(g.snapshot().active!.cells);
  const before=g.snapshot();g.advance(999);expect(g.snapshot().board).toEqual(before.board);
  expect(g.snapshot().active?.kind).toBe("O");g.advance(1);
  expect(g.snapshot().board).not.toEqual(before.board);
});
const iGame=()=>new Game(bagSource(["I","O","T","S","Z","J","L"]));
it("applies a fitting kick atomically and cancels grounding when it becomes airborne", () => {
  const g=iGame();g.apply("rotateClockwise");moveTo(g,-2);g.apply("hardDrop");g.advance(900);
  expect(g.apply("rotateClockwise")).toBe(true);
  expect(g.snapshot().active).toMatchObject({kind:"I",x:0,y:16,orientation:2});
  g.advance(100);expect(occupied(g)).toBe(0);expect(g.snapshot().active!.y).toBe(17);
  g.advance(999);expect(occupied(g)).toBe(0);g.advance(1);expect(occupied(g)).toBe(4);
});
it("successful grounded rotation retains its countdown; a floor failure is atomic", () => {
  const g=new Game(bagSource(["T","I","O","S","Z","J","L"]));
  g.apply("rotateClockwise");g.apply("hardDrop");g.advance(900);
  expect(g.apply("rotateClockwise")).toBe(true);g.advance(100);expect(occupied(g)).toBe(4);
  const i=iGame();i.apply("hardDrop");i.advance(900);const before=i.snapshot();
  expect(i.apply("rotateClockwise")).toBe(false);expect(i.snapshot()).toEqual(before);
  i.advance(100);expect(occupied(i)).toBe(4);
});
