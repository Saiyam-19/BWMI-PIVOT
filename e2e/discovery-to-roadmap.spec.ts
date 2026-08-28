import { expect, test } from "@playwright/test";

import { createRoadmap, outcomes } from "./helpers.js";

test("natural-language import reaches a fail-closed roadmap", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Describe the outcome you need").fill(
    "I want to import Bluetooth headphones from China and sell them in India",
  );
  await page.getByRole("button", { name: "Build my roadmap" }).click();
  await page.waitForURL(/\/roadmaps\//);

  await expect(page.getByRole("heading", {
    level: 1,
    name: outcomes[0][1],
  })).toBeVisible();
  await page.getByRole("button", { name: /Personalize this roadmap/i }).click();
  await expect(page.getByText(/does not collect or upload documents/i)).toBeVisible();
  await page.getByRole("button", { name: /Leave unknown/i }).click();
  await page.getByRole("button", { name: /Personalize this roadmap/i }).click();
  await page.getByRole("combobox", { name: /Is the shipment new finished goods/i }).click();
  await page.getByRole("option", { name: "New finished goods" }).click();
  await page.getByRole("button", { name: "Save answer" }).click();
  await expect(page.locator("#top").getByText("10 questions left to answer")).toBeVisible();
  await expect(page.locator("#top").getByText(/1 left unknown/)).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: outcomes[0][1] })).toBeVisible();
  await page.getByRole("tab", { name: "Accessible list" }).click();
  await expect(page.getByText("Instructions withheld").first()).toBeVisible();
});

test("browse-entry post-death claims reaches the same roadmap engine", async ({ page }) => {
  await page.goto("/");
  const outcomeCard = page.getByRole("button", {
    name: new RegExp(outcomes[4][1], "i"),
  });
  await outcomeCard.focus();
  await page.keyboard.press("Enter");
  await page.waitForURL(/\/roadmaps\//);

  await expect(page.getByRole("heading", {
    level: 1,
    name: outcomes[4][1],
  })).toBeVisible();
  await expect(page).toHaveURL(/\/roadmaps\//);
});

test("all seven cards are present and every outcome generates a rendered roadmap", async ({ page, request }) => {
  await page.goto("/");
  for (const [, title] of outcomes) {
    await expect(page.getByRole("button", { name: new RegExp(title, "i") })).toBeVisible();
  }

  for (const [outcomeId, title] of outcomes) {
    const roadmap = await createRoadmap(request, outcomeId);
    expect(roadmap.tasks.length).toBeGreaterThan(0);
    await page.goto(`/roadmaps/${roadmap.id}`);
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
    await page.getByRole("tab", { name: "Accessible list" }).click();
    await expect(page.locator("ol > li").first()).toBeVisible();
  }
});
