/** Verify real key events under a controlled browser clock; native wall-time checks also run in Firefox. */
import { test, expect, type Page } from "@playwright/test";
async function leftmost(page: Page): Promise<number> {
  return page.locator("#board").evaluate((c: HTMLCanvasElement) => {
    const ctx = c.getContext("2d")!;
    let left = 10;
    for (let y = 0; y < 5; y++)
      for (let x = 0; x < 10; x++)
        if (
          ctx.getImageData(
            ((x + 0.5) * c.width) / 10,
            ((y + 0.5) * c.height) / 20,
            1,
            1,
          ).data[0] !== 16
        )
          left = Math.min(left, x);
    return left;
  });
}
test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date("2026-10-09T12:00:00Z") });
  await page.addInitScript(() => {
    Math.random = () => 0.15;
  });
  await page.goto("/");
  await page.clock.pauseAt(new Date("2026-10-09T12:00:01Z"));
});
test("real holds, opposing priority and key release drive the visible piece", async ({
  page,
}) => {
  expect(await leftmost(page)).toBe(4);
  await page.keyboard.down("ArrowLeft");
  await page.clock.runFor(300);
  expect(await leftmost(page)).toBe(0);
  await page.keyboard.down("ArrowRight");
  await page.clock.runFor(210);
  const right = await leftmost(page);
  expect(right).toBeGreaterThan(1);
  await page.keyboard.up("ArrowRight");
  await page.clock.runFor(190);
  expect(await leftmost(page)).toBeLessThan(right);
  await page.keyboard.up("ArrowLeft");
  await page.keyboard.down("ArrowDown");
  await page.clock.runFor(180);
  await page.keyboard.up("ArrowDown");
  const score = await page.locator("#score").textContent();
  expect(Number(score)).toBeGreaterThanOrEqual(3);
  await page.clock.runFor(150);
  await expect(page.locator("#score")).toHaveText(score!);
  expect(await page.evaluate(() => scrollY)).toBe(0);
});
test("Space hold stays paused, inactive wait stays unchanged and release resumes", async ({
  page,
}) => {
  await page.keyboard.down("Space");
  await expect(page.locator("#status")).toHaveText("Paused");
  const before = await page.locator("#board").screenshot();
  await page.keyboard.down("Space");
  await page.clock.runFor(1200);
  await expect(page.locator("#status")).toHaveText("Paused");
  expect(
    Buffer.compare(before, await page.locator("#board").screenshot()),
  ).toBe(0);
  await page.keyboard.up("Space");
  await page.keyboard.press("Space");
  await expect(page.locator("#status")).toHaveText("Playing");
  expect(await page.evaluate(() => scrollY)).toBe(0);
});
test("browser blur listener pauses with manual return and Restart clears held drop", async ({
  page,
}) => {
  await page.keyboard.down("ArrowDown");
  await page.clock.runFor(100);
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await expect(page.locator("#status")).toHaveText("Paused");
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await page.clock.runFor(100);
  await expect(page.locator("#status")).toHaveText("Paused");
  await page.keyboard.up("ArrowDown");
  await page.keyboard.press("Space");
  await expect(page.locator("#status")).toHaveText("Playing");
  await page.keyboard.down("ArrowDown");
  await page.getByRole("button", { name: "Restart game" }).click();
  await page.clock.runFor(200);
  await expect(page.locator("#score")).toHaveText("0");
  await page.keyboard.up("ArrowDown");
});
