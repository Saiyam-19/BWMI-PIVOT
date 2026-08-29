import { describe, expect, it } from "vitest";

import { buildRoadmap, builtInRegistry, type AnswerValue } from "../../src/index.js";

// 05:00 in India on the release date, while UTC is still the previous day.
const verificationDate = new Date("2026-08-27T23:30:00.000Z");
const placeholderHost = /(^|\.)(example\.(com|org|net)|localhost|invalid)$/i;

function answersFor(outcomeId: string): Readonly<Record<string, AnswerValue>> {
  const pack = builtInRegistry.getPackForOutcome(outcomeId);
  const outcome = builtInRegistry.getOutcome(outcomeId);
  if (!pack || !outcome) throw new Error(`Missing admitted outcome ${outcomeId}.`);

  return Object.fromEntries(
    outcome.questionIds.map((questionId) => {
      const question = pack.questions.find((candidate) => candidate.id === questionId);
      if (!question) throw new Error(`Missing question ${questionId} for ${outcomeId}.`);
      const value: AnswerValue = (() => {
        switch (question.answerType) {
          case "boolean": return true;
          case "single_select": return question.options[0] ?? null;
          case "multi_select": return question.options[0] ? [question.options[0]] : null;
          case "number": return 1;
          case "date": return "2026-08-28";
          case "identifier":
          case "text": return "Known for manual review";
          case "document":
          case "unknown": return null;
        }
      })();
      return [question.factKey, value];
    }),
  );
}

describe("admitted outcome portfolio", () => {
  it("audits every authored question as reviewed executable effects or explicit manual review", () => {
    const executableOutcomeIds = new Set<string>();
    let executableQuestionCount = 0;

    for (const outcome of builtInRegistry.listOutcomes()) {
      const pack = builtInRegistry.getPackForOutcome(outcome.id)!;
      const initial = buildRoadmap(
        { entry: { kind: "browse", outcomeId: outcome.id } },
        { now: verificationDate },
      );

      for (const questionId of outcome.questionIds) {
        const definition = pack.questions.find((question) => question.id === questionId)!;
        expect(["safe-effects", "manual-review"], definition.id).toContain(definition.resolutionMode);

        if (definition.resolutionMode === "manual-review") {
          expect(definition.taskEffects, definition.id).toBeUndefined();
          continue;
        }

        executableQuestionCount += 1;
        executableOutcomeIds.add(outcome.id);
        expect(definition.taskEffects?.length, definition.id).toBeGreaterThan(0);
        const initialQuestion = initial.questions.find((question) => question.id === definition.id);
        expect(initialQuestion, definition.id).toBeDefined();

        for (const effect of definition.taskEffects ?? []) {
          if (definition.answerType === "boolean") {
            expect(typeof effect.when, definition.id).toBe("boolean");
          } else {
            expect(definition.answerType, definition.id).toBe("single_select");
            expect(definition.options, definition.id).toContain(effect.when);
          }

          const updated = buildRoadmap(
            {
              entry: { kind: "browse", outcomeId: outcome.id },
              answers: { [definition.factKey]: effect.when },
            },
            { now: verificationDate },
          );
          if (effect.effect === "exclude") {
            expect(updated.tasks.some((task) => task.id === effect.taskId), definition.id).toBe(false);
            expect(updated.excludedTasks.some((task) => task.id === effect.taskId), definition.id).toBe(true);
          } else {
            const task = updated.tasks.find((candidate) => candidate.id === effect.taskId);
            expect(task, definition.id).toBeDefined();
            expect(task?.missingAnswers, definition.id).not.toContain(definition.factKey);
          }
        }

        const unknown = buildRoadmap(
          {
            entry: { kind: "browse", outcomeId: outcome.id },
            answers: { [definition.factKey]: null },
          },
          { now: verificationDate },
        );
        expect(unknown.questions.some((question) => question.id === definition.id), definition.id).toBe(true);
      }
    }

    expect(executableQuestionCount).toBeGreaterThan(2);
    expect(executableOutcomeIds.size).toBeGreaterThan(2);
  });

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

  it("does not turn prose-only authored answers into executable legal decisions", () => {
    let admittedActionableTasks = 0;
    for (const outcome of builtInRegistry.listOutcomes()) {
      const roadmap = buildRoadmap(
        {
          entry: { kind: "browse", outcomeId: outcome.id },
          answers: answersFor(outcome.id),
        },
        { now: verificationDate },
      );
      const actionable = roadmap.tasks.filter((task) => task.actionability === "actionable");
      admittedActionableTasks += actionable.length;

      expect(roadmap.questions.every((question) =>
        question.resolutionMode === "manual-review" || question.resolutionMode === "safe-effects",
      ), outcome.id).toBe(true);
      for (const question of roadmap.questions) {
        expect(question.blocksTaskIds.length, `${outcome.id}:${question.id}`).toBeGreaterThan(0);
        for (const taskId of question.blocksTaskIds) {
          const task = roadmap.tasks.find((candidate) => candidate.id === taskId);
          expect(task?.missingAnswers, `${outcome.id}:${taskId}`).toContain(question.factKey);
          expect(task?.actionability, `${outcome.id}:${taskId}`).toBe("withheld");
          expect(task?.journey?.instructions ?? [], `${outcome.id}:${taskId}`).toEqual([]);
        }
      }

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
    expect(admittedActionableTasks).toBeGreaterThan(0);
  });

  it("keeps explicit unknowns and recorded manual-review values equally fail-closed", () => {
    for (const outcome of builtInRegistry.listOutcomes()) {
      const unknown = buildRoadmap(
        { entry: { kind: "browse", outcomeId: outcome.id } },
        { now: verificationDate },
      );
      const pack = builtInRegistry.getPackForOutcome(outcome.id)!;
      const manualAnswers = Object.fromEntries(
        Object.entries(answersFor(outcome.id)).filter(([factKey]) =>
          pack.questions.find((question) => question.factKey === factKey)?.resolutionMode === "manual-review",
        ),
      );
      const answered = buildRoadmap(
        {
          entry: { kind: "browse", outcomeId: outcome.id },
          answers: manualAnswers,
        },
        { now: verificationDate },
      );

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
      ).toBe(
        JSON.stringify(answered.tasks.map(({ id, status, actionability }) => ({ id, status, actionability }))),
      );
      expect(answered.questions.map((question) => question.factKey)).toEqual(
        unknown.questions.map((question) => question.factKey),
      );
    }
  });
});
