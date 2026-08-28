import { expect, test } from "@playwright/test";

import { createRoadmap } from "./helpers.js";
import { projectRoadmapGraph } from "../src/lib/roadmap-graph.js";

test("roadmap matches the authored long-scroll grammar on desktop and mobile", async ({ page, request }) => {
  const roadmap = await createRoadmap(request, "import-regulated-product");

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`/roadmaps/${roadmap.id}`);
  await expect(page.getByRole("tab", { name: "Roadmap view" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByLabel("Interactive roadmap")).toBeVisible();
  const graph = projectRoadmapGraph(roadmap);
  for (const edge of graph.edges) {
    const connector = page.locator(`[data-roadmap-edge="${edge.id}"]`);
    await expect(connector).toHaveCount(1);
    await expect(connector).toHaveAttribute("data-edge-source", edge.source);
    await expect(connector).toHaveAttribute("data-edge-target", edge.target);
    await expect(connector).toBeVisible();
    await expect(connector.locator("svg path")).toBeVisible();
  }
  const dependentTask = roadmap.tasks.find((task) => task.dependencies.length > 0);
  expect(dependentTask).toBeDefined();
  const predecessor = roadmap.tasks.find((task) => task.id === dependentTask!.dependencies[0]);
  expect(predecessor).toBeDefined();
  const dependentTile = page.locator(`[data-task-id="${dependentTask!.id}"]`);
  await expect(dependentTile).toHaveAttribute("data-depends-on", new RegExp(predecessor!.id));
  await expect(dependentTile).toContainText(`After ${predecessor!.title}`);
  const stateTreatments = await page.locator("[data-task-id]").evaluateAll((tiles) =>
    tiles.map((tile) => ({
      status: (tile as HTMLElement).dataset.status,
      tone: (tile as HTMLElement).dataset.stateTone,
      background: getComputedStyle(tile).backgroundColor,
    })),
  );
  expect(new Set(stateTreatments.map(({ tone }) => tone)).size).toBeGreaterThan(1);
  expect(new Set(stateTreatments.map(({ background }) => background)).size).toBeGreaterThan(1);
  await page.screenshot({ path: "artifacts/qa/roadmap-desktop.png" });
  await page.screenshot({ path: "artifacts/qa/roadmap-desktop-full.png", fullPage: true });

  const desktopHeight = await page.getByLabel("Interactive roadmap").evaluate((element) => element.scrollHeight);
  expect(desktopHeight).toBeGreaterThan(900);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.getByLabel("Interactive roadmap")).toBeVisible();
  await expect(page.locator("[data-roadmap-edge]")).toHaveCount(graph.edges.length);
  await expect(page.locator("[data-roadmap-edge]").first()).toBeVisible();
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
