import { mkdir, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  FileRoadmapRepository,
  InMemoryRoadmapRepository,
  PrivacyViolationError,
  UnsafeAiSelectionError,
  createNavigatorApplication,
  createRegistry,
  deterministicIntentProvider,
  toShareableRoadmap,
  type IntentProvider,
} from "../src/index.js";
import { createAdmittedPack } from "./fixtures.js";

const registry = createRegistry([createAdmittedPack()]);

describe("replaceable intent provider", () => {
  it("uses the deterministic fallback without activating a live provider", async () => {
    const application = createNavigatorApplication({
      registry,
      intentProvider: deterministicIntentProvider,
      repository: new InMemoryRoadmapRepository(),
      idFactory: () => "roadmap-deterministic",
    });

    const roadmap = await application.start({
      entry: { kind: "natural-language", text: "complete a test outcome" },
      answers: { ownsItem: true },
    });

    expect(roadmap.outcomeId).toBe("test-outcome");
  });

  it("rejects provider-selected IDs that are not in the approved registry", async () => {
    const unsafeProvider: IntentProvider = {
      kind: "test-provider",
      async interpret() {
        return {
          outcomeId: "invented-outcome",
          selectedTaskIds: ["invented-task"],
          selectedQuestionIds: [],
          extractedAnswers: {},
        };
      },
    };
    const application = createNavigatorApplication({
      registry,
      intentProvider: unsafeProvider,
      repository: new InMemoryRoadmapRepository(),
    });

    await expect(
      application.start({
        entry: { kind: "natural-language", text: "invent a process" },
      }),
    ).rejects.toBeInstanceOf(UnsafeAiSelectionError);
  });
});

describe("application and persistence seams", () => {
  it("keeps facts isolated between roadmaps", async () => {
    let sequence = 0;
    const application = createNavigatorApplication({
      registry,
      repository: new InMemoryRoadmapRepository(),
      idFactory: () => `roadmap-${++sequence}`,
    });
    const first = await application.start({
      entry: { kind: "browse", outcomeId: "test-outcome" },
      answers: { ownsItem: true },
    });
    const second = await application.start({
      entry: { kind: "browse", outcomeId: "test-outcome" },
    });

    await application.answer(first.id, { ownsItem: false });

    expect((await application.load(first.id))?.answers.ownsItem).toBe(false);
    expect((await application.load(second.id))?.answers.ownsItem).toBeUndefined();
  });

  it("rejects credentials and document payloads at runtime", async () => {
    const application = createNavigatorApplication({
      registry,
      repository: new InMemoryRoadmapRepository(),
    });

    await expect(
      application.start({
        entry: { kind: "browse", outcomeId: "test-outcome" },
        answers: {
          ownsItem: true,
          uploadedDocument: { content: "identity document" },
        } as never,
      }),
    ).rejects.toBeInstanceOf(PrivacyViolationError);
  });

  it("omits answers and proof confirmations from shareable output", async () => {
    const application = createNavigatorApplication({
      registry,
      repository: new InMemoryRoadmapRepository(),
      idFactory: () => "roadmap-private",
    });
    const roadmap = await application.start({
      entry: { kind: "browse", outcomeId: "test-outcome" },
      answers: { ownsItem: true, freeText: "private person name" },
    });

    const shared = toShareableRoadmap(roadmap);
    const serialized = JSON.stringify(shared);
    expect("answers" in shared).toBe(false);
    expect(serialized).not.toContain("private person name");
    expect(serialized).not.toContain("proofConfirmed");
  });

  it("writes local roadmap files with owner-only permissions", async () => {
    const directory = join(tmpdir(), `gon-store-${process.pid}-${Date.now()}`);
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const repository = new FileRoadmapRepository(directory);
    const application = createNavigatorApplication({
      registry,
      repository,
      idFactory: () => "roadmap-file-safe",
    });

    const roadmap = await application.start({
      entry: { kind: "browse", outcomeId: "test-outcome" },
      answers: { ownsItem: true },
    });
    const filePath = join(directory, "roadmap-file-safe.json");
    const stored = JSON.parse(await readFile(filePath, "utf8")) as { id: string };
    const mode = (await stat(filePath)).mode & 0o777;

    expect(stored.id).toBe(roadmap.id);
    expect(mode).toBe(0o600);
    await rm(directory, { recursive: true, force: true });
  });
});
