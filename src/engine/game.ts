/** Own one deterministic browser-independent session; browser code only sends commands/elapsed time. */
import {emptyBoard,fits,place,clearRows} from './board';
import {cells,spawn} from './pieces';
import {select} from './random';
import {gravity,levelFor,lineAward} from './progression';
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
  private gravityAge=0;
  private lockRemaining:number|null=null;
  /** Create a fresh running game. Randomness must return finite values in [0,1). */
  constructor(private readonly random:()=>number=Math.random){this.restart();}
  /** Reset progress and draw active then next without rewinding the supplied source. */
  private restart():void {
    this.board=emptyBoard();this.score=0;this.lines=0;this.level=1;this.status='running';
    this.active=spawn(select(this.random));this.next=select(this.random);
    this.gravityAge=0;this.lockRemaining=null;this.updateGrounding();
  }
  /** Apply an instantaneous command; collisions and ineffective commands report false. */
  apply(command:Command):boolean {
    if(command==='restart'){this.restart();return true;}
    if(command==='pause'){if(this.status!=='running')return false;this.status='paused';return true;}
    if(command==='resume'){if(this.status!=='paused')return false;this.status='running';return true;}
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
    this.updateGrounding();
    if(command==='softDrop')this.score++;
    return true;
  }
  /** Return fresh board rows, piece metadata, and occupied coordinates detached from engine state. */
  snapshot():Snapshot {
    return {status:this.status,board:this.board.map(row=>[...row]),active:this.active?{...this.active,cells:cells(this.active)}:null,next:this.next,score:this.score,lines:this.lines,level:this.level,gravityInterval:gravity(this.level)};
  }
  /** Reconcile grounded transitions without refreshing a timer that is already running. */
  private updateGrounding():void {
    if(!this.active){this.lockRemaining=null;return;}
    const grounded=!fits(this.board,cells({...this.active,y:this.active.y+1}));
    if(!grounded)this.lockRemaining=null;
    else if(this.lockRemaining===null)this.lockRemaining=gravity(this.level);
  }
  /** Commit one piece, compact rows, then spawn or top out before later timer events. */
  private lock():void {
    if(!this.active)return;
    const compacted=clearRows(place(this.board,cells(this.active),this.active.kind));
    this.board=compacted.board;this.score+=lineAward(compacted.cleared,this.level);
    this.lines+=compacted.cleared;this.level=levelFor(this.lines);
    const candidate=spawn(this.next);
    this.gravityAge=0;this.lockRemaining=null;
    if(!fits(this.board,cells(candidate))){this.active=null;this.status='gameOver';return;}
    this.active=candidate;this.next=select(this.random);this.updateGrounding();
  }
  /** Advance finite nonnegative gameplay milliseconds; invalid input throws before any mutation, including when inactive. Paused/game-over time is ignored. */
  advance(elapsed:number):void {
    if(!Number.isFinite(elapsed)||elapsed<0)throw new RangeError('Elapsed time must be finite and nonnegative');
    if(elapsed===0||this.status!=='running')return;
    let remaining=elapsed;
    while(remaining>0&&this.status==='running'&&this.active){
      const gravityRemaining=gravity(this.level)-this.gravityAge;
      const lockRemaining=this.lockRemaining??Infinity;
      const step=Math.min(remaining,gravityRemaining,lockRemaining);
      const lockDue=step===lockRemaining,gravityDue=step===gravityRemaining;
      remaining-=step;this.gravityAge+=step;
      if(this.lockRemaining!==null)this.lockRemaining-=step;
      // A lock/gravity tie belongs to the outgoing piece's lock, never a descent of its successor.
      if(lockDue){this.lock();continue;}
      if(gravityDue){
        this.gravityAge=0;
        const candidate={...this.active,y:this.active.y+1};
        if(fits(this.board,cells(candidate)))this.active=candidate;
        this.updateGrounding();
      }
    }
  }
}
