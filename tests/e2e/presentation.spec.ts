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
    await page.addInitScript((values) => { let i=0; Math.random=()=>values[i++ % values.length]!; }, drawsForBag(TEST_BAG));
    await page.goto("/");
    for (const viewport of [
      { width: 1024, height: 768 },
      { width: 1440, height: 1000 },
    ]) {
      await page.setViewportSize(viewport);
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
      await page.screenshot({
        path: info.outputPath(`desktop-${viewport.width}-dpr-${ratio}.png`),
      });
    }
    await context.close();
  });
