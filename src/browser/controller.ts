/** Bridge browser events and elapsed time to the engine; rendering consumes snapshots. */
import {Game} from '../engine/game';
import type {Snapshot,Command} from '../engine/types';
export interface Clock {now():number;request(callback:FrameRequestCallback):number;cancel(id:number):void}
const COMMANDS:Record<string,Command>={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'rotateClockwise',ArrowDown:'softDrop'};
/** Own the browser loop and discrete event subscriptions. */
export class Controller {
  private last:number;
  private frameId=0;
  private disposed=false;
  constructor(private readonly game:Game,private readonly keys:EventTarget,private readonly restart:EventTarget,private readonly clock:Clock,private readonly render:(s:Snapshot)=>void){
    this.last=clock.now();keys.addEventListener('keydown',this.keydown);restart.addEventListener('click',this.reset);
    this.draw();this.frameId=clock.request(this.frame);
  }
  private draw=():void=>{this.render(this.game.snapshot());};
  private tick(at:number):void{this.game.advance(Math.max(0,at-this.last));this.last=at;}
  private frame:FrameRequestCallback=at=>{if(this.disposed)return;this.tick(at);this.draw();this.frameId=this.clock.request(this.frame);};
  private keydown=(event:Event):void=>{const e=event as KeyboardEvent,command=COMMANDS[e.key];if(!command)return;e.preventDefault();if(e.repeat)return;this.tick(this.clock.now());this.game.apply(command);this.draw();};
  private reset=():void=>{this.game.apply('restart');this.last=this.clock.now();this.draw();};
  /** Cancel the loop and release subscriptions; repeated disposal is harmless. */
  dispose():void{if(this.disposed)return;this.disposed=true;this.clock.cancel(this.frameId);this.keys.removeEventListener('keydown',this.keydown);this.restart.removeEventListener('click',this.reset);}
}
