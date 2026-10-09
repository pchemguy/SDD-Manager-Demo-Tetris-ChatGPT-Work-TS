/** Geometry expectations derive literally from SPEC S1, independently of implementation helpers. */
import {describe,it,expect} from 'vitest';
import {KINDS,spawn,cells} from '../../src/engine/pieces';
describe('canonical piece geometry',()=>{
 const expected={I:[[3,1],[4,1],[5,1],[6,1]],O:[[4,0],[5,0],[4,1],[5,1]],T:[[4,0],[3,1],[4,1],[5,1]],S:[[4,0],[5,0],[3,1],[4,1]],Z:[[3,0],[4,0],[4,1],[5,1]],J:[[3,0],[3,1],[4,1],[5,1]],L:[[5,0],[3,1],[4,1],[5,1]]};
 for(const kind of KINDS)it(kind+' spawns exactly as specified',()=>expect(cells(spawn(kind)).map(p=>[p.x,p.y])).toEqual(expected[kind]));
 it('four rotations restore every geometry and O is invariant',()=>{
  for(const kind of KINDS){const p=spawn(kind);const initial=cells(p);expect(cells({...p,orientation:4})).toEqual(initial);for(let o=0;o<4;o++){expect(new Set(cells({...p,orientation:o}).map(c=>c.x+','+c.y)).size).toBe(4);if(kind==='O')expect(cells({...p,orientation:o})).toEqual(initial);}}
 });
 it('clockwise T orientation occupies the independently calculated cells',()=>expect(cells({...spawn('T'),orientation:1})).toEqual([{x:5,y:1},{x:4,y:0},{x:4,y:1},{x:4,y:2}]));
});
