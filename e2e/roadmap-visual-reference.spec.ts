import { expect, test } from "@playwright/test";

import { createRoadmap } from "./helpers.js";

test("roadmap matches the authored long-scroll grammar on desktop and mobile", async ({ page, request }) => {
  const roadmap = await createRoadmap(request, "import-regulated-product");

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`/roadmaps/${roadmap.id}`);
  await expect(page.getByRole("tab", { name: "Roadmap view" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByLabel("Interactive roadmap")).toBeVisible();
  await page.screenshot({ path: "artifacts/qa/roadmap-desktop.png" });
  await page.screenshot({ path: "artifacts/qa/roadmap-desktop-full.png", fullPage: true });

  const desktopHeight = await page.getByLabel("Interactive roadmap").evaluate((element) => element.scrollHeight);
  expect(desktopHeight).toBeGreaterThan(900);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.getByLabel("Interactive roadmap")).toBeVisible();
  await page.screenshot({ path: "artifacts/qa/roadmap-mobile.png" });
  await page.screenshot({ path: "artifacts/qa/roadmap-mobile-full.png", fullPage: true });

  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
    documentHeight: document.documentElement.scrollHeight,
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
  expect(dimensions.documentHeight).toBeGreaterThan(844 * 2);
});
