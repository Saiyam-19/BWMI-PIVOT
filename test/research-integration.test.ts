import { describe, expect, it } from "vitest";

import {
  ResearchPackValidationError,
  buildRoadmap,
  builtInRegistry,
  normalizeResearchPack,
  researchAdmissionManifest,
  researchIntegrationReports,
  type Answers,
  type ContentRegistry,
} from "../src/index.js";

const admittedOutcomeIds = [
  "import-regulated-product",
  "export-first-commercial-order",
  "incorporate-company-first-hire",
  "central-procurement-first-bid",
  "post-death-regulated-assets",
  "urgent-cyber-financial-fraud",
  "reusable-central-foundations",
] as const;

function affirmativeAnswers(
  registry: ContentRegistry,
  outcomeId: string,
): Answers {
  const pack = registry.getPackForOutcome(outcomeId);
  if (!pack) throw new Error(`Missing pack for ${outcomeId}.`);
  return Object.fromEntries(
    pack.questions.map((question) => [question.factKey, true]),
  );
}

describe("published research admission", () => {
  it("loads all seven independently reviewed final packs through KnowledgePackV1", () => {
    expect(researchAdmissionManifest).toMatchObject({
      publication_state: "final",
      portfolio_status: "STRUCTURALLY_VALID",
      independent_review: {
        status: "complete",
        overall_verdict: "CONDITIONAL_PASS",
      },
      totals: {
        packs: 7,
        tasks: 162,
        dependency_edges: 236,
        claims: 447,
        sources: 273,
        coverage_gaps: 62,
      },
    });
    expect(researchIntegrationReports).toHaveLength(7);
    for (const outcomeId of admittedOutcomeIds) {
      const outcome = builtInRegistry.getOutcome(outcomeId);
      const pack = builtInRegistry.getPackForOutcome(outcomeId);

      expect(outcome).toBeDefined();
      expect(pack).toMatchObject({ lifecycle: "admitted", version: "1.0.0" });
      expect(pack?.tasks.length).toBeGreaterThan(0);
      expect(pack?.claims.length).toBeGreaterThan(0);
    }
  });

  it("supersedes the unreviewed import fixture with the reviewed research pack", () => {
    expect(builtInRegistry.getPackForOutcome("import-regulated-product")).toMatchObject({
      id: "research.import-regulated-product",
      lifecycle: "admitted",
    });
  });

  it("resolves admitted research through the same natural-language and browse engine", () => {
    const natural = buildRoadmap({
      entry: {
        kind: "natural-language",
        text: "I want to become eligible for government procurement and submit my first valid bid",
      },
    });
    const browsed = buildRoadmap({
      entry: { kind: "browse", outcomeId: "central-procurement-first-bid" },
    });

    expect(natural.outcomeId).toBe("central-procurement-first-bid");
    expect(natural.packId).toBe(browsed.packId);
  });

  it("fails closed until deterministic task and claim applicability facts are known", () => {
    const roadmap = buildRoadmap(
      { entry: { kind: "browse", outcomeId: "central-procurement-first-bid" } },
      { now: new Date("2026-08-28T00:00:00.000Z") },
    );

    expect(roadmap.status).toBe("needs-information");
    expect(roadmap.questions.length).toBeGreaterThan(0);
    expect(roadmap.tasks.every((task) => task.actionability === "withheld")).toBe(
      true,
    );
    expect(
      roadmap.tasks.every((task) => (task.journey?.instructions.length ?? 0) === 0),
    ).toBe(true);
  });

  it("exposes only same-day verified closures and keeps incomplete claims withheld", () => {
    const outcomeId = "central-procurement-first-bid";
    const answers = affirmativeAnswers(builtInRegistry, outcomeId);
    const current = buildRoadmap(
      { entry: { kind: "browse", outcomeId }, answers },
      { now: new Date("2026-08-28T00:00:00.000Z") },
    );

    const actionable = current.tasks.filter(
      (task) => task.actionability === "actionable",
    );
    const withheldWithIncompleteEvidence = current.tasks.filter(
      (task) => task.evidence.some((claim) => claim.status !== "verified"),
    );

    expect(actionable.length).toBeGreaterThan(0);
    expect(
      actionable.every(
        (task) =>
          task.journey?.instructions.length &&
          task.completionProof &&
          task.evidence.every(
            (claim) =>
              claim.current &&
              claim.applicability === true &&
              claim.sources.length > 0 &&
              claim.sources.every((source) => source.official),
          ),
      ),
    ).toBe(true);
    expect(withheldWithIncompleteEvidence.length).toBeGreaterThan(0);
    expect(
      withheldWithIncompleteEvidence.every(
        (task) =>
          task.actionability === "withheld" &&
          (task.journey?.instructions.length ?? 0) === 0,
      ),
    ).toBe(true);

    const expired = buildRoadmap(
      { entry: { kind: "browse", outcomeId }, answers },
      { now: new Date("2026-08-29T00:00:00.000Z") },
    );
    expect(expired.tasks.every((task) => task.actionability === "withheld")).toBe(
      true,
    );
  });

  it("keeps state and local dependencies visible without procedural instructions", () => {
    const outcomeId = "post-death-regulated-assets";
    const roadmap = buildRoadmap(
      {
        entry: { kind: "browse", outcomeId },
        answers: affirmativeAnswers(builtInRegistry, outcomeId),
      },
      { now: new Date("2026-08-28T00:00:00.000Z") },
    );
    const dependencies = roadmap.tasks.filter(
      (task) => task.authority.type === "state" || task.authority.type === "local",
    );

    expect(dependencies.length).toBeGreaterThan(0);
    expect(
      dependencies.every(
        (task) =>
          task.classification === "outside-scope" &&
          task.actionability === "withheld" &&
          (task.journey?.instructions.length ?? 0) === 0,
      ),
    ).toBe(true);
  });

  it("namespaces every imported registry entity so roadmaps cannot leak facts", () => {
    const procurement = buildRoadmap(
      {
        entry: { kind: "browse", outcomeId: "central-procurement-first-bid" },
        answers: affirmativeAnswers(
          builtInRegistry,
          "central-procurement-first-bid",
        ),
      },
      { now: new Date("2026-08-28T00:00:00.000Z") },
    );
    const deceased = buildRoadmap(
      {
        entry: { kind: "browse", outcomeId: "post-death-regulated-assets" },
        answers: procurement.answers,
      },
      { now: new Date("2026-08-28T00:00:00.000Z") },
    );

    expect(procurement.packId).not.toBe(deceased.packId);
    expect(
      procurement.tasks.every((task) => task.id.startsWith(`${procurement.packId}:`)),
    ).toBe(true);
    expect(
      deceased.tasks.every((task) => task.id.startsWith(`${deceased.packId}:`)),
    ).toBe(true);
    expect(
      deceased.tasks.flatMap((task) => task.evidence).every(
        (claim) => claim.id.startsWith(`${deceased.packId}:`),
      ),
    ).toBe(true);
    expect(deceased.questions.length).toBeGreaterThan(0);
  });

  it("preserves original claim and source metadata in the import report", () => {
    const report = researchIntegrationReports.find(
      (candidate) =>
        candidate.outcomeId === "central-procurement-first-bid",
    );

    expect(report?.provenance.claims[0]).toMatchObject({
      originalId: expect.any(String),
      originalStatus: expect.any(String),
      originalSourceIds: expect.any(Array),
      subject: expect.any(String),
      jurisdiction: expect.any(String),
      applicability: expect.any(String),
      freshnessRisk: expect.any(String),
    });
    expect(report?.provenance.sources[0]).toMatchObject({
      originalId: expect.any(String),
      sourceTier: expect.any(String),
      accessStatus: expect.any(String),
      freshnessRisk: expect.any(String),
    });
  });

  it("rejects structurally incomplete research artifacts before normalization", () => {
    expect(() =>
      normalizeResearchPack(
        { schema_version: "1.0.0" },
        {
          packId: "research.invalid",
          outcomeId: "invalid-outcome",
          domains: ["business-employment-compliance"],
          intentPhrases: ["invalid outcome"],
        },
      ),
    ).toThrow(ResearchPackValidationError);
  });
});
