import { expect, type APIRequestContext, type Page } from "@playwright/test";

import type { Roadmap } from "../src/domain.js";

export const outcomes = [
  ["import-regulated-product", "Import and legally sell a first regulated product shipment in India"],
  ["export-first-commercial-order", "Export a first commercial goods order from India and complete payment realisation"],
  ["incorporate-company-first-hire", "Incorporate an Indian company, hire the first employee, and complete initial Central compliance"],
  ["central-procurement-first-bid", "Become eligible for Central Government procurement and submit and freeze a portal-received Central bid"],
  ["post-death-regulated-assets", "Discover and claim a deceased person's Central and regulated financial assets"],
  ["urgent-cyber-financial-fraud", "Urgent cyber-financial-fraud containment and recovery journey"],
  ["reusable-central-foundations", "Reusable Central-Government Identity and Registration Foundations"],
] as const;

export async function createRoadmap(
  request: APIRequestContext,
  outcomeId: string,
  answers?: Readonly<Record<string, string | number | boolean | null>>,
): Promise<Roadmap> {
  const response = await request.post("/api/roadmaps", {
    data: {
      entry: { kind: "browse", outcomeId },
      ...(answers ? { answers } : {}),
    },
  });
  expect(response.status()).toBe(201);
  return (await response.json() as { data: Roadmap }).data;
}

export async function answerEveryQuestion(
  request: APIRequestContext,
  initial: Roadmap,
): Promise<Roadmap> {
  let roadmap = initial;
  const answered = new Set<string>();
  for (let pass = 0; pass < 20 && roadmap.questions.length > 0; pass += 1) {
    const fresh = roadmap.questions.filter((question) => !answered.has(question.factKey));
    if (fresh.length === 0) break;
    const answers = Object.fromEntries(fresh.map((question) => {
      answered.add(question.factKey);
      return [question.factKey, true];
    }));
    const response = await request.patch(`/api/roadmaps/${roadmap.id}/answers`, {
      data: { answers },
    });
    if (!response.ok()) {
      throw new Error(
        `Answer update failed for ${roadmap.outcomeId} (${response.status()}): ${await response.text()}`,
      );
    }
    roadmap = (await response.json() as { data: Roadmap }).data;
  }
  return roadmap;
}

export async function createRoadmapWithReadyTask(request: APIRequestContext) {
  for (const [outcomeId] of outcomes) {
    const roadmap = await answerEveryQuestion(request, await createRoadmap(request, outcomeId));
    const task = roadmap.tasks.find((candidate) =>
      candidate.actionability === "actionable" &&
      candidate.status === "ready" &&
      Boolean(candidate.completionProof),
    );
    if (task) return { roadmap, task };
  }
  throw new Error("No admitted outcome produced a ready proof-backed task.");
}

export async function chooseUnknownAndOpen(page: Page): Promise<void> {
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const unknowns = dialog.getByRole("button", { name: "I don't know yet" });
  for (let index = 0; index < await unknowns.count(); index += 1) {
    await unknowns.nth(index).click();
  }
  await dialog.getByRole("button", { name: "Open my roadmap" }).click();
  await page.waitForURL(/\/roadmaps\//);
}

export function expectSafeErrorBody(body: string): void {
  expect(body).not.toMatch(/(?:\/Users\/|BWMI-PIVOT|node_modules|\bat\s+[^\n]+:\d+:\d+)/);
}
