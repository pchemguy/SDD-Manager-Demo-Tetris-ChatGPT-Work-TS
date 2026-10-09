/** Native keys and controlled time verify the built ghost/drop/full-delay path. */
import { test, expect } from "@playwright/test";
test("ghost landing, scored drop, grounded movement and full delay agree", async ({page}, info) => {
  await page.clock.install({time:new Date("2026-10-09T12:00:00Z")});
  await page.addInitScript(() => { Math.random=()=>.15; });
  await page.goto("/");
  await page.clock.pauseAt(new Date("2026-10-09T12:00:00.900Z"));
  const pixel = (x: number,y: number) => page.locator("#board").evaluate((c:HTMLCanvasElement, p) => Array.from(c.getContext("2d")!.getImageData(p.x*c.width/10,p.y*c.height/20,1,1).data).slice(0,3),{x,y});
  expect(await pixel(4.5,18.5)).toEqual([16,28,43]);
  expect(await pixel(4.07,18.5)).not.toEqual([16,28,43]);
  await page.screenshot({path:info.outputPath("ghost.png")});
  await page.keyboard.press("Space");
  await expect(page.locator("#status")).toHaveText("Playing");
  await expect(page.locator("#score")).toHaveText("36");
  expect(await pixel(4.5,18.5)).toEqual([244,208,111]);
  await page.clock.runFor(900); await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("Space");
  await expect(page.locator("#score")).toHaveText("36");
  await page.clock.runFor(99); expect(await pixel(4.5,.5)).toEqual([16,28,43]);
  await page.clock.runFor(17); expect(await pixel(4.5,.5)).toEqual([244,208,111]);
  await page.keyboard.press("p"); await expect(page.locator("#status")).toHaveText("Paused");
  await page.screenshot({path:info.outputPath("delayed-drop.png")});
  await page.getByRole("button",{name:"Restart game"}).click();
  await expect(page.locator("#score")).toHaveText("0");
});
