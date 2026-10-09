/** Verify named keyboard controls and explicit lifecycle labels on the production page. */
import { test, expect } from "@playwright/test";
test("text instructions, named keyboard Restart and explicit lifecycle labels", async ({
  page,
}, info) => {
  await page.clock.install({ time: new Date("2026-10-09T12:00:00Z") });
  await page.addInitScript(() => {
    Math.random = () => 0.15;
  });
  await page.goto("/");
  await page.clock.pauseAt(new Date("2026-10-09T12:00:01Z"));
  await expect(page.getByRole("status")).toHaveText("Playing");
  await expect(page.locator(".controls")).toContainText("Space");
  await page.keyboard.press("ArrowDown");
  await expect(page.locator("#score")).toHaveText("1");
  await page.keyboard.press("Tab");
  const restart = page.getByRole("button", { name: "Restart game" });
  await expect(restart).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#score")).toHaveText("0");
  await page.keyboard.press("Space");
  await expect(page.getByRole("status")).toHaveText("Paused");
  await page.screenshot({ path: info.outputPath("paused.png") });
  await page.keyboard.press("Space");
  await page.keyboard.down("ArrowDown");
  await page.clock.runFor(20000);
  await expect(page.getByRole("status")).toHaveText("Game over", {
    timeout: 25000,
  });
  await page.keyboard.up("ArrowDown");
  await page.screenshot({ path: info.outputPath("game-over.png") });
  await restart.click();
  await expect(page.getByRole("status")).toHaveText("Playing");
});
