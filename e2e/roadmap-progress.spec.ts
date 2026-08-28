import { expect, test } from "@playwright/test";

import {
  answerEveryQuestion,
  createRoadmap,
  createRoadmapWithReadyTask,
} from "./helpers.js";

test("answers change the graph while explicit unknowns stay blocked", async ({ page, request }) => {
  const unknown = await createRoadmap(request, "import-regulated-product");
  const before = unknown.tasks.map(({ id, status, actionability }) => ({ id, status, actionability }));
  const answered = await answerEveryQuestion(request, unknown);
  const after = answered.tasks.map(({ id, status, actionability }) => ({ id, status, actionability }));

  expect(after).not.toEqual(before);
  expect(answered.tasks.some((task) => task.actionability === "actionable")).toBe(true);
  expect(unknown.tasks.some((task) => task.status === "needs-information")).toBe(true);

  await page.goto(`/roadmaps/${unknown.id}`);
  await page.getByRole("tab", { name: "Linear view" }).click();
  const withheld = page.getByText("Instructions withheld").first();
  await expect(withheld).toBeVisible();
  await withheld.locator("xpath=ancestor::button").click();
  const sheet = page.getByRole("dialog");
  await expect(sheet.getByText("Instructions withheld")).toBeVisible();
  await expect(sheet.getByRole("link", { name: /^Open / })).toHaveCount(0);
});

test("task detail is proof-gated and completed progress survives reload", async ({ page, request }) => {
  const { roadmap, task } = await createRoadmapWithReadyTask(request);

  await page.goto(`/roadmaps/${roadmap.id}`);
  await page.getByRole("tab", { name: "Linear view" }).click();
  const trigger = page.getByRole("button", { name: new RegExp(task.title, "i") });
  await trigger.click();
  const sheet = page.getByRole("dialog");
  await expect(sheet.getByRole("heading", { name: task.title })).toBeVisible();
  await expect(sheet.getByText("Expected completion proof")).toBeVisible();

  const officialLink = sheet.getByRole("link", { name: /^Open / }).first();
  if (await officialLink.count()) {
    const href = await officialLink.getAttribute("href");
    expect(href).toMatch(/^https:\/\//);
    expect(await officialLink.getAttribute("target")).toBe("_blank");
    expect(await officialLink.getAttribute("rel")).toContain("noopener");
  }

  await sheet.getByRole("button", { name: "Mark completed" }).click();
  await expect(sheet.getByText(/Confirm that you received the expected proof/)).toBeVisible();
  await sheet.getByRole("checkbox", { name: /I received the expected proof/ }).check();
  await sheet.getByRole("button", { name: "Mark completed" }).click();
  await expect(sheet.getByText("Completion proof confirmed")).toBeVisible();

  await page.reload();
  await page.getByRole("tab", { name: "Linear view" }).click();
  await page.getByRole("button", { name: new RegExp(task.title, "i") }).click();
  await expect(page.getByRole("dialog").getByText("Completion proof confirmed")).toBeVisible();
});

test("the API independently rejects completion without proof", async ({ request }) => {
  const { roadmap, task } = await createRoadmapWithReadyTask(request);

  const rejected = await request.patch(`/api/roadmaps/${roadmap.id}/tasks/${task.id}`, {
    data: { to: "completed" },
  });
  expect(rejected.status()).toBe(409);
  await expect(rejected.json()).resolves.toMatchObject({
    error: { code: "completion_proof_required" },
  });
});
