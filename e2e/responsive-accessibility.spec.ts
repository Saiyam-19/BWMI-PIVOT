import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { createRoadmap } from "./helpers.js";

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const overflow = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
  }));
  expect(overflow.documentWidth).toBeLessThanOrEqual(overflow.viewportWidth);
}

test("desktop supports keyboard-only linear navigation, sheet focus, and critical accessibility", async ({ page, request }) => {
  const roadmap = await createRoadmap(request, "post-death-regulated-assets");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const landingResults = await new AxeBuilder({ page }).analyze();
  expect(landingResults.violations.filter((violation) => violation.impact === "critical")).toEqual([]);

  await page.goto(`/roadmaps/${roadmap.id}`);
  await expectNoHorizontalOverflow(page);

  const linearTab = page.getByRole("tab", { name: "Accessible list" });
  await linearTab.focus();
  await page.keyboard.press("Enter");
  await expect(linearTab).toHaveAttribute("aria-selected", "true");

  const firstTask = page.locator("ol > li button").first();
  await firstTask.focus();
  await page.keyboard.press("Enter");
  const sheet = page.getByRole("dialog");
  await expect(sheet).toBeVisible();
  expect(await sheet.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(sheet).toBeHidden();
  await expect(firstTask).toBeFocused();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => violation.impact === "critical")).toEqual([]);
});

test("mobile has no page overflow and keeps the task sheet usable", async ({ page, request }) => {
  const roadmap = await createRoadmap(request, "urgent-cyber-financial-fraud");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/roadmaps/${roadmap.id}`);
  await expectNoHorizontalOverflow(page);
  await page.getByRole("tab", { name: "Accessible list" }).click();
  await page.locator("ol > li button").first().click();
  const sheet = page.getByRole("dialog");
  await expect(sheet).toBeVisible();
  const box = await sheet.boundingBox();
  expect(box?.width).toBeLessThanOrEqual(390);
  await expectNoHorizontalOverflow(page);
});

test("reduced-motion preference suppresses interface animation", async ({ page, request }) => {
  const roadmap = await createRoadmap(request, "reusable-central-foundations");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`/roadmaps/${roadmap.id}`);
  await page.getByRole("tab", { name: "Accessible list" }).click();
  await page.locator("ol > li button").first().click();
  const sheet = page.getByRole("dialog");
  const durations = await sheet.evaluate((element) => {
    const style = getComputedStyle(element);
    return { animation: style.animationDuration, transition: style.transitionDuration };
  });
  expect(Number.parseFloat(durations.animation)).toBeLessThanOrEqual(0.00001);
  expect(Number.parseFloat(durations.transition)).toBeLessThanOrEqual(0.00001);
});
