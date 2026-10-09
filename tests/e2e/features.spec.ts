import { drawsForBag } from "../helpers/random";
import { TEST_BAG } from "../helpers/scenarios";
/** Native keys and controlled time verify the built ghost/drop/full-delay path. */
import { test, expect } from "@playwright/test";
test("ghost landing, scored drop, grounded movement and full delay agree", async ({page}, info) => {
  await page.clock.install({time:new Date("2026-10-09T12:00:00Z")});
  await page.addInitScript((values) => { let i=0; Math.random=()=>values[i++ % values.length]!; }, drawsForBag(TEST_BAG));
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
  await page.clock.runFor(17); expect(await pixel(4.5,1.5)).toEqual([83,217,233]);
  await page.keyboard.press("p"); await expect(page.locator("#status")).toHaveText("Paused");
  await page.screenshot({path:info.outputPath("delayed-drop.png")});
  await page.getByRole("button",{name:"Restart game"}).click();
  await expect(page.locator("#score")).toHaveText("0");
});
test("native C hold shows empty, consumed, swap and paused states with bag-backed next", async ({page},info) => {
  await page.clock.install({time:new Date("2026-10-09T12:00:00Z")});
  await page.addInitScript((values)=>{let i=0;Math.random=()=>values[i++ % values.length]!;},drawsForBag(TEST_BAG));
  await page.goto("/");await page.clock.pauseAt(new Date("2026-10-09T12:00:01Z"));
  await expect(page.locator("#held-kind")).toHaveText("Empty");await expect(page.locator("#next-kind")).toHaveText("I");
  await page.keyboard.press("c");await expect(page.locator("#held-kind")).toHaveText("O");
  await expect(page.locator("#next-kind")).toHaveText("T");await expect(page.locator("#hold-availability")).toHaveText("Used until lock");
  await page.keyboard.press("C");await expect(page.locator("#next-kind")).toHaveText("T");
  const held = await page.locator("#held-preview").evaluate((c:HTMLCanvasElement)=>Array.from(c.getContext("2d")!.getImageData(c.width*.4,c.height*.4,1,1).data).slice(0,3));
  expect(held).toEqual([244,208,111]);await page.screenshot({path:info.outputPath("held-used.png")});
  await page.keyboard.press("Space");await page.clock.runFor(1016);await expect(page.locator("#hold-availability")).toHaveText("Available · C");
  const next=await page.locator("#next-kind").textContent();await page.keyboard.press("c");
  await expect(page.locator("#held-kind")).toHaveText("T");await expect(page.locator("#next-kind")).toHaveText(next!);
  await page.keyboard.press("p");await expect(page.locator("#hold-availability")).toHaveText("Unavailable while paused");
  await page.screenshot({path:info.outputPath("held-paused.png")});
  await page.getByRole("button",{name:"Restart game"}).click();await expect(page.locator("#held-kind")).toHaveText("Empty");
});
test("native clockwise wall kick rotates a vertical I from the left wall", async ({page},info) => {
  await page.clock.install({time:new Date("2026-10-09T12:00:00Z")});
  await page.addInitScript((values)=>{let i=0;Math.random=()=>values[i++ % values.length]!;},drawsForBag(TEST_BAG));
  await page.goto("/");await page.clock.pauseAt(new Date("2026-10-09T12:00:01Z"));
  await page.keyboard.press("c");await page.keyboard.press("ArrowUp");
  for(let n=0;n<5;n++)await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowUp");
  const points=await page.locator("#board").evaluate((c:HTMLCanvasElement)=>{
    const points=[];for(let y=0;y<5;y++)for(let x=0;x<10;x++){
      const data=c.getContext("2d")!.getImageData((x+.5)*c.width/10,(y+.5)*c.height/20,1,1).data;
      if(data[0]===83)points.push({x,y});
    }return points;
  });
  expect(points).toEqual([{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2}]);
  await page.screenshot({path:info.outputPath("wall-kick.png")});
});
