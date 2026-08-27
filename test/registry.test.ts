import { describe, expect, it } from "vitest";

import {
  RegistryValidationError,
  createRegistry,
  type KnowledgePackV1,
} from "../src/index.js";
import { createAdmittedPack } from "./fixtures.js";

const expectValidationCode = (
  operation: () => unknown,
  code: string,
): void => {
  try {
    operation();
    throw new Error("Expected registry validation to fail.");
  } catch (error) {
    expect(error).toBeInstanceOf(RegistryValidationError);
    expect((error as RegistryValidationError).issues.map((issue) => issue.code)).toContain(
      code,
    );
  }
};

describe("versioned content registry", () => {
  it("loads a valid V1 knowledge pack", () => {
    const registry = createRegistry([createAdmittedPack()], {
      now: new Date("2026-08-28T00:00:00.000Z"),
    });

    expect(registry.schemaVersion).toBe("1.0.0");
    expect(registry.getOutcome("test-outcome")?.version).toBe("1.0.0");
  });

  it("rejects malformed and duplicate registry IDs", () => {
    expectValidationCode(
      () => createRegistry([createAdmittedPack({ id: "invalid pack id" })]),
      "invalid-id",
    );

    const duplicate = createAdmittedPack({ id: "second-pack" });
    expectValidationCode(
      () => createRegistry([createAdmittedPack(), duplicate]),
      "duplicate-id",
    );
  });

  it("rejects claim and journey references outside their pack", () => {
    const pack = createAdmittedPack();
    const tasks: KnowledgePackV1["tasks"] = pack.tasks.map((task, index) =>
      index === 0
        ? { ...task, requiredClaimIds: ["another-pack.claim"] }
        : task,
    );

    expectValidationCode(
      () => createRegistry([{ ...pack, tasks }]),
      "unknown-claim-reference",
    );
  });

  it("requires official, non-historical evidence for verified claims", () => {
    const pack = createAdmittedPack();
    const sources: KnowledgePackV1["sources"] = pack.sources.map((source) => ({
      ...source,
      official: false,
      tier: "historical-discovery" as const,
    }));

    expectValidationCode(
      () => createRegistry([{ ...pack, sources }]),
      "verified-claim-source-required",
    );
  });

  it("validates state jurisdiction codes", () => {
    const pack = createAdmittedPack();
    const sources: KnowledgePackV1["sources"] = pack.sources.map((source) => ({
      ...source,
      jurisdiction: { countryCode: "IN", level: "state" as const },
    }));

    expectValidationCode(
      () => createRegistry([{ ...pack, sources }]),
      "invalid-jurisdiction",
    );
  });

  it("rejects dependency cycles", () => {
    const pack = createAdmittedPack();
    const tasks: KnowledgePackV1["tasks"] = [
      { ...pack.tasks[0]!, dependencies: ["test.task.finish"] },
      { ...pack.tasks[1]!, dependencies: ["test.task.prepare"] },
    ];

    expectValidationCode(
      () => createRegistry([{ ...pack, tasks }]),
      "dependency-cycle",
    );
  });

  it("requires a claim-backed completion proof for admitted tasks", () => {
    const pack = createAdmittedPack();
    const journeys: KnowledgePackV1["journeys"] = pack.journeys.map(
      ({ completionProof: _completionProof, ...journey }) => journey,
    );

    expectValidationCode(
      () => createRegistry([{ ...pack, journeys }]),
      "completion-proof-required",
    );
  });
});
