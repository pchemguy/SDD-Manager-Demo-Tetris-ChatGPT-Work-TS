import { drawsForBag } from "../helpers/random";
import { TEST_BAG } from "../helpers/scenarios";
/** Inspect production Canvas pixels, desktop bounds and device-pixel backing dimensions. */
import { test, expect } from "@playwright/test";
for (const ratio of [1, 2])
  test(`square unclipped board and sharp backing pixels at DPR ${ratio}`, async ({
    browser,
  }, info) => {
    const context = await browser.newContext({
      viewport: { width: 1024, height: 768 },
      deviceScaleFactor: ratio,
    });
    const page = await context.newPage();
    await page.clock.install({time:new Date("2026-10-09T12:00:00Z")});
    await page.addInitScript((values) => { let i=0; Math.random=()=>values[i++ % values.length]!; }, drawsForBag(TEST_BAG));
    await page.goto("/");
    await page.clock.pauseAt(new Date("2026-10-09T12:00:01Z"));
    for (const viewport of [
      { width: 1024, height: 768 },
      { width: 1440, height: 1000 },
    ]) {
      await page.setViewportSize(viewport);
      await page.clock.runFor(16); // Resize rendering needs a frame even with a paused test clock.
      await expect
        .poll(() =>
          page.locator("#board").evaluate((c: HTMLCanvasElement) => c.width),
        )
        .toBe(
          Math.round(
            (await page.locator("#board").boundingBox())!.width * ratio,
          ),
        );
      const bounds = (await page.locator("#board").boundingBox())!;
      expect(bounds.height).toBe(bounds.width * 2);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(viewport.height);
      const button = (await page.locator("#restart").boundingBox())!;
      expect(button.x + button.width).toBeLessThanOrEqual(viewport.width);
      expect(button.y + button.height).toBeLessThanOrEqual(viewport.height);
      const pixels = await page
        .locator("#board")
        .evaluate((c: HTMLCanvasElement) => {
          const ctx = c.getContext("2d")!;
          let colored = 0;
          for (let y = 0; y < 20; y++)
            for (let x = 0; x < 10; x++)
              if (
                ctx.getImageData(
                  ((x + 0.5) * c.width) / 10,
                  ((y + 0.5) * c.height) / 20,
                  1,
                  1,
                ).data[0] !== 16
              )
                colored++;
          return { colored, width: c.width, height: c.height };
        });
      expect(pixels.colored).toBe(4);
      expect(pixels.height).toBe(pixels.width * 2);
      for (const id of ["preview","held-preview","instructions","restart"]){
        const box=(await page.locator(`#${id}`).boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(0);expect(box.y+box.height).toBeLessThanOrEqual(viewport.height);
        expect(box.x+box.width).toBeLessThanOrEqual(viewport.width);
      }
      await expect(page.locator("#held-kind")).toHaveText("Empty");
      await page.screenshot({path:info.outputPath(`desktop-${viewport.width}-dpr-${ratio}.png`)});
      await page.keyboard.press("c");await page.keyboard.press("Space");
      await expect(page.locator("#held-kind")).toHaveText("O");
      const held=await page.locator("#held-preview").evaluate((c:HTMLCanvasElement)=>({w:c.width,h:c.height,css:c.getBoundingClientRect().width,color:Array.from(c.getContext("2d")!.getImageData(c.width*.4,c.height*.4,1,1).data).slice(0,3)}));
      expect(held.w).toBe(Math.round(held.css*ratio));expect(held.h).toBe(held.w);expect(held.color).toEqual([244,208,111]);
      await page.screenshot({path:info.outputPath(`overlap-${viewport.width}-dpr-${ratio}.png`)});
      await page.keyboard.press("p");await expect(page.locator("#hold-availability")).toHaveText("Unavailable while paused");
      await page.screenshot({path:info.outputPath(`held-paused-${viewport.width}-dpr-${ratio}.png`)});
      for(const selector of ["#instructions","#restart","footer"]){
        const box=(await page.locator(selector).boundingBox())!;expect(box.y+box.height).toBeLessThanOrEqual(viewport.height);
      }
      await page.getByRole("button",{name:"Restart game"}).click();
    }
    await context.close();
  });
