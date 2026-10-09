/** Text targets are the narrow external boundary; assertions protect user-observable labels. */
import {it,expect} from 'vitest';
import {Game} from '../../src/engine/game';
import {View} from '../../src/browser/view';
it('updates all statistics and explicit lifecycle labels from snapshots',()=>{const targets={score:{textContent:''},lines:{textContent:''},level:{textContent:''},status:{textContent:''}};const view=new View(targets),s=new Game(()=>0.15).snapshot();view.render({...s,score:412,lines:12,level:2,status:'paused'});expect(targets.score.textContent).toBe('412');expect(targets.lines.textContent).toBe('12');expect(targets.level.textContent).toBe('2');expect(targets.status.textContent).toBe('Paused');view.render({...s,status:'gameOver'});expect(targets.status.textContent).toBe('Game over');});
