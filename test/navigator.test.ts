import { describe, expect, it } from "vitest";

import {
  CompletionProofRequiredError,
  InvalidTaskTransitionError,
  buildRoadmap,
  builtInRegistry,
  confirmTaskCompletion,
  createRegistry,
  getAvailableNextActions,
  transitionTask,
  type KnowledgePackV1,
  type Roadmap,
} from "../src/index.js";
import { createAdmittedPack } from "./fixtures.js";
import { importRegulatedProductPack } from "../src/packs/import-regulated-product.js";

const legacyImportFixtureRegistry = createRegistry([importRegulatedProductPack]);

const completeImportFacts = {
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

describe("one outcome engine", () => {
  it("resolves natural-language and browse entry to the same outcome", () => {
    const naturalLanguageRoadmap = buildRoadmap({
      entry: {
        kind: "natural-language",
        text: "I want to import Bluetooth headphones from China and sell them in India",
      },
      answers: completeImportFacts,
    });
    const browsedRoadmap = buildRoadmap({
      entry: { kind: "browse", outcomeId: "import-regulated-product" },
      answers: completeImportFacts,
    });

    expect(naturalLanguageRoadmap.outcomeId).toBe("import-regulated-product");
    expect(browsedRoadmap.outcomeId).toBe(naturalLanguageRoadmap.outcomeId);
  });

  it("creates isolated roadmap identities for the same outcome", () => {
    const first = buildRoadmap({
      entry: { kind: "browse", outcomeId: "import-regulated-product" },
    });
    const second = buildRoadmap({
      entry: { kind: "browse", outcomeId: "import-regulated-product" },
    });

    expect(first.id).not.toBe(second.id);
  });
});

describe("adaptive fail-closed graphs", () => {
  it("changes conditional tasks when product facts change", () => {
    const regulated = buildRoadmap({
      entry: { kind: "browse", outcomeId: "import-regulated-product" },
      answers: completeImportFacts,
    }, { registry: legacyImportFixtureRegistry });
    const simpler = buildRoadmap({
      entry: { kind: "browse", outcomeId: "import-regulated-product" },
      answers: {
        ...completeImportFacts,
        productCategory: "unregulated-household-item",
        containsBluetooth: false,
        containsBattery: false,
        retailPackaged: false,
        plasticPackaging: false,
        brandedByImporter: false,
      },
    }, { registry: legacyImportFixtureRegistry });

    const regulatedIds = regulated.tasks.map((task) => task.id);
    const simplerIds = simpler.tasks.map((task) => task.id);
    expect(regulatedIds).toEqual(
      expect.arrayContaining([
        "verify-bis-crs",
        "obtain-wpc-eta",
        "register-battery-epr",
        "register-ewaste-epr",
        "complete-legal-metrology",
        "register-plastic-epr",
      ]),
    );
    expect(simplerIds).not.toEqual(
      expect.arrayContaining([
        "obtain-wpc-eta",
        "register-battery-epr",
        "register-ewaste-epr",
        "complete-legal-metrology",
        "register-plastic-epr",
      ]),
    );
    expect(excludedIds(simpler)).toEqual(
      expect.arrayContaining([
        "obtain-wpc-eta",
        "register-battery-epr",
        "complete-legal-metrology",
      ]),
    );
  });

  it("represents unknown applicability and asks only graph-changing questions", () => {
    const roadmap = buildRoadmap({
      entry: { kind: "browse", outcomeId: "import-regulated-product" },
      answers: { commercialPurpose: true, shipmentStage: "planning" },
    }, { registry: legacyImportFixtureRegistry });

    expect(roadmap.status).toBe("needs-information");
    expect(roadmap.questions.map((question) => question.factKey)).toEqual(
      expect.arrayContaining([
        "productCategory",
        "containsBluetooth",
        "containsBattery",
        "retailPackaged",
        "intendedUse",
      ]),
    );
    expect(
      roadmap.tasks.find((task) => task.id === "determine-customs-duty"),
    ).toMatchObject({
      applicability: "unknown",
      actionability: "withheld",
      status: "needs-information",
    });
  });

  it("keeps pre-research fixture graphs non-actionable", () => {
    const roadmap = buildRoadmap({
      entry: { kind: "browse", outcomeId: "import-regulated-product" },
      answers: completeImportFacts,
    }, { registry: legacyImportFixtureRegistry });

    expect(roadmap.tasks.length).toBeGreaterThan(0);
    expect(roadmap.tasks.every((task) => task.actionability === "withheld")).toBe(
      true,
    );
    expect(
      roadmap.tasks.every((task) =>
        task.blockers.includes("Knowledge pack is not admitted for actionable use."),
      ),
    ).toBe(true);
  });

  it("keeps state dependencies visible without instructions", () => {
    const pack = builtInRegistry.getPackForOutcome("post-death-regulated-assets");
    if (!pack) throw new Error("Missing post-death research pack.");
    const roadmap = buildRoadmap({
      entry: { kind: "browse", outcomeId: "post-death-regulated-assets" },
      answers: Object.fromEntries(
        pack.questions.map((question) => [question.factKey, true]),
      ),
    });
    const task = roadmap.tasks.find((candidate) => candidate.authority.type === "state");

    expect(task).toMatchObject({
      classification: "outside-scope",
      actionability: "withheld",
      authority: { type: "state" },
    });
    expect(task?.journey?.instructions ?? []).toEqual([]);
    expect(task?.blockers).toContain(
      "State-specific instructions are not supported in V1.",
    );
  });
});

describe("admitted evidence and progress", () => {
  it("exposes only current, applicable, official claim-backed instructions", () => {
    const registry = createRegistry([createAdmittedPack()]);
    const roadmap = buildRoadmap(
      {
        entry: { kind: "browse", outcomeId: "test-outcome" },
        answers: { ownsItem: true },
      },
      { registry, now: new Date("2026-08-28T00:00:00.000Z") },
    );
    const task = roadmap.tasks[0]!;

    expect(task).toMatchObject({
      applicability: true,
      actionability: "actionable",
      status: "ready",
      completionProof: { description: "Submission reference number" },
      nextAction: "Submit the approved test request.",
    });
    expect(task.journey?.instructions).toHaveLength(1);
    expect(task.evidence.every((claim) => claim.status === "verified")).toBe(true);
    expect(
      task.evidence.every((claim) =>
        claim.sources.every((source) => source.official),
      ),
    ).toBe(true);
  });

  it("withholds stale or unverified claims", () => {
    const base = createAdmittedPack();
    const staleClaims: KnowledgePackV1["claims"] = base.claims.map((claim) => ({
      ...claim,
      reviewDueOn: "2026-08-27",
    }));
    const staleRegistry = createRegistry([{ ...base, claims: staleClaims }]);
    const staleRoadmap = buildRoadmap(
      {
        entry: { kind: "browse", outcomeId: "test-outcome" },
        answers: { ownsItem: true },
      },
      { registry: staleRegistry, now: new Date("2026-08-28T00:00:00.000Z") },
    );

    expect(staleRoadmap.tasks[0]).toMatchObject({
      actionability: "withheld",
      status: "blocked",
    });
    expect(staleRoadmap.tasks[0]?.journey?.instructions).toEqual([]);

    const unverifiedClaims: KnowledgePackV1["claims"] = base.claims.map(
      (claim, index) =>
        index === 1 ? { ...claim, status: "under-review" as const } : claim,
    );
    const unverifiedRegistry = createRegistry([
      { ...base, claims: unverifiedClaims },
    ]);
    const unverifiedRoadmap = buildRoadmap(
      {
        entry: { kind: "browse", outcomeId: "test-outcome" },
        answers: { ownsItem: true },
      },
      { registry: unverifiedRegistry },
    );
    expect(unverifiedRoadmap.tasks[0]?.actionability).toBe("withheld");
  });

  it("cannot expose a journey when its unverified step claim is omitted from task claims", () => {
    const base = createAdmittedPack();
    const claims: KnowledgePackV1["claims"] = base.claims.map((claim) =>
      claim.id === "test.claim.step"
        ? { ...claim, status: "under-review" as const }
        : claim,
    );
    const tasks: KnowledgePackV1["tasks"] = base.tasks.map((task) => ({
      ...task,
      requiredClaimIds: task.requiredClaimIds.filter(
        (claimId) => claimId !== "test.claim.step",
      ),
    }));
    const registry = createRegistry([{ ...base, claims, tasks }]);
    const roadmap = buildRoadmap(
      {
        entry: { kind: "browse", outcomeId: "test-outcome" },
        answers: { ownsItem: true },
      },
      { registry },
    );

    expect(roadmap.tasks[0]).toMatchObject({
      actionability: "withheld",
      status: "blocked",
    });
    expect(roadmap.tasks[0]?.journey?.instructions).toEqual([]);
  });

  it("calculates next actions and unlocks dependencies after proof-backed completion", () => {
    const registry = createRegistry([createAdmittedPack()]);
    const roadmap = buildRoadmap(
      {
        entry: { kind: "browse", outcomeId: "test-outcome" },
        answers: { ownsItem: true },
      },
      { registry },
    );

    expect(getAvailableNextActions(roadmap).map((action) => action.taskId)).toEqual([
      "test.task.prepare",
    ]);
    expect(() =>
      confirmTaskCompletion(roadmap, "test.task.prepare", {
        proofConfirmed: false,
      }),
    ).toThrow(CompletionProofRequiredError);
    expect(() =>
      transitionTask(roadmap, "test.task.finish", { to: "in-progress" }),
    ).toThrow(InvalidTaskTransitionError);

    const completed = confirmTaskCompletion(roadmap, "test.task.prepare", {
      proofConfirmed: true,
    });
    expect(completed.tasks.find((task) => task.id === "test.task.prepare")?.status).toBe(
      "completed",
    );
    expect(getAvailableNextActions(completed).map((action) => action.taskId)).toEqual([
      "test.task.finish",
    ]);
  });
});

function excludedIds(roadmap: Roadmap): string[] {
  return roadmap.excludedTasks.map((task) => task.id);
}
