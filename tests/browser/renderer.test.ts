/** Model only the Canvas drawing boundary; real pixel/font evidence belongs to browser checks. */
import {it,expect} from 'vitest';
import {Game} from '../../src/engine/game';
import {Renderer} from '../../src/browser/renderer';
function canvas(width:number,height:number){const paints:{color:string;x:number;y:number;w:number;h:number}[]=[];const context={fillStyle:'',strokeStyle:'',lineWidth:1,fillRect(x:number,y:number,w:number,h:number){paints.push({color:this.fillStyle,x,y,w,h});},strokeRect(){},clearRect(){},setTransform(){}};return {element:{width,height,getContext:()=>context} as unknown as HTMLCanvasElement,paints};}
it('paints independent locked and active cells plus next geometry',()=>{const b=canvas(300,600),p=canvas(120,120);const s=new Game(()=>0.15).snapshot();s.board[19]![0]='I';new Renderer(b.element,p.element).render(s);expect(b.paints.some(v=>v.x===1&&v.y===571&&v.w===28&&v.h===28)).toBe(true);expect(b.paints.some(v=>v.x===121&&v.y===1&&v.w===28&&v.h===28)).toBe(true);expect(p.paints.filter(v=>v.w>0&&v.h>0)).toHaveLength(5);expect(s.board[19]![0]).toBe('I');});
