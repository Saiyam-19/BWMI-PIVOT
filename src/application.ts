import type {
  Answers,
  BuildRoadmapInput,
  ContentRegistry,
  IntentProvider,
  IntentProviderResult,
  QuestionDefinition,
  Roadmap,
  RoadmapRepository,
  TaskTransition,
} from "./domain.js";
import {
  buildRoadmap,
  rebuildRoadmapWithAnswers,
  transitionTask,
} from "./engine.js";
import { deterministicIntentProvider } from "./intent.js";
import { InMemoryRoadmapRepository } from "./persistence.js";
import { builtInRegistry } from "./registry.js";

export class UnsafeAiSelectionError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "UnsafeAiSelectionError";
  }
}

export class PrivacyViolationError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "PrivacyViolationError";
  }
}

export class RoadmapNotFoundError extends Error {
  public constructor(roadmapId: string) {
    super(`Roadmap not found: ${roadmapId}`);
    this.name = "RoadmapNotFoundError";
  }
}

const forbiddenFactKey =
  /(password|passcode|secret|token|credential|document|upload|attachment|filecontents)/i;

function assertPrivacySafeAnswers(
  answers: Answers | undefined,
  approvedFactKeys: ReadonlySet<string> = new Set(),
): void {
  if (!answers) return;
  for (const [key, value] of Object.entries(answers)) {
    if (forbiddenFactKey.test(key) && !approvedFactKeys.has(key)) {
      throw new PrivacyViolationError(
        `Credentials and document payloads are not accepted as roadmap facts: ${key}.`,
      );
    }
    if (
      value !== undefined &&
      value !== null &&
      typeof value !== "string" &&
      typeof value !== "number" &&
      typeof value !== "boolean" &&
      !(
        Array.isArray(value) &&
        value.length <= 50 &&
        value.every((item) => typeof item === "string" && item.length <= 500)
      )
    ) {
      throw new PrivacyViolationError(
        `Roadmap facts must be privacy-safe primitive values or bounded option lists: ${key}.`,
      );
    }
    if (
      typeof value === "string" &&
      (/-----BEGIN [A-Z ]+PRIVATE KEY-----/.test(value) || value.startsWith("data:"))
    ) {
      throw new PrivacyViolationError(
        `Credential and file contents are not accepted as roadmap facts: ${key}.`,
      );
    }
  }
}

function approvedFactKeysForOutcome(
  registry: ContentRegistry,
  outcomeId: string,
): ReadonlySet<string> {
  const outcome = registry.getOutcome(outcomeId);
  const pack = registry.getPackForOutcome(outcomeId);
  if (!outcome || !pack) return new Set();
  return new Set(outcome.questionIds.flatMap((questionId) => {
    const question = pack.questions.find((candidate) => candidate.id === questionId);
    return question ? [question.factKey] : [];
  }));
}

function questionsByFactKeyForOutcome(
  registry: ContentRegistry,
  outcomeId: string,
): ReadonlyMap<string, QuestionDefinition> {
  const outcome = registry.getOutcome(outcomeId);
  const pack = registry.getPackForOutcome(outcomeId);
  if (!outcome || !pack) return new Map();
  return new Map(outcome.questionIds.flatMap((questionId) => {
    const question = pack.questions.find((candidate) => candidate.id === questionId);
    return question ? [[question.factKey, question] as const] : [];
  }));
}

function assertTypedAnswers(
  answers: Answers | undefined,
  questions: ReadonlyMap<string, QuestionDefinition>,
): void {
  if (!answers) return;
  for (const [factKey, value] of Object.entries(answers)) {
    if (value === null || value === undefined) continue;
    const question = questions.get(factKey);
    if (!question) continue;

    const valid = (() => {
      switch (question.answerType) {
        case "boolean": return typeof value === "boolean";
        case "single_select": return typeof value === "string" && question.options.includes(value);
        case "multi_select": return Array.isArray(value) && value.length > 0 && value.every((item) => question.options.includes(item));
        case "number": return typeof value === "number" && Number.isFinite(value);
        case "date": return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
        case "identifier":
        case "text": return typeof value === "string" && value.trim().length > 0;
        case "document":
        case "unknown": return false;
      }
    })();

    if (!valid) {
      throw new PrivacyViolationError(
        `The answer for ${factKey} does not match its approved ${question.answerType} format.`,
      );
    }
  }
}

const explicitUnknownValues = new Set([
  "unknown",
  "not known",
  "not sure",
  "unsure",
  "uncertain",
]);

function normalizeExplicitUnknownAnswers(
  answers: Answers,
  questions: ReadonlyMap<string, QuestionDefinition>,
): Answers {
  return Object.fromEntries(Object.entries(answers).map(([factKey, value]) => {
    const question = questions.get(factKey);
    if (!question) return [factKey, value];
    const isUnknown = typeof value === "string" && explicitUnknownValues.has(value.trim().toLowerCase());
    const isOnlyUnknownSelection = Array.isArray(value) && value.length > 0 && value.every((item) =>
      explicitUnknownValues.has(item.trim().toLowerCase()),
    );
    return [factKey, isUnknown || isOnlyUnknownSelection ? null : value];
  }));
}

function providerRequest(registry: ContentRegistry, text: string) {
  return {
    text,
    outcomes: registry.listOutcomes().map((outcome) => ({
      id: outcome.id,
      title: outcome.title,
      intentPhrases: outcome.intentPhrases,
      approvedTaskIds: outcome.taskIds,
      approvedQuestionIds: outcome.questionIds,
    })),
  };
}

function validateProviderResult(
  registry: ContentRegistry,
  result: IntentProviderResult,
): Readonly<{ outcomeId: string; answers: Answers }> {
  if (!result.outcomeId) {
    throw new UnsafeAiSelectionError(
      "The intent provider did not select one approved outcome.",
    );
  }
  const outcome = registry.getOutcome(result.outcomeId);
  const pack = registry.getPackForOutcome(result.outcomeId);
  if (!outcome || !pack) {
    throw new UnsafeAiSelectionError(
      `The intent provider selected an unapproved outcome ID: ${result.outcomeId}.`,
    );
  }
  const allowedTaskIds = new Set(outcome.taskIds);
  const allowedQuestionIds = new Set(outcome.questionIds);
  const questionFactKeys = new Set(
    outcome.questionIds.flatMap((questionId) => {
      const question = pack.questions.find((candidate) => candidate.id === questionId);
      return question ? [question.factKey] : [];
    }),
  );
  const unsafeTaskId = result.selectedTaskIds.find((id) => !allowedTaskIds.has(id));
  const unsafeQuestionId = result.selectedQuestionIds.find(
    (id) => !allowedQuestionIds.has(id),
  );
  const unsafeFactKey = Object.keys(result.extractedAnswers).find(
    (key) => !questionFactKeys.has(key),
  );
  if (unsafeTaskId || unsafeQuestionId || unsafeFactKey) {
    throw new UnsafeAiSelectionError(
      `The intent provider selected an unapproved registry ID: ${unsafeTaskId ?? unsafeQuestionId ?? unsafeFactKey}.`,
    );
  }
  assertPrivacySafeAnswers(result.extractedAnswers, questionFactKeys);
  assertTypedAnswers(
    result.extractedAnswers,
    questionsByFactKeyForOutcome(registry, outcome.id),
  );
  return { outcomeId: outcome.id, answers: result.extractedAnswers };
}

export interface NavigatorApplication {
  start(input: BuildRoadmapInput): Promise<Roadmap>;
  answer(roadmapId: string, answers: Answers): Promise<Roadmap>;
  transition(
    roadmapId: string,
    taskId: string,
    transition: TaskTransition,
  ): Promise<Roadmap>;
  load(roadmapId: string): Promise<Roadmap | undefined>;
}

export interface NavigatorApplicationOptions {
  readonly registry?: ContentRegistry;
  readonly intentProvider?: IntentProvider;
  readonly repository?: RoadmapRepository;
  readonly idFactory?: () => string;
  readonly clock?: () => Date;
}

export function createNavigatorApplication(
  options: NavigatorApplicationOptions = {},
): NavigatorApplication {
  const registry = options.registry ?? builtInRegistry;
  const intentProvider = options.intentProvider ?? deterministicIntentProvider;
  const repository = options.repository ?? new InMemoryRoadmapRepository();
  const clock = options.clock ?? (() => new Date());

  return {
    async start(input) {
      let resolvedEntry = input.entry;
      let extractedAnswers: Answers = {};
      if (input.entry.kind === "natural-language") {
        const interpretation = await intentProvider.interpret(
          providerRequest(registry, input.entry.text),
        );
        const validated = validateProviderResult(registry, interpretation);
        resolvedEntry = { kind: "browse", outcomeId: validated.outcomeId };
        extractedAnswers = validated.answers;
      }
      if (resolvedEntry.kind === "browse") {
        assertPrivacySafeAnswers(
          input.answers,
          approvedFactKeysForOutcome(registry, resolvedEntry.outcomeId),
        );
        assertTypedAnswers(
          input.answers,
          questionsByFactKeyForOutcome(registry, resolvedEntry.outcomeId),
        );
      }
      if (resolvedEntry.kind !== "browse") {
        throw new UnsafeAiSelectionError("The entry could not be resolved to an approved outcome.");
      }
      const roadmap = buildRoadmap(
        {
          ...input,
          entry: resolvedEntry,
          answers: normalizeExplicitUnknownAnswers(
            { ...extractedAnswers, ...(input.answers ?? {}) },
            questionsByFactKeyForOutcome(registry, resolvedEntry.outcomeId),
          ),
        },
        {
          registry,
          now: clock(),
          ...(options.idFactory ? { idFactory: options.idFactory } : {}),
        },
      );
      await repository.save(roadmap);
      return roadmap;
    },

    async answer(roadmapId, answers) {
      const roadmap = await repository.load(roadmapId);
      if (!roadmap) throw new RoadmapNotFoundError(roadmapId);
      assertPrivacySafeAnswers(
        answers,
        approvedFactKeysForOutcome(registry, roadmap.outcomeId),
      );
      assertTypedAnswers(
        answers,
        questionsByFactKeyForOutcome(registry, roadmap.outcomeId),
      );
      const normalizedAnswers = normalizeExplicitUnknownAnswers(
        answers,
        questionsByFactKeyForOutcome(registry, roadmap.outcomeId),
      );
      const updated = rebuildRoadmapWithAnswers(roadmap, normalizedAnswers, {
        registry,
        now: clock(),
      });
      await repository.save(updated);
      return updated;
    },

    async transition(roadmapId, taskId, transition) {
      const roadmap = await repository.load(roadmapId);
      if (!roadmap) throw new RoadmapNotFoundError(roadmapId);
      const updated = transitionTask(roadmap, taskId, transition);
      await repository.save(updated);
      return updated;
    },

    load: (roadmapId) => repository.load(roadmapId),
  };
}
