import { drawsForBag } from "../helpers/random";
import { TEST_BAG } from "../helpers/scenarios";
/** Verify named keyboard controls and explicit lifecycle labels on the production page. */
import { test, expect } from "@playwright/test";
test("text instructions, named keyboard Restart and explicit lifecycle labels", async ({
  page,
}, info) => {
  await page.clock.install({ time: new Date("2026-10-09T12:00:00Z") });
  await page.addInitScript((values) => { let i=0; Math.random=()=>values[i++ % values.length]!; }, drawsForBag(TEST_BAG));
  await page.goto("/");
  await page.clock.pauseAt(new Date("2026-10-09T12:00:01Z"));
  await expect(page.getByRole("status")).toHaveText("Playing");
  for(const key of ["Space","C","P"])await expect(page.locator(".controls")).toContainText(key);
  await expect(page.locator("#held-kind")).toHaveText("Empty");
  await page.keyboard.press("ArrowDown");
  await expect(page.locator("#score")).toHaveText("1");
  await page.keyboard.press("Tab");
  const restart = page.getByRole("button", { name: "Restart game" });
  await expect(restart).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#score")).toHaveText("0");
  await page.keyboard.press("p");
  await expect(page.getByRole("status")).toHaveText("Paused");
  await page.screenshot({ path: info.outputPath("paused.png") });
  await page.keyboard.press("p");
  await page.keyboard.press("c");
  await page.keyboard.down("ArrowDown");
  await page.clock.runFor(20000);
  await expect(page.getByRole("status")).toHaveText("Game over", {
    timeout: 25000,
  });
  await page.keyboard.up("ArrowDown");
  await expect(page.locator("#held-kind")).toHaveText("O");
  await expect(page.locator("#hold-availability")).toHaveText("Unavailable after game over");
  const ghostPixels=await page.locator("#board").evaluate((c:HTMLCanvasElement)=>{const d=c.getContext("2d")!.getImageData(0,0,c.width,c.height).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i]===185&&d[i+1]===197&&d[i+2]===213)n++;return n;});
  expect(ghostPixels).toBe(0);
  await page.screenshot({ path: info.outputPath("game-over.png") });
  await restart.click();
  await expect(page.getByRole("status")).toHaveText("Playing");
});
