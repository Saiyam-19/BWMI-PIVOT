import { expect, test } from "@playwright/test";

import { answerEveryQuestion, createRoadmap, expectSafeErrorBody, outcomes } from "./helpers.js";

const placeholderHost = /(^|\.)(example\.(com|org|net)|localhost|invalid)$/i;

test("share output redacts answers and proof confirmations", async ({ request }) => {
  const secret = "private-family-case-reference-4839";
  const roadmap = await createRoadmap(request, "post-death-regulated-assets", {
    privateCaseReference: secret,
  });
  const privateResponse = await request.get(`/api/roadmaps/${roadmap.id}`);
  expect(await privateResponse.text()).toContain(secret);

  const shared = await request.get(`/api/roadmaps/${roadmap.id}/share`);
  expect(shared.ok()).toBe(true);
  const sharedText = await shared.text();
  expect(sharedText).not.toContain(secret);
  expect(sharedText).not.toContain("proofConfirmed");
  expect(JSON.parse(sharedText).data).not.toHaveProperty("answers");
});

test("admitted journeys expose only real HTTPS links and withheld tasks expose no instructions", async ({ page, request }) => {
  let renderedRoadmapId = "";
  let renderedTaskTitle = "";
  for (const [outcomeId] of outcomes) {
    const roadmap = await answerEveryQuestion(request, await createRoadmap(request, outcomeId));
    for (const task of roadmap.tasks) {
      if (task.actionability === "withheld") {
        expect(task.journey?.instructions ?? []).toEqual([]);
        expect(task.journey?.officialUrl).toBeUndefined();
      } else if (task.journey?.officialUrl) {
        const url = new URL(task.journey.officialUrl);
        expect(url.protocol).toBe("https:");
        expect(placeholderHost.test(url.hostname)).toBe(false);
        renderedRoadmapId ||= roadmap.id;
        renderedTaskTitle ||= task.title;
      }
    }
  }

  expect(renderedRoadmapId).toBeTruthy();
  await page.goto(`/roadmaps/${renderedRoadmapId}`);
  await page.getByRole("tab", { name: "Accessible list" }).click();
  await page.getByText(renderedTaskTitle, { exact: true })
    .locator("xpath=ancestor::button")
    .first()
    .click();
  const link = page.getByRole("dialog").getByRole("link", { name: /^Open / }).first();
  await expect(link).toBeVisible();
  expect(await link.getAttribute("href")).toMatch(/^https:\/\//);
});

test("missing, malformed, ambiguous, and private failures are stable and do not leak internals", async ({ page, request }) => {
  const malformed = await request.post("/api/roadmaps", { data: { entry: {} } });
  expect(malformed.status()).toBe(400);
  const malformedBody = await malformed.text();
  expect(malformedBody).toContain("invalid_request");
  expectSafeErrorBody(malformedBody);

  const ambiguous = await request.post("/api/roadmaps", {
    data: { entry: { kind: "natural-language", text: "help me with government work" } },
  });
  expect(ambiguous.status()).toBe(422);
  const ambiguousBody = await ambiguous.text();
  expect(ambiguousBody).toContain("unsafe_intent");
  expectSafeErrorBody(ambiguousBody);

  const missing = await request.get("/api/roadmaps/not-a-real-roadmap");
  expect(missing.status()).toBe(404);
  expectSafeErrorBody(await missing.text());

  const privacy = await request.post("/api/roadmaps", {
    data: {
      entry: { kind: "browse", outcomeId: "import-regulated-product" },
      answers: { password: "must-not-persist" },
    },
  });
  expect(privacy.status()).toBe(400);
  expectSafeErrorBody(await privacy.text());

  await page.goto("/roadmaps/not-a-real-roadmap");
  await expect(page.getByRole("heading", { name: "This roadmap is not available" })).toBeVisible();
  expectSafeErrorBody(await page.locator("body").innerText());
});
