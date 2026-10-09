/** Build valid game scenarios through public commands only; no production mutation hooks. */
import {Game} from '../../src/engine/game';
/** A conforming source that repeatedly selects O pieces. */
export const repeatedO=()=>new Game(()=>0.15);
/** Move a current O origin to a requested reachable column. */
export function moveTo(game:Game,x:number):void {let guard=0;while(game.snapshot().active!.x!==x){if(++guard>20||!game.apply(game.snapshot().active!.x>x?'left':'right'))throw Error('Unreachable fixture column');}}
/** Soft-drop until grounded, without locking. */
export function ground(game:Game):void {let guard=0;while(game.apply('softDrop'))if(++guard>20)throw Error('Unbounded fixture descent');}
/** Place/lock a current O with exactly its full gravity interval. */
export function placeO(game:Game,x:number):void {moveTo(game,x);ground(game);game.advance(game.snapshot().gravityInterval);}
/** Count locked cells without depending on internal engine fields. */
export function occupied(game:Game):number{return game.snapshot().board.flat().filter(x=>x!==null).length;}
