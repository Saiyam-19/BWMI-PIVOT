import { unlink } from "node:fs/promises";
import { join } from "node:path";

import { afterAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { GET as getOutcomes } from "../../src/app/api/outcomes/route.js";
import { POST as createRoadmap } from "../../src/app/api/roadmaps/route.js";
import { GET as getRoadmap } from "../../src/app/api/roadmaps/[roadmapId]/route.js";
import { PATCH as updateAnswers } from "../../src/app/api/roadmaps/[roadmapId]/answers/route.js";
import { PATCH as updateTask } from "../../src/app/api/roadmaps/[roadmapId]/tasks/[taskId]/route.js";
import { GET as getShare } from "../../src/app/api/roadmaps/[roadmapId]/share/route.js";
import { FileRoadmapRepository, type Roadmap } from "../../src/index.js";
import { getNavigatorApplication } from "../../src/server/navigator.js";

const createdRoadmapIds: string[] = [];

const completeImportAnswers = {
  commercialPurpose: true,
  entityType: "proprietorship",
  hasGstRegistration: true,
  hasIec: false,
  hasIcegateRegistration: false,
  shipmentStage: "planning",
  productCategory: "wireless-headphones",
  intendedUse: "resale",
  condition: "new",
  containsBluetooth: true,
  containsBattery: true,
  includesMainsPowerAdapter: false,
  retailPackaged: true,
  plasticPackaging: true,
  brandedByImporter: true,
  udyamClassification: "small",
  originCountry: "CN",
  transportMode: "sea",
  confirmedItcHsCode: false,
} as const;

const jsonRequest = (url: string, method: string, body: unknown): Request =>
  new Request(url, {
    method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

const roadmapContext = (roadmapId: string) => ({
  params: Promise.resolve({ roadmapId }),
});

const taskContext = (roadmapId: string, taskId: string) => ({
  params: Promise.resolve({ roadmapId, taskId }),
});

async function createTestRoadmap(
  answers: Readonly<Record<string, string | number | boolean | null>> = {
    privateNote: "route-test-private-value",
  },
): Promise<Roadmap> {
  const response = await createRoadmap(
    jsonRequest("http://localhost/api/roadmaps", "POST", {
      entry: { kind: "browse", outcomeId: "import-regulated-product" },
      answers,
    }),
  );
  expect(response.status).toBe(201);
  const body = (await response.json()) as { data: Roadmap };
  createdRoadmapIds.push(body.data.id);
  return body.data;
}

afterAll(async () => {
  await Promise.all(
    createdRoadmapIds.map(async (roadmapId) => {
      try {
        await unlink(join(process.cwd(), ".data", "roadmaps", `${roadmapId}.json`));
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      }
    }),
  );
});

describe("navigator API routes", () => {
  it("returns all seven public outcomes, distinct domains, and domain filters", async () => {
    const response = await getOutcomes(
      new Request("http://localhost/api/outcomes"),
    );
    const body = (await response.json()) as {
      data: {
        outcomes: readonly { id: string; domains: readonly string[] }[];
        domains: readonly string[];
      };
    };

    expect(response.status).toBe(200);
    expect(body.data.outcomes).toHaveLength(7);
    expect(new Set(body.data.domains).size).toBe(body.data.domains.length);
    expect(body.data.domains).toEqual([...body.data.domains].sort());

    const domain = body.data.outcomes[0]?.domains[0];
    if (!domain) throw new Error("Expected a public outcome domain.");
    const filtered = await getOutcomes(
      new Request(`http://localhost/api/outcomes?domain=${encodeURIComponent(domain)}`),
    );
    const filteredBody = (await filtered.json()) as typeof body;
    expect(filteredBody.data.outcomes.length).toBeGreaterThan(0);
    expect(
      filteredBody.data.outcomes.every((outcome) => outcome.domains.includes(domain)),
    ).toBe(true);
  });

  it("creates a private roadmap and reloads it through the singleton and filesystem", async () => {
    const singleton = getNavigatorApplication();
    expect(getNavigatorApplication()).toBe(singleton);

    const roadmap = await createTestRoadmap();
    const response = await getRoadmap(
      new Request(`http://localhost/api/roadmaps/${roadmap.id}`),
      roadmapContext(roadmap.id),
    );
    const body = (await response.json()) as { data: Roadmap };

    expect(response.status).toBe(200);
    expect(body.data.answers.privateNote).toBe("route-test-private-value");

    const reloaded = await new FileRoadmapRepository(
      join(process.cwd(), ".data", "roadmaps"),
    ).load(roadmap.id);
    expect(reloaded?.id).toBe(roadmap.id);
    expect(reloaded?.answers.privateNote).toBe("route-test-private-value");
  });

  it("returns redacted share data that is observably different from private data", async () => {
    const roadmap = await createTestRoadmap();
    const response = await getShare(
      new Request(`http://localhost/api/roadmaps/${roadmap.id}/share`),
      roadmapContext(roadmap.id),
    );
    const body = (await response.json()) as { data: Record<string, unknown> };
    const serialized = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body.data).not.toHaveProperty("answers");
    expect(serialized).not.toContain("route-test-private-value");
    expect(serialized).not.toContain("proofConfirmed");
  });

  it("updates answers and validates task transitions", async () => {
    const roadmap = await createTestRoadmap(completeImportAnswers);
    const answerResponse = await updateAnswers(
      jsonRequest(
        `http://localhost/api/roadmaps/${roadmap.id}/answers`,
        "PATCH",
        { answers: { containsBluetooth: true } },
      ),
      roadmapContext(roadmap.id),
    );
    expect(answerResponse.status).toBe(200);
    const answeredBody = (await answerResponse.json()) as { data: Roadmap };
    expect(answeredBody).toMatchObject({
      data: { answers: { containsBluetooth: true } },
    });

    const withheldTask = answeredBody.data.tasks.find(
      (task) => task.actionability === "withheld",
    );
    if (!withheldTask) throw new Error("Expected a fail-closed withheld task.");

    const invalidTransition = await updateTask(
      jsonRequest(
        `http://localhost/api/roadmaps/${roadmap.id}/tasks/${withheldTask.id}`,
        "PATCH",
        { to: "in-progress" },
      ),
      taskContext(roadmap.id, withheldTask.id),
    );
    expect(invalidTransition.status).toBe(409);
    await expect(invalidTransition.json()).resolves.toMatchObject({
      error: { code: "invalid_transition" },
    });

    const taskResponse = await updateTask(
      jsonRequest(
        `http://localhost/api/roadmaps/${roadmap.id}/tasks/missing-task`,
        "PATCH",
        { to: "in-progress" },
      ),
      taskContext(roadmap.id, "missing-task"),
    );
    expect(taskResponse.status).toBe(404);
    await expect(taskResponse.json()).resolves.toMatchObject({
      error: { code: "task_not_found" },
    });
  });

  it("maps malformed, unsafe, private, and missing requests to stable errors", async () => {
    const malformed = await createRoadmap(
      jsonRequest("http://localhost/api/roadmaps", "POST", { entry: {} }),
    );
    expect(malformed.status).toBe(400);
    await expect(malformed.json()).resolves.toMatchObject({
      error: { code: "invalid_request" },
    });

    const unsafe = await createRoadmap(
      jsonRequest("http://localhost/api/roadmaps", "POST", {
        entry: { kind: "natural-language", text: "something unsupported" },
      }),
    );
    expect(unsafe.status).toBe(422);
    await expect(unsafe.json()).resolves.toMatchObject({
      error: { code: "unsafe_intent" },
    });

    const privacy = await createRoadmap(
      jsonRequest("http://localhost/api/roadmaps", "POST", {
        entry: { kind: "browse", outcomeId: "import-regulated-product" },
        answers: { password: "do-not-store" },
      }),
    );
    expect(privacy.status).toBe(400);
    await expect(privacy.json()).resolves.toMatchObject({
      error: { code: "privacy_violation" },
    });

    const missing = await getRoadmap(
      new Request("http://localhost/api/roadmaps/missing-roadmap"),
      roadmapContext("missing-roadmap"),
    );
    expect(missing.status).toBe(404);
    await expect(missing.json()).resolves.toMatchObject({
      error: { code: "roadmap_not_found" },
    });
  });
});
