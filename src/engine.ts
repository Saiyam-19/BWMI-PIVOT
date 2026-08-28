import { randomUUID } from "node:crypto";

import {
  REGISTRY_SCHEMA_VERSION,
  type Answers,
  type Applicability,
  type BuildRoadmapInput,
  type BuildRoadmapOptions,
  type Claim,
  type ClaimDefinition,
  type CompletionConfirmation,
  type ContentRegistry,
  type Jurisdiction,
  type KnowledgePackV1,
  type OutcomeDefinition,
  type Roadmap,
  type RoadmapJourney,
  type RoadmapNextAction,
  type RoadmapQuestion,
  type RoadmapTask,
  type TaskDefinition,
  type TaskProgressStatus,
  type TaskTransition,
} from "./domain.js";
import { builtInRegistry, resolveNaturalLanguageOutcome } from "./registry.js";
import { evaluateRule } from "./rules.js";

export class UnknownOutcomeError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "UnknownOutcomeError";
  }
}

export class CompletionProofRequiredError extends Error {
  public constructor(taskId: string) {
    super(`Task ${taskId} requires confirmation of its declared completion proof.`);
    this.name = "CompletionProofRequiredError";
  }
}

export class InvalidTaskTransitionError extends Error {
  public constructor(taskId: string, from: TaskProgressStatus, to: TaskProgressStatus) {
    super(`Task ${taskId} cannot transition from ${from} to ${to}.`);
    this.name = "InvalidTaskTransitionError";
  }
}

const defaultJurisdiction: Jurisdiction = {
  countryCode: "IN",
  level: "central",
};

const unique = (values: readonly string[]): readonly string[] => [
  ...new Set(values),
];

function resolveOutcome(
  registry: ContentRegistry,
  input: BuildRoadmapInput,
): Readonly<{ outcome: OutcomeDefinition; pack: KnowledgePackV1 }> {
  const outcome =
    input.entry.kind === "browse"
      ? registry.getOutcome(input.entry.outcomeId)
      : resolveNaturalLanguageOutcome(registry, input.entry.text);

  if (!outcome) {
    throw new UnknownOutcomeError(
      input.entry.kind === "browse"
        ? `Unsupported outcome: ${input.entry.outcomeId}`
        : "The requested outcome is unsupported or ambiguous in the approved registry.",
    );
  }
  const pack = registry.getPackForOutcome(outcome.id);
  if (!pack) throw new UnknownOutcomeError(`Outcome ${outcome.id} has no knowledge pack.`);
  return { outcome, pack };
}

function isJurisdictionApplicable(
  claimJurisdiction: Jurisdiction,
  roadmapJurisdiction: Jurisdiction,
): boolean {
  if (claimJurisdiction.countryCode !== roadmapJurisdiction.countryCode) return false;
  if (claimJurisdiction.level === "central") return true;
  if (claimJurisdiction.level === "state") {
    return claimJurisdiction.stateCode === roadmapJurisdiction.stateCode;
  }
  if (claimJurisdiction.level === "local") {
    return (
      claimJurisdiction.stateCode === roadmapJurisdiction.stateCode &&
      claimJurisdiction.localCode === roadmapJurisdiction.localCode
    );
  }
  return claimJurisdiction.institutionId === roadmapJurisdiction.institutionId;
}

function dateOnly(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = (type: "year" | "month" | "day") =>
    parts.find((part) => part.type === type)?.value;
  return `${value("year")}-${value("month")}-${value("day")}`;
}

function materializeClaim(
  claim: ClaimDefinition,
  pack: KnowledgePackV1,
  answers: Answers,
  jurisdiction: Jurisdiction,
  now: Date,
): Claim {
  const ruleEvaluation = claim.appliesWhen
    ? evaluateRule(claim.appliesWhen, answers)
    : { result: true as const, missingFields: [] as readonly string[] };
  const jurisdictionApplies = isJurisdictionApplicable(
    claim.jurisdiction,
    jurisdiction,
  );
  const applicability: Applicability = jurisdictionApplies
    ? ruleEvaluation.result
    : false;
  const today = dateOnly(now);
  const current =
    claim.status === "verified" &&
    Boolean(claim.verifiedOn && claim.verifiedOn <= today) &&
    Boolean(claim.reviewDueOn && claim.reviewDueOn >= today);
  const sources = claim.sourceIds.flatMap((sourceId) => {
    const source = pack.sources.find((candidate) => candidate.id === sourceId);
    return source ? [source] : [];
  });

  return { ...claim, applicability, current, sources };
}

function safeJourney(
  task: TaskDefinition,
  pack: KnowledgePackV1,
  actionable: boolean,
): RoadmapJourney | undefined {
  const journey = task.journeyId
    ? pack.journeys.find((candidate) => candidate.id === task.journeyId)
    : undefined;
  if (!journey) return undefined;

  return {
    id: journey.id,
    channel: journey.channel,
    ...(actionable && journey.portalName ? { portalName: journey.portalName } : {}),
    ...(actionable && journey.officialUrl ? { officialUrl: journey.officialUrl } : {}),
    instructions: actionable ? journey.instructions : [],
    ...(actionable && journey.helpOrEscalation
      ? { helpOrEscalation: journey.helpOrEscalation }
      : {}),
  };
}

function answerResolvesQuestion(
  pack: KnowledgePackV1,
  taskId: string,
  factKey: string,
  answers: Answers,
): boolean {
  const question = pack.questions.find((candidate) => candidate.factKey === factKey);
  if (question?.resolutionMode === "manual-review") return false;
  const answer = answers[factKey];
  if (answer === undefined || answer === null) return false;
  if (question?.resolutionMode === "safe-effects") {
    return question.taskEffects?.some((effect) =>
      effect.taskId === taskId && effect.effect === "resolve-gate" && effect.when === answer,
    ) ?? false;
  }
  return true;
}

function answerExcludesTask(
  pack: KnowledgePackV1,
  taskId: string,
  answers: Answers,
) {
  for (const question of pack.questions) {
    if (question.resolutionMode !== "safe-effects") continue;
    const answer = answers[question.factKey];
    const effect = question.taskEffects?.find((candidate) =>
      candidate.taskId === taskId && candidate.effect === "exclude" && candidate.when === answer,
    );
    if (effect) return { question, effect };
  }
  return undefined;
}

function materializeTask(
  task: TaskDefinition,
  pack: KnowledgePackV1,
  answers: Answers,
  jurisdiction: Jurisdiction,
  now: Date,
): RoadmapTask | undefined {
  if (answerExcludesTask(pack, task.id, answers)) return undefined;
  const ruleEvaluation = task.appliesWhen
    ? evaluateRule(task.appliesWhen, answers)
    : { result: true as const, missingFields: [] as readonly string[] };
  if (ruleEvaluation.result === false) return undefined;

  const journey = task.journeyId
    ? pack.journeys.find((candidate) => candidate.id === task.journeyId)
    : undefined;
  const requiredClaimIds = unique([
    ...task.requiredClaimIds,
    ...(journey?.startClaimIds ?? []),
    ...(journey?.instructions.flatMap((step) => step.claimIds) ?? []),
    ...(journey?.completionProof?.claimIds ?? []),
    ...(journey?.helpClaimIds ?? []),
  ]);
  const evidence = requiredClaimIds.flatMap((claimId) => {
    const definition = pack.claims.find((claim) => claim.id === claimId);
    return definition
      ? [materializeClaim(definition, pack, answers, jurisdiction, now)]
      : [];
  });
  const requiredAnswerGaps = (task.requiredAnswers ?? []).filter(
    (field) => !answerResolvesQuestion(pack, task.id, field, answers),
  );
  const claimApplicabilityGaps = evidence.flatMap((claim) =>
    claim.applicability === "unknown" && claim.appliesWhen
      ? evaluateRule(claim.appliesWhen, answers).missingFields
      : [],
  );
  const missingAnswers = unique([
    ...ruleEvaluation.missingFields,
    ...requiredAnswerGaps,
    ...claimApplicabilityGaps,
  ]);
  const applicability: Applicability =
    ruleEvaluation.result === "unknown" || missingAnswers.length > 0
      ? "unknown"
      : true;
  const allEvidenceAdmitted =
    evidence.length === requiredClaimIds.length &&
    evidence.every(
      (claim) =>
        claim.status === "verified" &&
        claim.current &&
        claim.applicability === true &&
        claim.sources.length > 0 &&
        claim.sources.every(
          (source) => source.official && source.retrievedOn <= dateOnly(now),
        ),
    );
  const outsideCentralV1 =
    task.classification === "outside-scope" ||
    task.authority.type === "state" ||
    task.authority.type === "local";
  const actionable =
    pack.lifecycle === "admitted" &&
    applicability === true &&
    allEvidenceAdmitted &&
    Boolean(journey?.completionProof) &&
    !outsideCentralV1;
  const blockers = unique([
    ...(task.blockers ?? []),
    ...(pack.lifecycle !== "admitted"
      ? ["Knowledge pack is not admitted for actionable use."]
      : []),
    ...(missingAnswers.length > 0
      ? [`Answer required: ${missingAnswers.join(", ")}.`]
      : []),
    ...(pack.lifecycle === "admitted" && !allEvidenceAdmitted
      ? ["Required claims are not verified, current, applicable and officially sourced."]
      : []),
    ...(outsideCentralV1 &&
    !task.blockers?.includes("State-specific instructions are not supported in V1.")
      ? ["State-specific instructions are not supported in V1."]
      : []),
    ...(pack.lifecycle === "admitted" && !journey?.completionProof
      ? ["A declared completion proof is required before this task can be actionable."]
      : []),
  ]);
  const materializedJourney = safeJourney(task, pack, actionable);
  const nextAction = materializedJourney?.instructions[0]?.instruction;

  return {
    id: task.id,
    title: task.title,
    action: task.action,
    reason: task.reason,
    authority: task.authority,
    classification:
      task.classification === "outside-scope"
        ? "outside-scope"
        : applicability === "unknown"
          ? "needs-information"
          : task.classification,
    applicability,
    status:
      applicability === "unknown"
        ? "needs-information"
        : actionable
          ? (task.dependencies?.length ?? 0) > 0
            ? "blocked"
            : "ready"
          : "blocked",
    actionability: actionable ? "actionable" : "withheld",
    dependencies: task.dependencies ?? [],
    missingAnswers,
    requiredInformation: actionable ? task.requiredInformation : [],
    requiredDocuments: actionable ? task.requiredDocuments : [],
    evidence,
    ...(materializedJourney ? { journey: materializedJourney } : {}),
    ...(actionable && journey?.completionProof
      ? { completionProof: journey.completionProof }
      : {}),
    ...(actionable && nextAction ? { nextAction } : {}),
    blockers,
    proofConfirmed: false,
  };
}

function recomputeDependencyStatuses(
  tasks: readonly RoadmapTask[],
): RoadmapTask[] {
  const taskIds = new Set(tasks.map((task) => task.id));
  const completedTaskIds = new Set(
    tasks.filter((task) => task.status === "completed").map((task) => task.id),
  );

  return tasks.map((task) => {
    if (
      task.status === "completed" ||
      task.status === "in-progress" ||
      task.status === "awaiting-authority" ||
      task.status === "needs-information" ||
      task.actionability === "withheld"
    ) {
      return task;
    }
    const applicableDependencies = task.dependencies.filter((dependencyId) =>
      taskIds.has(dependencyId),
    );
    const dependenciesComplete = applicableDependencies.every((dependencyId) =>
      completedTaskIds.has(dependencyId),
    );
    return {
      ...task,
      dependencies: applicableDependencies,
      status: dependenciesComplete ? "ready" : "blocked",
    };
  });
}

function questionsForRoadmap(
  outcome: OutcomeDefinition,
  pack: KnowledgePackV1,
  answers: Answers,
  tasks: readonly RoadmapTask[],
): readonly RoadmapQuestion[] {
  return outcome.questionIds.flatMap((questionId) => {
    const question = pack.questions.find((candidate) => candidate.id === questionId);
    if (!question) return [];
    if (question.askWhen && evaluateRule(question.askWhen, answers).result !== true) {
      return [];
    }
    const blocksTaskIds = tasks
      .filter((task) => task.missingAnswers.includes(question.factKey))
      .map((task) => task.id);
    if (blocksTaskIds.length === 0) return [];
    return [{ ...question, blocksTaskIds }];
  });
}

function calculateNextActions(tasks: readonly RoadmapTask[]): RoadmapNextAction[] {
  return tasks.flatMap((task) =>
    task.status === "ready" && task.actionability === "actionable" && task.nextAction
      ? [{ taskId: task.id, title: task.title, instruction: task.nextAction }]
      : [],
  );
}

function roadmapStatus(
  tasks: readonly RoadmapTask[],
  questions: readonly RoadmapQuestion[],
): Roadmap["status"] {
  if (questions.length > 0) return "needs-information";
  if (tasks.length > 0 && tasks.every((task) => task.status === "completed")) {
    return "completed";
  }
  if (tasks.some((task) => task.status === "blocked" || task.actionability === "withheld")) {
    return "blocked";
  }
  return "ready";
}

function withDerivedRoadmapState(roadmap: Roadmap): Roadmap {
  const tasks = recomputeDependencyStatuses(roadmap.tasks);
  return {
    ...roadmap,
    tasks,
    status: roadmapStatus(tasks, roadmap.questions),
    availableNextActions: calculateNextActions(tasks),
  };
}

export function buildRoadmap(
  input: BuildRoadmapInput,
  options: BuildRoadmapOptions = {},
): Roadmap {
  const registry = options.registry ?? builtInRegistry;
  const now = options.now ?? new Date();
  const { outcome, pack } = resolveOutcome(registry, input);
  const answers = input.answers ?? {};
  const jurisdiction = input.jurisdiction ?? defaultJurisdiction;
  const outcomeTasks = outcome.taskIds.flatMap((taskId) => {
    const task = pack.tasks.find((candidate) => candidate.id === taskId);
    return task ? [task] : [];
  });
  const tasks = recomputeDependencyStatuses(
    outcomeTasks.flatMap((task) => {
      const materialized = materializeTask(task, pack, answers, jurisdiction, now);
      return materialized ? [materialized] : [];
    }),
  );
  const questions = questionsForRoadmap(outcome, pack, answers, tasks);
  const roadmap: Roadmap = {
    id: input.roadmapId ?? options.idFactory?.() ?? randomUUID(),
    schemaVersion: REGISTRY_SCHEMA_VERSION,
    packId: pack.id,
    packVersion: pack.version,
    outcomeId: outcome.id,
    outcomeVersion: outcome.version,
    outcomeTitle: outcome.title,
    jurisdiction,
    status: roadmapStatus(tasks, questions),
    answers,
    questions,
    tasks,
    excludedTasks: outcomeTasks.flatMap((task) => {
      const answerExclusion = answerExcludesTask(pack, task.id, answers);
      const applies = task.appliesWhen
        ? evaluateRule(task.appliesWhen, answers).result
        : true;
      return applies === false || answerExclusion
        ? [
            {
              id: task.id,
              title: task.title,
              reason: answerExclusion
                ? `Your answer to “${answerExclusion.question.prompt}” marks this conditional branch not applicable.`
                : "The current answers make this task inapplicable.",
              classification: "not-applicable" as const,
              applicability: false as const,
            },
          ]
        : [];
    }),
    availableNextActions: calculateNextActions(tasks),
  };
  return roadmap;
}

export function getAvailableNextActions(
  roadmap: Roadmap,
): readonly RoadmapNextAction[] {
  return calculateNextActions(roadmap.tasks);
}

export function transitionTask(
  roadmap: Roadmap,
  taskId: string,
  transition: TaskTransition,
): Roadmap {
  const task = roadmap.tasks.find((candidate) => candidate.id === taskId);
  if (!task) throw new Error(`Unknown task: ${taskId}`);
  if (task.actionability !== "actionable") {
    throw new InvalidTaskTransitionError(taskId, task.status, transition.to);
  }

  const allowed =
    (task.status === "ready" &&
      (transition.to === "in-progress" || transition.to === "completed")) ||
    (task.status === "in-progress" &&
      (transition.to === "awaiting-authority" || transition.to === "completed")) ||
    (task.status === "awaiting-authority" && transition.to === "completed");
  if (!allowed) {
    throw new InvalidTaskTransitionError(taskId, task.status, transition.to);
  }
  if (
    transition.to === "completed" &&
    (!task.completionProof || transition.proofConfirmed !== true)
  ) {
    throw new CompletionProofRequiredError(taskId);
  }

  const tasks = roadmap.tasks.map((candidate) =>
    candidate.id === taskId
      ? {
          ...candidate,
          status: transition.to,
          proofConfirmed:
            transition.to === "completed" ? transition.proofConfirmed === true : false,
        }
      : candidate,
  );
  return withDerivedRoadmapState({ ...roadmap, tasks });
}

export function confirmTaskCompletion(
  roadmap: Roadmap,
  taskId: string,
  confirmation: CompletionConfirmation,
): Roadmap {
  return transitionTask(roadmap, taskId, {
    to: "completed",
    proofConfirmed: confirmation.proofConfirmed,
  });
}

export function rebuildRoadmapWithAnswers(
  roadmap: Roadmap,
  answers: Answers,
  options: BuildRoadmapOptions,
): Roadmap {
  const rebuilt = buildRoadmap(
    {
      entry: { kind: "browse", outcomeId: roadmap.outcomeId },
      answers: { ...roadmap.answers, ...answers },
      jurisdiction: roadmap.jurisdiction,
      roadmapId: roadmap.id,
    },
    options,
  );
  const priorTasks = new Map(roadmap.tasks.map((task) => [task.id, task]));
  const tasks = rebuilt.tasks.map((task) => {
    const prior = priorTasks.get(task.id);
    if (
      prior &&
      (prior.status === "completed" ||
        prior.status === "in-progress" ||
        prior.status === "awaiting-authority") &&
      task.actionability === "actionable"
    ) {
      return {
        ...task,
        status: prior.status,
        proofConfirmed: prior.proofConfirmed,
      };
    }
    return task;
  });
  return withDerivedRoadmapState({ ...rebuilt, tasks });
}
