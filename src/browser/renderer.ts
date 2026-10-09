/** Paint detached engine snapshots; gameplay state and rules stay in the engine. */
import {cells,spawn} from '../engine/pieces';
import type {Kind,Snapshot} from '../engine/types';
const COLORS:Record<Kind,string>={I:'#53d9e9',O:'#f4d06f',T:'#b19aea',S:'#83cfa2',Z:'#ee8792',J:'#7da4ee',L:'#eeae77'};
/** Board and preview painter, with separate contexts and no retained game snapshot. */
export class Renderer {
  private readonly context:CanvasRenderingContext2D;
  private readonly previewContext:CanvasRenderingContext2D;
  /** Require working 2D Canvas contexts; throw instead of pretending a blank board rendered. */
  constructor(private readonly board:HTMLCanvasElement,private readonly preview:HTMLCanvasElement){
    const context=board.getContext('2d'),previewContext=preview.getContext('2d');
    if(!context||!previewContext)throw new Error('A 2D Canvas context is required');
    this.context=context;this.previewContext=previewContext;
  }
  /** Paint one piece cell with a small inset that makes neighboring squares legible. */
  private paint(ctx:CanvasRenderingContext2D,x:number,y:number,size:number,kind:Kind):void{
    ctx.fillStyle=COLORS[kind];ctx.fillRect(x+1,y+1,size-2,size-2);
  }
  /** Paint locked/active geometry and a centered preview from the supplied immutable observation. */
  render(snapshot:Snapshot):void{
    const ctx=this.context,size=this.board.width/10;
    ctx.fillStyle='#101c2b';ctx.fillRect(0,0,this.board.width,this.board.height);
    ctx.strokeStyle='#223044';ctx.lineWidth=1;
    for(let y=0;y<20;y++)for(let x=0;x<10;x++){
      ctx.strokeRect(x*size,y*size,size,size);
      const kind=snapshot.board[y]![x];if(kind)this.paint(ctx,x*size,y*size,size,kind);
    }
    if(snapshot.active)for(const {x,y} of snapshot.active.cells)this.paint(ctx,x*size,y*size,size,snapshot.active.kind);
    const p=this.previewContext,points=cells({...spawn(snapshot.next),x:0,y:0});
    p.fillStyle='#142235';p.fillRect(0,0,this.preview.width,this.preview.height);
    const minX=Math.min(...points.map(c=>c.x)),maxX=Math.max(...points.map(c=>c.x));
    const minY=Math.min(...points.map(c=>c.y)),maxY=Math.max(...points.map(c=>c.y));
    const unit=24,offsetX=(this.preview.width-(maxX-minX+1)*unit)/2,offsetY=(this.preview.height-(maxY-minY+1)*unit)/2;
    for(const {x,y} of points)this.paint(p,offsetX+(x-minX)*unit,offsetY+(y-minY)*unit,unit,snapshot.next);
  }
}
