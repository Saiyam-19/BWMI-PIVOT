import { describe, expect, it } from "vitest";

import { buildRoadmap, builtInRegistry } from "../../src/index.js";

// 05:00 in India on the release date, while UTC is still the previous day.
const verificationDate = new Date("2026-08-27T23:30:00.000Z");
const placeholderHost = /(^|\.)(example\.(com|org|net)|localhost|invalid)$/i;

function answersFor(outcomeId: string): Readonly<Record<string, boolean>> {
  const pack = builtInRegistry.getPackForOutcome(outcomeId);
  const outcome = builtInRegistry.getOutcome(outcomeId);
  if (!pack || !outcome) throw new Error(`Missing admitted outcome ${outcomeId}.`);

  return Object.fromEntries(
    outcome.questionIds.map((questionId) => {
      const question = pack.questions.find((candidate) => candidate.id === questionId);
      if (!question) throw new Error(`Missing question ${questionId} for ${outcomeId}.`);
      return [question.factKey, true];
    }),
  );
}

describe("admitted outcome portfolio", () => {
  it("builds all seven outcomes with consistent questions and real tasks", () => {
    const outcomes = builtInRegistry.listOutcomes();
    expect(outcomes).toHaveLength(7);

    for (const outcome of outcomes) {
      const roadmap = buildRoadmap(
        { entry: { kind: "browse", outcomeId: outcome.id } },
        { now: verificationDate, idFactory: () => `portfolio-${outcome.id}` },
      );

      expect(roadmap.outcomeId).toBe(outcome.id);
      expect(roadmap.tasks.length, outcome.id).toBeGreaterThan(0);
      expect(new Set(roadmap.tasks.map((task) => task.id)).size).toBe(roadmap.tasks.length);
      expect(roadmap.questions.every((question) => question.blocksTaskIds.length > 0)).toBe(true);
      expect(roadmap.questions.every((question) =>
        question.blocksTaskIds.every((taskId) => roadmap.tasks.some((task) => task.id === taskId)),
      )).toBe(true);
    }
  });

  it("keeps unknown and unverified work fail-closed without leaking instructions", () => {
    for (const outcome of builtInRegistry.listOutcomes()) {
      const roadmap = buildRoadmap(
        { entry: { kind: "browse", outcomeId: outcome.id } },
        { now: verificationDate },
      );

      for (const task of roadmap.tasks) {
        if (task.applicability === "unknown") {
          expect(task.actionability, `${outcome.id}:${task.id}`).toBe("withheld");
          expect(task.status, `${outcome.id}:${task.id}`).toBe("needs-information");
        }
        if (task.actionability === "withheld") {
          expect(task.journey?.instructions ?? [], `${outcome.id}:${task.id}`).toEqual([]);
          expect(task.journey?.officialUrl, `${outcome.id}:${task.id}`).toBeUndefined();
          expect(task.completionProof, `${outcome.id}:${task.id}`).toBeUndefined();
          expect(task.requiredInformation, `${outcome.id}:${task.id}`).toEqual([]);
          expect(task.requiredDocuments, `${outcome.id}:${task.id}`).toEqual([]);
        }
      }
    }
  });

  it("gives every outcome at least one fully admitted actionable journey", () => {
    for (const outcome of builtInRegistry.listOutcomes()) {
      const roadmap = buildRoadmap(
        {
          entry: { kind: "browse", outcomeId: outcome.id },
          answers: answersFor(outcome.id),
        },
        { now: verificationDate },
      );
      const actionable = roadmap.tasks.filter((task) => task.actionability === "actionable");

      expect(actionable.length, outcome.id).toBeGreaterThan(0);
      for (const task of actionable) {
        expect(task.completionProof?.description, `${outcome.id}:${task.id}`).toBeTruthy();
        expect(task.journey, `${outcome.id}:${task.id}`).toBeDefined();
        expect(
          task.journey?.channel === "offline" || Boolean(task.journey?.officialUrl),
          `${outcome.id}:${task.id}`,
        ).toBe(true);

        if (task.journey?.officialUrl) {
          const url = new URL(task.journey.officialUrl);
          expect(url.protocol, `${outcome.id}:${task.id}`).toBe("https:");
          expect(placeholderHost.test(url.hostname), `${outcome.id}:${task.id}`).toBe(false);
          const pack = builtInRegistry.getPackForOutcome(outcome.id);
          expect(pack?.lifecycle, outcome.id).toBe("admitted");
          expect(
            pack?.journeys.some((journey) =>
              journey.id === task.journey?.id && journey.officialUrl === task.journey.officialUrl,
            ),
            `${outcome.id}:${task.id}`,
          ).toBe(true);
        }

        expect(task.evidence.length, `${outcome.id}:${task.id}`).toBeGreaterThan(0);
        expect(task.evidence.every((claim) =>
          claim.status === "verified" && claim.current && claim.applicability === true &&
          claim.sources.length > 0 && claim.sources.every((source) => {
            const url = new URL(source.url);
            return source.official && url.protocol === "https:" && !placeholderHost.test(url.hostname);
          }),
        ), `${outcome.id}:${task.id}`).toBe(true);
      }
    }
  });

  it("changes at least one task graph while explicit unknowns remain blocked", () => {
    for (const outcome of builtInRegistry.listOutcomes()) {
      const unknown = buildRoadmap(
        { entry: { kind: "browse", outcomeId: outcome.id } },
        { now: verificationDate },
      );
      const answered = buildRoadmap(
        {
          entry: { kind: "browse", outcomeId: outcome.id },
          answers: answersFor(outcome.id),
        },
        { now: verificationDate },
      );

      expect(
        answered.tasks.some((task) => task.actionability === "actionable"),
        outcome.id,
      ).toBe(true);
      expect(
        unknown.tasks.some((task) =>
          task.actionability === "withheld" &&
          (task.status === "needs-information" || task.status === "blocked"),
        ),
        outcome.id,
      ).toBe(true);
      expect(
        JSON.stringify(unknown.tasks.map(({ id, status, actionability }) => ({ id, status, actionability }))),
        outcome.id,
      ).not.toBe(
        JSON.stringify(answered.tasks.map(({ id, status, actionability }) => ({ id, status, actionability }))),
      );
    }
  });
});
