import { expect, test } from "@playwright/test";

import {
  createRoadmap,
  createRoadmapWithReadyTask,
} from "./helpers.js";

test("adverse and explicit-unknown authored answers remain fail-closed", async ({ page, request }) => {
  const unknown = await createRoadmap(request, "import-regulated-product");
  const before = unknown.tasks.map(({ id, status, actionability }) => ({ id, status, actionability }));
  const conditionQuestion = unknown.questions.find((question) =>
    question.options.includes("Waste or scrap")
  );
  expect(conditionQuestion).toBeDefined();

  const adverseResponse = await request.patch(`/api/roadmaps/${unknown.id}/answers`, {
    data: { answers: { [conditionQuestion!.factKey]: "Waste or scrap" } },
  });
  expect(adverseResponse.ok()).toBe(true);
  const adverse = (await adverseResponse.json() as { data: typeof unknown }).data;
  const afterAdverse = adverse.tasks.map(({ id, status, actionability }) => ({ id, status, actionability }));

  expect(adverse.answers[conditionQuestion!.factKey]).toBe("Waste or scrap");
  expect(afterAdverse).toEqual(before);
  expect(adverse.questions.some((question) => question.factKey === conditionQuestion!.factKey)).toBe(true);
  expect(conditionQuestion!.blocksTaskIds.every((taskId) => {
    const task = adverse.tasks.find((candidate) => candidate.id === taskId);
    return task?.actionability === "withheld" && task.missingAnswers.includes(conditionQuestion!.factKey);
  })).toBe(true);

  const unknownResponse = await request.patch(`/api/roadmaps/${unknown.id}/answers`, {
    data: { answers: { [conditionQuestion!.factKey]: null } },
  });
  expect(unknownResponse.ok()).toBe(true);
  const explicitlyUnknown = (await unknownResponse.json() as { data: typeof unknown }).data;
  expect(Object.prototype.hasOwnProperty.call(explicitlyUnknown.answers, conditionQuestion!.factKey)).toBe(true);
  expect(explicitlyUnknown.answers[conditionQuestion!.factKey]).toBeNull();
  expect(explicitlyUnknown.tasks.map(({ id, status, actionability }) => ({ id, status, actionability }))).toEqual(before);

  await page.goto(`/roadmaps/${unknown.id}`);
  await expect(page.getByText(`${unknown.questions.length - 1} questions left to answer`)).toBeVisible();
  await expect(page.getByText(/1 left unknown/)).toBeVisible();
  await page.getByRole("tab", { name: "Accessible list" }).click();
  const withheld = page.getByText("Instructions withheld").first();
  await expect(withheld).toBeVisible();
  await withheld.locator("xpath=ancestor::button").click();
  const sheet = page.getByRole("dialog");
  await expect(sheet.getByText("Instructions withheld")).toBeVisible();
  await expect(sheet.getByRole("link", { name: /^Open / })).toHaveCount(0);
});

test("a reviewed exact answer changes only its declared branch in the visible roadmap", async ({ page, request }) => {
  const seed = await createRoadmap(request, "export-first-commercial-order");
  const question = seed.questions.find((candidate) => candidate.id.endsWith(":q.rcmc-benefit"));
  expect(question).toMatchObject({ resolutionMode: "safe-effects", answerType: "boolean" });
  const affectedTaskId = question!.blocksTaskIds[0]!;
  const priorAnswers = Object.fromEntries(
    seed.questions
      .filter((candidate) => candidate.factKey !== question!.factKey)
      .map((candidate) => [candidate.factKey, null]),
  );
  const roadmap = await createRoadmap(request, "export-first-commercial-order", priorAnswers);

  await page.goto(`/roadmaps/${roadmap.id}`);
  const tile = page.locator(`[data-task-id="${affectedTaskId}"]`);
  await expect(tile).toHaveAttribute("data-status", "needs-information");
  await page.getByRole("button", { name: /Personalize this roadmap/i }).click();
  await expect(page.getByText("Can safely personalize branches")).toBeVisible();
  await page.getByRole("button", { name: "Yes" }).click();
  await page.getByRole("button", { name: "Save answer" }).click();
  await expect(tile).not.toHaveAttribute("data-status", "needs-information");
  await expect(page.getByRole("heading", { level: 1, name: roadmap.outcomeTitle })).toBeVisible();

  const excludedRoadmap = await createRoadmap(request, "export-first-commercial-order", {
    ...priorAnswers,
    [question!.factKey]: false,
  });
  await page.goto(`/roadmaps/${excludedRoadmap.id}`);
  await expect(page.locator(`[data-task-id="${affectedTaskId}"]`)).toHaveCount(0);
  await expect(page.locator(`[data-excluded-task-id="${affectedTaskId}"]`)).toBeVisible();
  await expect(page.locator(`[data-excluded-task-id="${affectedTaskId}"]`)).toContainText(
    "marks this conditional branch not applicable",
  );
});

test("task detail is proof-gated and completed progress survives reload", async ({ page, request }) => {
  const { roadmap, task } = await createRoadmapWithReadyTask(request);

  await page.goto(`/roadmaps/${roadmap.id}`);
  await page.getByRole("tab", { name: "Accessible list" }).click();
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
  await page.getByRole("tab", { name: "Accessible list" }).click();
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
