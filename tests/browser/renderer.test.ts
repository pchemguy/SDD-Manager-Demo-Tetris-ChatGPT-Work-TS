/** Model only the Canvas drawing boundary; real pixel/font evidence belongs to browser checks. */
import { it, expect } from "vitest";
import { bagGame } from "../helpers/scenarios";
import { Game } from "../../src/engine/game";
import { Renderer } from "../../src/browser/renderer";
function canvas(width: number, height: number) {
  const paints: {
    color: string;
    x: number;
    y: number;
    w: number;
    h: number;
  }[] = [];
  const strokes: { color: string; x: number; y: number; w: number; h: number; fillsBefore: number }[] = [];
  const context = {
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
    fillRect(x: number, y: number, w: number, h: number) {
      paints.push({ color: this.fillStyle, x, y, w, h });
    },
    strokeRect(x: number, y: number, w: number, h: number) {
      strokes.push({color: this.strokeStyle, x, y, w, h, fillsBefore: paints.length});
    },
    clearRect() {},
    setTransform() {},
  };
  return {
    element: {
      width,
      height,
      getBoundingClientRect: () => ({ width, height }),
      getContext: () => context,
    } as unknown as HTMLCanvasElement,
    paints,
    strokes,
  };
}
it("paints independent locked and active cells plus next geometry", () => {
  const b = canvas(300, 600),
    p = canvas(120, 120);
  const s = bagGame().snapshot();
  s.board[19]![0] = "I";
  new Renderer(b.element, p.element).render(s);
  expect(
    b.paints.some((v) => v.x === 1 && v.y === 571 && v.w === 28 && v.h === 28),
  ).toBe(true);
  expect(
    b.paints.some((v) => v.x === 121 && v.y === 1 && v.w === 28 && v.h === 28),
  ).toBe(true);
  expect(p.paints.filter((v) => v.w > 0 && v.h > 0)).toHaveLength(5);
  expect(s.board[19]![0]).toBe("I");
});
it("sizes the backing store to measured CSS pixels times device pixel ratio", () => {
  const b = canvas(300, 600),
    p = canvas(120, 120);
  Object.assign(b.element, {
    getBoundingClientRect: () => ({ width: 360, height: 720 }),
  });
  Object.assign(p.element, {
    getBoundingClientRect: () => ({ width: 120, height: 120 }),
  });
  new Renderer(b.element, p.element, () => 2).render(
    bagGame().snapshot(),
  );
  expect([b.element.width, b.element.height]).toEqual([720, 1440]);
  expect([p.element.width, p.element.height]).toEqual([240, 240]);
  expect(
    b.paints.some((v) => v.x === 145 && v.y === 1 && v.w === 34 && v.h === 34),
  ).toBe(true);
});
it("keeps backing cells square when fractional CSS sizes would round axes differently", () => {
  const b = canvas(293.75, 587.5),
    p = canvas(96, 96);
  new Renderer(b.element, p.element, () => 2).render(
    bagGame().snapshot(),
  );
  expect(b.element.height).toBe(b.element.width * 2);
});

it("draws inset ghost outlines before active solid cells, including paused overlap", () => {
  const b = canvas(300, 600), p = canvas(120, 120);
  const g = bagGame(); g.apply("hardDrop"); g.apply("pause");
  const s = g.snapshot(); new Renderer(b.element, p.element).render(s);
  const outline = b.strokes.filter(v => v.w === 26 && v.h === 26);
  expect(outline).toHaveLength(4);
  expect(outline[0]).toMatchObject({x:122,y:542,fillsBefore:1});
  expect(b.paints.at(-4)).toMatchObject({x:121,y:541,w:28,h:28});
});
it("paints canonical held geometry and explicitly clears empty held previews", () => {
  const b=canvas(300,600),p=canvas(120,120),h=canvas(120,120),g=bagGame();
  const renderer=new Renderer(b.element,p.element,()=>1,h.element);
  renderer.render(g.snapshot());expect(h.paints).toHaveLength(1);
  g.apply("hold");renderer.render(g.snapshot());expect(h.paints).toHaveLength(6);
  expect(h.paints.slice(-4).every(v=>v.color==="#f4d06f")).toBe(true);
});
