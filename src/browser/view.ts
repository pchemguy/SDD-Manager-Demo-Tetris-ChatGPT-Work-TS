/** HTML statistics/status presentation consumes snapshots without changing gameplay. */
import type {Snapshot} from '../engine/types';
export type TextTarget=Pick<HTMLElement,'textContent'>;
export type ViewTargets=Record<'score'|'lines'|'level'|'status',TextTarget>;
/** Project engine statistics into accessible textual elements. */
export class View {
  constructor(private readonly targets:ViewTargets){}
  /** Synchronize all visible statistics and explicit lifecycle labels. */
  render(snapshot:Snapshot):void{
    this.targets.score.textContent=String(snapshot.score);this.targets.lines.textContent=String(snapshot.lines);
    this.targets.level.textContent=String(snapshot.level);
    this.targets.status.textContent={running:'Playing',paused:'Paused',gameOver:'Game over'}[snapshot.status];
  }
}
