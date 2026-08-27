import {
  REGISTRY_SCHEMA_VERSION,
  type ClaimDefinition,
  type ContentRegistry,
  type EvidenceSourceDefinition,
  type JourneyDefinition,
  type Jurisdiction,
  type KnowledgePackV1,
  type OutcomeDefinition,
  type QuestionDefinition,
  type TaskDefinition,
} from "./domain.js";
import { builtInKnowledgePacks } from "./packs/index.js";

export interface RegistryValidationIssue {
  readonly code: string;
  readonly path: string;
  readonly message: string;
}

export class RegistryValidationError extends Error {
  public readonly issues: readonly RegistryValidationIssue[];

  public constructor(issues: readonly RegistryValidationIssue[]) {
    super(
      `Knowledge registry is invalid: ${issues.map((issue) => issue.message).join("; ")}`,
    );
    this.name = "RegistryValidationError";
    this.issues = issues;
  }
}

const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/;
const SEMVER_PATTERN = /^\d+\.\d+\.\d+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const issue = (
  issues: RegistryValidationIssue[],
  code: string,
  path: string,
  message: string,
): void => {
  issues.push({ code, path, message });
};

function validateJurisdiction(
  jurisdiction: Jurisdiction,
  path: string,
  issues: RegistryValidationIssue[],
): void {
  if (jurisdiction.countryCode !== "IN") {
    issue(issues, "invalid-jurisdiction", path, `${path} must target country IN.`);
  }
  if (jurisdiction.level === "state" && !jurisdiction.stateCode) {
    issue(
      issues,
      "invalid-jurisdiction",
      path,
      `${path} must declare stateCode for state jurisdiction.`,
    );
  }
  if (jurisdiction.level === "local" && (!jurisdiction.stateCode || !jurisdiction.localCode)) {
    issue(
      issues,
      "invalid-jurisdiction",
      path,
      `${path} must declare stateCode and localCode for local jurisdiction.`,
    );
  }
  if (jurisdiction.level === "institution" && !jurisdiction.institutionId) {
    issue(
      issues,
      "invalid-jurisdiction",
      path,
      `${path} must declare institutionId for institution jurisdiction.`,
    );
  }
}

function jurisdictionSupports(
  source: Jurisdiction,
  claim: Jurisdiction,
): boolean {
  if (source.countryCode !== claim.countryCode || source.level !== claim.level) {
    return false;
  }
  if (claim.level === "state") {
    return source.stateCode === claim.stateCode;
  }
  if (claim.level === "local") {
    return (
      source.stateCode === claim.stateCode && source.localCode === claim.localCode
    );
  }
  if (claim.level === "institution") {
    return source.institutionId === claim.institutionId;
  }
  return true;
}

function validateDate(
  value: string | undefined,
  path: string,
  issues: RegistryValidationIssue[],
): void {
  if (!value || !DATE_PATTERN.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    issue(issues, "invalid-date", path, `${path} must be an ISO calendar date.`);
  }
}

function hasCycle(tasks: readonly TaskDefinition[]): boolean {
  const taskIds = new Set(tasks.map((task) => task.id));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const byId = new Map(tasks.map((task) => [task.id, task]));

  const visit = (taskId: string): boolean => {
    if (visiting.has(taskId)) return true;
    if (visited.has(taskId)) return false;
    visiting.add(taskId);
    for (const dependencyId of byId.get(taskId)?.dependencies ?? []) {
      if (taskIds.has(dependencyId) && visit(dependencyId)) return true;
    }
    visiting.delete(taskId);
    visited.add(taskId);
    return false;
  };

  return tasks.some((task) => visit(task.id));
}

function validatePack(
  pack: KnowledgePackV1,
  packIndex: number,
  allIds: Map<string, string>,
  issues: RegistryValidationIssue[],
): void {
  const root = `packs[${packIndex}]`;
  if (pack.schemaVersion !== REGISTRY_SCHEMA_VERSION) {
    issue(
      issues,
      "unsupported-schema-version",
      `${root}.schemaVersion`,
      `${pack.id} uses unsupported schema ${pack.schemaVersion}.`,
    );
  }
  if (!SEMVER_PATTERN.test(pack.version)) {
    issue(issues, "invalid-version", `${root}.version`, `${pack.id} has an invalid version.`);
  }

  const registerId = (id: string, path: string): void => {
    if (!ID_PATTERN.test(id)) {
      issue(issues, "invalid-id", path, `${path} contains an invalid ID: ${id}.`);
    }
    const previous = allIds.get(id);
    if (previous) {
      issue(
        issues,
        "duplicate-id",
        path,
        `${id} is already declared at ${previous}; IDs are registry-global.`,
      );
    } else {
      allIds.set(id, path);
    }
  };

  registerId(pack.id, `${root}.id`);
  pack.sources.forEach((source, index) =>
    registerId(source.id, `${root}.sources[${index}].id`),
  );
  pack.claims.forEach((claim, index) =>
    registerId(claim.id, `${root}.claims[${index}].id`),
  );
  pack.journeys.forEach((journey, index) => {
    registerId(journey.id, `${root}.journeys[${index}].id`);
    journey.instructions.forEach((step, stepIndex) =>
      registerId(step.id, `${root}.journeys[${index}].instructions[${stepIndex}].id`),
    );
  });
  pack.questions.forEach((question, index) =>
    registerId(question.id, `${root}.questions[${index}].id`),
  );
  pack.tasks.forEach((task, index) =>
    registerId(task.id, `${root}.tasks[${index}].id`),
  );
  pack.outcomes.forEach((outcome, index) =>
    registerId(outcome.id, `${root}.outcomes[${index}].id`),
  );

  const sources = new Map(pack.sources.map((source) => [source.id, source]));
  const claims = new Map(pack.claims.map((claim) => [claim.id, claim]));
  const journeys = new Map(pack.journeys.map((journey) => [journey.id, journey]));
  const questions = new Map(pack.questions.map((question) => [question.id, question]));
  const tasks = new Map(pack.tasks.map((task) => [task.id, task]));

  pack.sources.forEach((source, index) => {
    const path = `${root}.sources[${index}]`;
    validateJurisdiction(source.jurisdiction, `${path}.jurisdiction`, issues);
    validateDate(source.retrievedOn, `${path}.retrievedOn`, issues);
    if (!source.url.startsWith("https://")) {
      issue(issues, "invalid-source-url", `${path}.url`, `${source.id} must use HTTPS.`);
    }
  });

  pack.claims.forEach((claim, index) => {
    const path = `${root}.claims[${index}]`;
    validateJurisdiction(claim.jurisdiction, `${path}.jurisdiction`, issues);
    const supportingSources = claim.sourceIds.flatMap((sourceId) => {
      const source = sources.get(sourceId);
      if (!source) {
        issue(
          issues,
          "unknown-source-reference",
          `${path}.sourceIds`,
          `${claim.id} references source ${sourceId} outside its pack.`,
        );
        return [];
      }
      if (!jurisdictionSupports(source.jurisdiction, claim.jurisdiction)) {
        issue(
          issues,
          "jurisdiction-mismatch",
          `${path}.sourceIds`,
          `${source.id} does not match the jurisdiction of ${claim.id}.`,
        );
      }
      return [source];
    });

    if (claim.status === "verified") {
      validateDate(claim.verifiedOn, `${path}.verifiedOn`, issues);
      validateDate(claim.reviewDueOn, `${path}.reviewDueOn`, issues);
      if (
        claim.verifiedOn &&
        claim.reviewDueOn &&
        claim.reviewDueOn < claim.verifiedOn
      ) {
        issue(
          issues,
          "invalid-review-window",
          `${path}.reviewDueOn`,
          `${claim.id} is due for review before it was verified.`,
        );
      }
      if (
        !supportingSources.some(
          (source) => source.official && source.tier !== "historical-discovery",
        )
      ) {
        issue(
          issues,
          "verified-claim-source-required",
          `${path}.sourceIds`,
          `${claim.id} needs official, non-historical evidence.`,
        );
      }
    }
  });

  const validateClaimReferences = (
    claimIds: readonly string[],
    path: string,
  ): void => {
    for (const claimId of claimIds) {
      if (!claims.has(claimId)) {
        issue(
          issues,
          "unknown-claim-reference",
          path,
          `${path} references claim ${claimId} outside its pack.`,
        );
      }
    }
  };

  pack.journeys.forEach((journey, index) => {
    const path = `${root}.journeys[${index}]`;
    validateClaimReferences(journey.startClaimIds, `${path}.startClaimIds`);
    journey.instructions.forEach((step, stepIndex) => {
      validateClaimReferences(
        step.claimIds,
        `${path}.instructions[${stepIndex}].claimIds`,
      );
      if (pack.lifecycle === "admitted" && step.claimIds.length === 0) {
        issue(
          issues,
          "instruction-claim-required",
          `${path}.instructions[${stepIndex}].claimIds`,
          `${step.id} must be claim-backed.`,
        );
      }
    });
    if (journey.completionProof) {
      validateClaimReferences(
        journey.completionProof.claimIds,
        `${path}.completionProof.claimIds`,
      );
      if (
        pack.lifecycle === "admitted" &&
        !journey.completionProof.claimIds.some(
          (claimId) => claims.get(claimId)?.kind === "completion-proof",
        )
      ) {
        issue(
          issues,
          "completion-proof-claim-required",
          `${path}.completionProof.claimIds`,
          `${journey.id} completion proof must reference a completion-proof claim.`,
        );
      }
    }
    if (journey.helpClaimIds) {
      validateClaimReferences(journey.helpClaimIds, `${path}.helpClaimIds`);
    }
    if (
      pack.lifecycle === "admitted" &&
      (journey.channel === "portal" || journey.channel === "mixed") &&
      !journey.officialUrl?.startsWith("https://")
    ) {
      issue(
        issues,
        "official-start-required",
        `${path}.officialUrl`,
        `${journey.id} must expose an HTTPS official start URL.`,
      );
    }
  });

  pack.tasks.forEach((task, index) => {
    const path = `${root}.tasks[${index}]`;
    validateClaimReferences(task.requiredClaimIds, `${path}.requiredClaimIds`);
    for (const dependencyId of task.dependencies ?? []) {
      if (!tasks.has(dependencyId)) {
        issue(
          issues,
          "unknown-dependency",
          `${path}.dependencies`,
          `${task.id} depends on unknown task ${dependencyId}.`,
        );
      }
    }
    const journey = task.journeyId ? journeys.get(task.journeyId) : undefined;
    if (task.journeyId && !journey) {
      issue(
        issues,
        "unknown-journey-reference",
        `${path}.journeyId`,
        `${task.id} references journey ${task.journeyId} outside its pack.`,
      );
    }
    if (
      pack.lifecycle === "admitted" &&
      task.classification !== "outside-scope" &&
      !journey?.completionProof
    ) {
      issue(
        issues,
        "completion-proof-required",
        `${path}.journeyId`,
        `${task.id} requires a declared, claim-backed completion proof.`,
      );
    }
  });

  pack.outcomes.forEach((outcome, index) => {
    const path = `${root}.outcomes[${index}]`;
    if (!SEMVER_PATTERN.test(outcome.version)) {
      issue(
        issues,
        "invalid-version",
        `${path}.version`,
        `${outcome.id} has an invalid version.`,
      );
    }
    for (const questionId of outcome.questionIds) {
      if (!questions.has(questionId)) {
        issue(
          issues,
          "unknown-question-reference",
          `${path}.questionIds`,
          `${outcome.id} references question ${questionId} outside its pack.`,
        );
      }
    }
    const outcomeTasks = outcome.taskIds.flatMap((taskId) => {
      const task = tasks.get(taskId);
      if (!task) {
        issue(
          issues,
          "unknown-task-reference",
          `${path}.taskIds`,
          `${outcome.id} references task ${taskId} outside its pack.`,
        );
        return [];
      }
      return [task];
    });
    const outcomeTaskIds = new Set(outcome.taskIds);
    for (const task of outcomeTasks) {
      for (const dependencyId of task.dependencies ?? []) {
        if (!outcomeTaskIds.has(dependencyId)) {
          issue(
            issues,
            "cross-outcome-dependency",
            `${path}.taskIds`,
            `${task.id} depends on ${dependencyId}, which is not in ${outcome.id}.`,
          );
        }
      }
    }
    if (hasCycle(outcomeTasks)) {
      issue(
        issues,
        "dependency-cycle",
        `${path}.taskIds`,
        `${outcome.id} contains a dependency cycle.`,
      );
    }
  });
}

export function createRegistry(
  packs: readonly KnowledgePackV1[],
  _options: Readonly<{ now?: Date }> = {},
): ContentRegistry {
  const issues: RegistryValidationIssue[] = [];
  const allIds = new Map<string, string>();
  packs.forEach((pack, index) => validatePack(pack, index, allIds, issues));
  if (issues.length > 0) throw new RegistryValidationError(issues);

  const outcomeToPack = new Map<string, KnowledgePackV1>();
  for (const pack of packs) {
    for (const outcome of pack.outcomes) outcomeToPack.set(outcome.id, pack);
  }

  const findInPack = <T extends { readonly id: string }>(
    packId: string,
    select: (pack: KnowledgePackV1) => readonly T[],
    id: string,
  ): T | undefined => select(packs.find((pack) => pack.id === packId) ?? emptyPack).find(
    (item) => item.id === id,
  );

  return {
    schemaVersion: REGISTRY_SCHEMA_VERSION,
    packs: [...packs],
    getOutcome: (outcomeId) => outcomeToPack.get(outcomeId)?.outcomes.find(
      (outcome) => outcome.id === outcomeId,
    ),
    getPackForOutcome: (outcomeId) => outcomeToPack.get(outcomeId),
    getTask: (packId, taskId) => findInPack(packId, (pack) => pack.tasks, taskId),
    getQuestion: (packId, questionId) =>
      findInPack(packId, (pack) => pack.questions, questionId),
    getClaim: (packId, claimId) => findInPack(packId, (pack) => pack.claims, claimId),
    getSource: (packId, sourceId) =>
      findInPack(packId, (pack) => pack.sources, sourceId),
    getJourney: (packId, journeyId) =>
      findInPack(packId, (pack) => pack.journeys, journeyId),
    listOutcomes: (domain) =>
      packs
        .flatMap((pack) => pack.outcomes)
        .filter((outcome) => !domain || outcome.domains.includes(domain)),
  };
}

const emptyPack: KnowledgePackV1 = {
  schemaVersion: REGISTRY_SCHEMA_VERSION,
  id: "empty-pack",
  version: "0.0.0",
  lifecycle: "fixture",
  sources: [],
  claims: [],
  journeys: [],
  questions: [],
  tasks: [],
  outcomes: [],
};

export const builtInRegistry = createRegistry(builtInKnowledgePacks);

export function resolveNaturalLanguageOutcome(
  registry: ContentRegistry,
  text: string,
): OutcomeDefinition | undefined {
  const normalizedText = text.toLocaleLowerCase("en-IN").trim();
  const scored = registry
    .listOutcomes()
    .map((outcome) => ({
      outcome,
      score: outcome.intentPhrases.reduce(
        (total, phrase) =>
          total +
          (normalizedText.includes(phrase.toLocaleLowerCase("en-IN")) ? 1 : 0),
        0,
      ),
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score || left.outcome.id.localeCompare(right.outcome.id));

  if (!scored[0] || scored[1]?.score === scored[0].score) return undefined;
  return scored[0].outcome;
}

export type RegistryEntity =
  | OutcomeDefinition
  | TaskDefinition
  | QuestionDefinition
  | ClaimDefinition
  | EvidenceSourceDefinition
  | JourneyDefinition;
