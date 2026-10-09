/** Compose a fresh engine, Canvas/HTML presentation and browser controller. */
import "./styles.css";
import { Game } from "./engine/game";
import { Renderer } from "./browser/renderer";
import { View } from "./browser/view";
import { Controller } from "./browser/controller";
const element = <T extends HTMLElement>(id: string): T => {
  const node = document.getElementById(id);
  if (!node) throw Error(`Missing game element: ${id}`);
  return node as T;
};
const game = new Game(),
  renderer = new Renderer(
    element<HTMLCanvasElement>("board"),
    element<HTMLCanvasElement>("preview"),
  );
const view = new View({
  score: element("score"),
  lines: element("lines"),
  level: element("level"),
  status: element("status"),
  next: element("next-kind"),
});
const controller = new Controller(
  game,
  window,
  element("restart"),
  {
    now: () => performance.now(),
    request: (fn) => requestAnimationFrame(fn),
    cancel: (id) => cancelAnimationFrame(id),
  },
  (s) => {
    renderer.render(s);
    view.render(s);
  },
  document,
);
window.addEventListener("pagehide", () => controller.dispose(), { once: true });
