import type {
  Answers,
  BuildRoadmapInput,
  ContentRegistry,
  IntentProvider,
  IntentProviderResult,
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

function assertPrivacySafeAnswers(answers: Answers | undefined): void {
  if (!answers) return;
  for (const [key, value] of Object.entries(answers)) {
    if (forbiddenFactKey.test(key)) {
      throw new PrivacyViolationError(
        `Credentials and document payloads are not accepted as roadmap facts: ${key}.`,
      );
    }
    if (
      value !== undefined &&
      value !== null &&
      typeof value !== "string" &&
      typeof value !== "number" &&
      typeof value !== "boolean"
    ) {
      throw new PrivacyViolationError(
        `Roadmap facts must be privacy-safe primitive values: ${key}.`,
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
  assertPrivacySafeAnswers(result.extractedAnswers);
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
      assertPrivacySafeAnswers(input.answers);
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
      const roadmap = buildRoadmap(
        {
          ...input,
          entry: resolvedEntry,
          answers: { ...extractedAnswers, ...(input.answers ?? {}) },
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
      assertPrivacySafeAnswers(answers);
      const roadmap = await repository.load(roadmapId);
      if (!roadmap) throw new RoadmapNotFoundError(roadmapId);
      const updated = rebuildRoadmapWithAnswers(roadmap, answers, {
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
