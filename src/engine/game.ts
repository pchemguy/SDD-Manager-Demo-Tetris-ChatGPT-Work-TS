/** Own one deterministic browser-independent session; browser code only sends commands/elapsed time. */
import {emptyBoard,fits} from './board';
import {cells,spawn} from './pieces';
import {select} from './random';
import type {ActivePiece,Board,Command,Kind,Snapshot,Status} from './types';
/** Encapsulate session rules and provide detached observable snapshots. */
export class Game {
  private board:Board=emptyBoard();
  private active:ActivePiece|null=null;
  private next:Kind='I';
  private status:Status='running';
  private score=0;
  private lines=0;
  private level=1;
  /** Create a fresh running game. Randomness must return finite values in [0,1). */
  constructor(private readonly random:()=>number=Math.random){this.restart();}
  /** Reset progress and draw active then next without rewinding the supplied source. */
  private restart():void {
    this.board=emptyBoard();this.score=0;this.lines=0;this.level=1;this.status='running';
    this.active=spawn(select(this.random));this.next=select(this.random);
  }
  /** Apply an instantaneous command; collisions and ineffective commands report false. */
  apply(command:Command):boolean {
    if(command==='restart'){this.restart();return true;}
    if(this.status!=='running'||!this.active)return false;
    const candidate={...this.active};
    if(command==='left')candidate.x--;
    else if(command==='right')candidate.x++;
    else if(command==='softDrop')candidate.y++;
    else if(command==='rotateClockwise'){
      if(candidate.kind==='O')return false;
      candidate.orientation=(candidate.orientation+1)%4;
    }else return false;
    if(!fits(this.board,cells(candidate)))return false;
    this.active=candidate;
    if(command==='softDrop')this.score++;
    return true;
  }
  /** Return fresh board rows, piece metadata, and occupied coordinates detached from engine state. */
  snapshot():Snapshot {
    return {status:this.status,board:this.board.map(row=>[...row]),active:this.active?{...this.active,cells:cells(this.active)}:null,next:this.next,score:this.score,lines:this.lines,level:this.level,gravityInterval:1000};
  }
  /** Advance gameplay milliseconds; chronological integration follows in the timing task. */
  advance(_elapsed:number):void {}
}
