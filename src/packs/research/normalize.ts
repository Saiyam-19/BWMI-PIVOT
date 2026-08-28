import {
  REGISTRY_SCHEMA_VERSION,
  type Authority,
  type ClaimDefinition,
  type ClaimStatus,
  type EvidenceSourceDefinition,
  type EvidenceTier,
  type JourneyDefinition,
  type JourneyStepDefinition,
  type KnowledgePackV1,
  type QuestionDefinition,
  type TaskDefinition,
} from "../../domain.js";

type JsonRecord = Record<string, unknown>;

interface ResearchPackMetadata {
  readonly pack_id: string;
  readonly title: string;
  readonly user_outcome: string;
  readonly central_scope: string;
  readonly explicit_exclusions: readonly string[];
  readonly verification_date: string;
  readonly overall_readiness: string;
}

interface ResearchQuestion {
  readonly id: string;
  readonly question: string;
  readonly why_it_matters: string;
  readonly answer_type: string;
  readonly options: readonly string[];
  readonly affects_task_ids: readonly string[];
  readonly blocking_logic: string;
  readonly evidence_status: string;
}

interface ResearchStateLocalDependency {
  readonly applies: boolean;
  readonly description: string;
  readonly status: string;
}

interface ResearchTask {
  readonly id: string;
  readonly title: string;
  readonly user_goal: string;
  readonly classification: string;
  readonly secondary_classifications: readonly string[];
  readonly actor_ids: readonly string[];
  readonly prerequisite_task_ids: readonly string[];
  readonly trigger: string;
  readonly channel: string;
  readonly portal_journey_ids: readonly string[];
  readonly required_input_ids: readonly string[];
  readonly fees_duties: readonly unknown[];
  readonly timelines: readonly unknown[];
  readonly steps: readonly string[];
  readonly completion_proof_ids: readonly string[];
  readonly tracking: string;
  readonly rejection_handling: string;
  readonly escalation: string;
  readonly state_local_dependency: ResearchStateLocalDependency;
  readonly evidence_status: string;
  readonly claim_ids: readonly string[];
  readonly fail_closed_note: string;
}

interface ResearchActor {
  readonly id: string;
  readonly name: string;
  readonly actor_type: string;
  readonly role: string;
  readonly jurisdiction: string;
  readonly channel: string;
  readonly source_claim_ids: readonly string[];
}

interface ResearchJourney {
  readonly id: string;
  readonly name: string;
  readonly actor_id: string;
  readonly official_url: string | null;
  readonly authentication: string;
  readonly navigation: string;
  readonly inputs_uploads: readonly string[];
  readonly submission_proof: string;
  readonly tracking_route: string;
  readonly exception_route: string;
  readonly access_limitation: string;
  readonly claim_ids: readonly string[];
}

interface ResearchInput {
  readonly id: string;
  readonly name: string;
  readonly issuer_or_provider: string;
  readonly supplied_by: string;
  readonly when_required: string;
  readonly format_validity: string;
  readonly task_ids: readonly string[];
  readonly sensitivity: string;
  readonly claim_ids: readonly string[];
}

interface ResearchProof {
  readonly id: string;
  readonly name: string;
  readonly issuing_actor_id: string;
  readonly artifact_or_reference: string;
  readonly validation_method: string;
  readonly task_ids: readonly string[];
  readonly retention_use: string;
  readonly claim_ids: readonly string[];
}

interface ResearchClaim {
  readonly id: string;
  readonly status: string;
  readonly statement: string;
  readonly subject: string;
  readonly jurisdiction: string;
  readonly applicability: string;
  readonly source_ids: readonly string[];
  readonly locator: string;
  readonly verified_on: string;
  readonly conflict_ids: readonly string[];
  readonly freshness_risk: string;
  readonly task_ids: readonly string[];
}

interface ResearchSource {
  readonly id: string;
  readonly issuer: string;
  readonly title: string;
  readonly source_tier: string;
  readonly jurisdiction: string;
  readonly official_url: string;
  readonly publication_date: string | null;
  readonly notification_date: string | null;
  readonly effective_date: string | null;
  readonly updated_date: string | null;
  readonly locator: string;
  readonly verified_on: string;
  readonly access_status: string;
  readonly archive_supersession_note: string;
  readonly freshness_risk: string;
}

interface ResearchPack {
  readonly schema_version: string;
  readonly pack_metadata: ResearchPackMetadata;
  readonly qualifying_questions: readonly ResearchQuestion[];
  readonly tasks: readonly ResearchTask[];
  readonly dependency_edges: readonly JsonRecord[];
  readonly authorities_actors: readonly ResearchActor[];
  readonly portal_journeys: readonly ResearchJourney[];
  readonly required_inputs: readonly ResearchInput[];
  readonly completion_proofs: readonly ResearchProof[];
  readonly claims: readonly ResearchClaim[];
  readonly sources: readonly ResearchSource[];
  readonly conflicts: readonly JsonRecord[];
  readonly coverage_gaps: readonly JsonRecord[];
  readonly demo_scenario: JsonRecord;
}

export interface ResearchPackProfile {
  readonly packId: string;
  readonly outcomeId: string;
  readonly domains: readonly string[];
  readonly intentPhrases: readonly string[];
  readonly sourceArtifact?: string;
  readonly sourceSha256?: string;
}

export interface ResearchImportIssue {
  readonly code: string;
  readonly disposition: "downgraded" | "preserved-non-actionable" | "not-mapped";
  readonly path: string;
  readonly message: string;
}

export interface ResearchClaimProvenance {
  readonly originalId: string;
  readonly normalizedId: string;
  readonly originalStatus: string;
  readonly normalizedStatus: ClaimStatus;
  readonly originalSourceIds: readonly string[];
  readonly admittedSourceIds: readonly string[];
  readonly subject: string;
  readonly jurisdiction: string;
  readonly applicability: string;
  readonly locator: string;
  readonly freshnessRisk: string;
}

export interface ResearchSourceProvenance {
  readonly originalId: string;
  readonly normalizedId: string;
  readonly sourceTier: string;
  readonly jurisdiction: string;
  readonly accessStatus: string;
  readonly freshnessRisk: string;
  readonly publicationDate: string | null;
  readonly notificationDate: string | null;
  readonly effectiveDate: string | null;
  readonly updatedDate: string | null;
  readonly archiveSupersessionNote: string;
}

export interface ResearchIntegrationReport {
  readonly packId: string;
  readonly outcomeId: string;
  readonly sourcePackId: string;
  readonly sourceSchemaVersion: string;
  readonly sourceArtifact?: string;
  readonly sourceSha256?: string;
  readonly verificationDate: string;
  readonly overallReadiness: string;
  readonly issues: readonly ResearchImportIssue[];
  readonly provenance: Readonly<{
    claims: readonly ResearchClaimProvenance[];
    sources: readonly ResearchSourceProvenance[];
  }>;
}

export interface ResearchPackImportResult {
  readonly pack: KnowledgePackV1;
  readonly report: ResearchIntegrationReport;
}

export interface ResearchPackValidationIssue {
  readonly path: string;
  readonly message: string;
}

export class ResearchPackValidationError extends Error {
  public readonly issues: readonly ResearchPackValidationIssue[];

  public constructor(issues: readonly ResearchPackValidationIssue[]) {
    super(`Research pack is structurally invalid: ${issues.map((item) => item.message).join("; ")}`);
    this.name = "ResearchPackValidationError";
    this.issues = issues;
  }
}

const TOP_LEVEL_FIELDS = [
  "schema_version",
  "pack_metadata",
  "qualifying_questions",
  "tasks",
  "dependency_edges",
  "authorities_actors",
  "portal_journeys",
  "required_inputs",
  "completion_proofs",
  "claims",
  "sources",
  "conflicts",
  "coverage_gaps",
  "demo_scenario",
] as const;

const centralJurisdiction = { countryCode: "IN", level: "central" } as const;

const isRecord = (value: unknown): value is JsonRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function requireRecord(
  value: unknown,
  path: string,
  issues: ResearchPackValidationIssue[],
): JsonRecord | undefined {
  if (!isRecord(value)) {
    issues.push({ path, message: `${path} must be an object.` });
    return undefined;
  }
  return value;
}

function requireString(
  record: JsonRecord,
  key: string,
  path: string,
  issues: ResearchPackValidationIssue[],
): void {
  if (typeof record[key] !== "string" || record[key] === "") {
    issues.push({ path: `${path}.${key}`, message: `${path}.${key} must be a non-empty string.` });
  }
}

function requireStringArray(
  record: JsonRecord,
  key: string,
  path: string,
  issues: ResearchPackValidationIssue[],
): void {
  const value = record[key];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || item === "")) {
    issues.push({ path: `${path}.${key}`, message: `${path}.${key} must be an array of non-empty strings.` });
  }
}

function requireArray(
  record: JsonRecord,
  key: string,
  path: string,
  issues: ResearchPackValidationIssue[],
): void {
  if (!Array.isArray(record[key])) {
    issues.push({ path: `${path}.${key}`, message: `${path}.${key} must be an array.` });
  }
}

function validateEntities(
  value: unknown,
  path: string,
  stringFields: readonly string[],
  stringArrayFields: readonly string[],
  arrayFields: readonly string[],
  issues: ResearchPackValidationIssue[],
): readonly JsonRecord[] {
  if (!Array.isArray(value)) {
    issues.push({ path, message: `${path} must be an array.` });
    return [];
  }
  return value.flatMap((item, index) => {
    const entity = requireRecord(item, `${path}[${index}]`, issues);
    if (!entity) return [];
    stringFields.forEach((field) => requireString(entity, field, `${path}[${index}]`, issues));
    stringArrayFields.forEach((field) =>
      requireStringArray(entity, field, `${path}[${index}]`, issues),
    );
    arrayFields.forEach((field) => requireArray(entity, field, `${path}[${index}]`, issues));
    return [entity];
  });
}

function duplicateIds(
  entities: readonly JsonRecord[],
  path: string,
  issues: ResearchPackValidationIssue[],
): void {
  const seen = new Set<string>();
  for (const [index, entity] of entities.entries()) {
    const id = entity.id;
    if (typeof id !== "string") continue;
    if (seen.has(id)) {
      issues.push({ path: `${path}[${index}].id`, message: `${path} contains duplicate ID ${id}.` });
    }
    seen.add(id);
  }
}

function validateResearchPack(input: unknown): ResearchPack {
  const issues: ResearchPackValidationIssue[] = [];
  const root = requireRecord(input, "pack", issues);
  if (!root) throw new ResearchPackValidationError(issues);

  for (const field of TOP_LEVEL_FIELDS) {
    if (!(field in root)) {
      issues.push({ path: `pack.${field}`, message: `pack.${field} is required by research schema 1.0.0.` });
    }
  }
  for (const field of Object.keys(root)) {
    if (!(TOP_LEVEL_FIELDS as readonly string[]).includes(field)) {
      issues.push({ path: `pack.${field}`, message: `pack.${field} is not allowed by research schema 1.0.0.` });
    }
  }
  requireString(root, "schema_version", "pack", issues);

  const metadata = requireRecord(root.pack_metadata, "pack.pack_metadata", issues);
  if (metadata) {
    ["pack_id", "title", "user_outcome", "central_scope", "verification_date", "overall_readiness"].forEach(
      (field) => requireString(metadata, field, "pack.pack_metadata", issues),
    );
    requireStringArray(metadata, "explicit_exclusions", "pack.pack_metadata", issues);
  }

  const questions = validateEntities(
    root.qualifying_questions,
    "pack.qualifying_questions",
    ["id", "question", "why_it_matters", "answer_type", "blocking_logic", "evidence_status"],
    ["options", "affects_task_ids"],
    [],
    issues,
  );
  const tasks = validateEntities(
    root.tasks,
    "pack.tasks",
    [
      "id", "title", "user_goal", "classification", "trigger", "channel", "tracking",
      "rejection_handling", "escalation", "evidence_status", "fail_closed_note",
    ],
    [
      "secondary_classifications", "actor_ids", "prerequisite_task_ids", "portal_journey_ids",
      "required_input_ids", "steps", "completion_proof_ids", "claim_ids",
    ],
    ["fees_duties", "timelines"],
    issues,
  );
  tasks.forEach((task, index) => {
    const dependency = requireRecord(
      task.state_local_dependency,
      `pack.tasks[${index}].state_local_dependency`,
      issues,
    );
    if (dependency) {
      if (typeof dependency.applies !== "boolean") {
        issues.push({
          path: `pack.tasks[${index}].state_local_dependency.applies`,
          message: `pack.tasks[${index}].state_local_dependency.applies must be boolean.`,
        });
      }
      requireString(dependency, "description", `pack.tasks[${index}].state_local_dependency`, issues);
      requireString(dependency, "status", `pack.tasks[${index}].state_local_dependency`, issues);
    }
  });
  const actors = validateEntities(
    root.authorities_actors,
    "pack.authorities_actors",
    ["id", "name", "actor_type", "role", "jurisdiction", "channel"],
    ["source_claim_ids"],
    [],
    issues,
  );
  const journeys = validateEntities(
    root.portal_journeys,
    "pack.portal_journeys",
    [
      "id", "name", "actor_id", "authentication", "navigation", "submission_proof",
      "tracking_route", "exception_route", "access_limitation",
    ],
    ["inputs_uploads", "claim_ids"],
    [],
    issues,
  );
  journeys.forEach((journey, index) => {
    if (journey.official_url !== null && typeof journey.official_url !== "string") {
      issues.push({
        path: `pack.portal_journeys[${index}].official_url`,
        message: `pack.portal_journeys[${index}].official_url must be a string or null.`,
      });
    }
  });
  const inputs = validateEntities(
    root.required_inputs,
    "pack.required_inputs",
    ["id", "name", "issuer_or_provider", "supplied_by", "when_required", "format_validity", "sensitivity"],
    ["task_ids", "claim_ids"],
    [],
    issues,
  );
  const proofs = validateEntities(
    root.completion_proofs,
    "pack.completion_proofs",
    ["id", "name", "issuing_actor_id", "artifact_or_reference", "validation_method", "retention_use"],
    ["task_ids", "claim_ids"],
    [],
    issues,
  );
  const claims = validateEntities(
    root.claims,
    "pack.claims",
    ["id", "status", "statement", "subject", "jurisdiction", "applicability", "locator", "verified_on", "freshness_risk"],
    ["source_ids", "conflict_ids", "task_ids"],
    [],
    issues,
  );
  const sources = validateEntities(
    root.sources,
    "pack.sources",
    [
      "id", "issuer", "title", "source_tier", "jurisdiction", "official_url", "locator",
      "verified_on", "access_status", "archive_supersession_note", "freshness_risk",
    ],
    [],
    [],
    issues,
  );
  const edges = validateEntities(
    root.dependency_edges,
    "pack.dependency_edges",
    ["id", "from_task_id", "to_task_id", "relation", "condition"],
    [],
    [],
    issues,
  );
  for (const [key, value] of [["conflicts", root.conflicts], ["coverage_gaps", root.coverage_gaps]] as const) {
    if (!Array.isArray(value)) issues.push({ path: `pack.${key}`, message: `pack.${key} must be an array.` });
  }
  requireRecord(root.demo_scenario, "pack.demo_scenario", issues);

  [
    [questions, "pack.qualifying_questions"],
    [tasks, "pack.tasks"],
    [actors, "pack.authorities_actors"],
    [journeys, "pack.portal_journeys"],
    [inputs, "pack.required_inputs"],
    [proofs, "pack.completion_proofs"],
    [claims, "pack.claims"],
    [sources, "pack.sources"],
    [edges, "pack.dependency_edges"],
  ].forEach(([entities, path]) => duplicateIds(entities as readonly JsonRecord[], path as string, issues));

  if (issues.length > 0) throw new ResearchPackValidationError(issues);
  return input as ResearchPack;
}

const unique = (values: readonly string[]): readonly string[] => [...new Set(values)];

const entityId = (packId: string, type: string, originalId: string): string =>
  `${packId}:${type}:${originalId}`;

const questionFactKey = (packId: string, questionId: string): string =>
  entityId(packId, "fact.question", questionId);

const supportedAnswerTypes = new Set<QuestionDefinition["answerType"]>([
  "boolean",
  "single_select",
  "multi_select",
  "text",
  "number",
  "date",
  "identifier",
  "document",
  "unknown",
]);

function mapAnswerType(
  answerType: string,
  questionId: string,
): QuestionDefinition["answerType"] {
  if (supportedAnswerTypes.has(answerType as QuestionDefinition["answerType"])) {
    return answerType as QuestionDefinition["answerType"];
  }
  throw new ResearchPackValidationError([{
    path: `qualifying_questions.${questionId}.answer_type`,
    message: `Unsupported qualifying-question answer type ${answerType}.`,
  }]);
}

function mapStatus(status: string): ClaimStatus {
  switch (status) {
    case "Verified": return "verified";
    case "Candidate": return "candidate";
    case "Conflict": return "conflict";
    case "Stale": return "stale";
    case "Unavailable": return "unavailable";
    default: return "under-review";
  }
}

function mapTier(tier: string): EvidenceTier {
  switch (tier) {
    case "T1_LAW": return "law";
    case "T1_AUTHORITY": return "operative-instrument";
    case "T1_PORTAL": return "service-owner";
    case "T1_REGULATED_ACTOR": return "service-owner";
    case "T2_OFFICIAL_ADJACENT": return "official-aggregator";
    default: return "historical-discovery";
  }
}

function mapAuthority(actor: ResearchActor | undefined): Authority {
  if (!actor) return { name: "Authority not resolved by research", type: "private-operational" };
  const type: Authority["type"] =
    actor.actor_type === "central_government" ? "central"
      : actor.actor_type === "statutory_regulator" ? "national-regulator"
        : actor.actor_type === "state_local" ? "state"
          : actor.actor_type === "judicial" ? "court"
            : actor.actor_type === "regulated_private" ? "private-regulated"
              : "private-operational";
  return { name: actor.name, type };
}

function sourceIsAdmissible(source: ResearchSource, verificationDate: string): boolean {
  return source.source_tier.startsWith("T1_") &&
    source.access_status === "accessible" &&
    source.official_url.startsWith("https://") &&
    source.verified_on === verificationDate;
}

export function normalizeResearchPack(
  input: unknown,
  profile: ResearchPackProfile,
): ResearchPackImportResult {
  const research = validateResearchPack(input);
  if (research.schema_version !== REGISTRY_SCHEMA_VERSION) {
    throw new ResearchPackValidationError([{
      path: "pack.schema_version",
      message: `Unsupported research schema ${research.schema_version}.`,
    }]);
  }

  const issues: ResearchImportIssue[] = [];
  const actors = new Map(research.authorities_actors.map((actor) => [actor.id, actor]));
  const journeysById = new Map(research.portal_journeys.map((journey) => [journey.id, journey]));
  const inputsById = new Map(research.required_inputs.map((item) => [item.id, item]));
  const proofsById = new Map(research.completion_proofs.map((proof) => [proof.id, proof]));
  const originalClaimsById = new Map(research.claims.map((claim) => [claim.id, claim]));
  const originalSourcesById = new Map(research.sources.map((source) => [source.id, source]));
  const taskIds = new Set(research.tasks.map((task) => task.id));

  const unknownReference = (path: string, id: string): never => {
    throw new ResearchPackValidationError([{ path, message: `${path} references unknown ID ${id}.` }]);
  };
  for (const task of research.tasks) {
    task.actor_ids.forEach((id) => { if (!actors.has(id)) unknownReference(`tasks.${task.id}.actor_ids`, id); });
    task.prerequisite_task_ids.forEach((id) => { if (!taskIds.has(id)) unknownReference(`tasks.${task.id}.prerequisite_task_ids`, id); });
    task.portal_journey_ids.forEach((id) => { if (!journeysById.has(id)) unknownReference(`tasks.${task.id}.portal_journey_ids`, id); });
    task.required_input_ids.forEach((id) => { if (!inputsById.has(id)) unknownReference(`tasks.${task.id}.required_input_ids`, id); });
    task.completion_proof_ids.forEach((id) => { if (!proofsById.has(id)) unknownReference(`tasks.${task.id}.completion_proof_ids`, id); });
    task.claim_ids.forEach((id) => { if (!originalClaimsById.has(id)) unknownReference(`tasks.${task.id}.claim_ids`, id); });
  }
  for (const question of research.qualifying_questions) {
    question.affects_task_ids.forEach((id) => {
      if (!taskIds.has(id)) unknownReference(`qualifying_questions.${question.id}.affects_task_ids`, id);
    });
  }
  for (const claim of research.claims) {
    claim.source_ids.forEach((id) => { if (!originalSourcesById.has(id)) unknownReference(`claims.${claim.id}.source_ids`, id); });
  }
  for (const journey of research.portal_journeys) {
    if (!actors.has(journey.actor_id)) unknownReference(`portal_journeys.${journey.id}.actor_id`, journey.actor_id);
    journey.claim_ids.forEach((id) => { if (!originalClaimsById.has(id)) unknownReference(`portal_journeys.${journey.id}.claim_ids`, id); });
  }
  for (const proof of research.completion_proofs) {
    if (!actors.has(proof.issuing_actor_id)) unknownReference(`completion_proofs.${proof.id}.issuing_actor_id`, proof.issuing_actor_id);
    proof.claim_ids.forEach((id) => { if (!originalClaimsById.has(id)) unknownReference(`completion_proofs.${proof.id}.claim_ids`, id); });
  }

  const questions: QuestionDefinition[] = research.qualifying_questions.map((question) => {
    const answerType = mapAnswerType(question.answer_type, question.id);
    return {
      id: entityId(profile.packId, "question", question.id),
      factKey: questionFactKey(profile.packId, question.id),
      prompt: question.question,
      reason: question.why_it_matters,
      answerType,
      options: question.options,
      ...(answerType === "document"
        ? {
            unsupportedReason:
              "This navigator does not collect or upload documents. Keep this fact unknown and use the affected task details to verify the required evidence safely.",
          }
        : answerType === "unknown"
          ? {
              unsupportedReason:
                "The source pack does not define a safe answer format for this question. Keep it unknown and use the affected task details to resolve it.",
            }
        : {}),
    };
  });
  const questionFactKeysByTaskId = new Map<string, string[]>();
  for (const question of research.qualifying_questions) {
    for (const taskId of question.affects_task_ids) {
      questionFactKeysByTaskId.set(taskId, [
        ...(questionFactKeysByTaskId.get(taskId) ?? []),
        questionFactKey(profile.packId, question.id),
      ]);
    }
  }

  const sourceDefinitions: EvidenceSourceDefinition[] = research.sources.map((source) => ({
    id: entityId(profile.packId, "source", source.id),
    title: source.title,
    issuer: source.issuer,
    url: source.official_url,
    official: sourceIsAdmissible(source, research.pack_metadata.verification_date),
    tier: mapTier(source.source_tier),
    jurisdiction: centralJurisdiction,
    retrievedOn: source.verified_on,
    locator: source.locator,
  }));
  const sourceDefinitionsByOriginalId = new Map(
    research.sources.map((source, index) => [source.id, sourceDefinitions[index]!] as const),
  );

  const normalizedClaims: ClaimDefinition[] = [];
  const normalizedClaimsByOriginalId = new Map<string, ClaimDefinition>();
  const claimProvenance: ResearchClaimProvenance[] = [];

  for (const claim of research.claims) {
    const acceptableSourceIds = claim.source_ids.flatMap((sourceId) => {
      const original = originalSourcesById.get(sourceId)!;
      const normalized = sourceDefinitionsByOriginalId.get(sourceId)!;
      if (sourceIsAdmissible(original, research.pack_metadata.verification_date)) return [normalized.id];
      issues.push({
        code: "source-reference-not-admitted",
        disposition: "downgraded",
        path: `claims.${claim.id}.source_ids`,
        message: `${claim.id} source ${sourceId} was excluded from actionable closure because it is not currently accessible official evidence.`,
      });
      return [];
    });
    const mapped = mapStatus(claim.status);
    const normalizedStatus: ClaimStatus =
      mapped === "verified" && claim.conflict_ids.length > 0 ? "conflict"
        : mapped === "verified" && acceptableSourceIds.length === 0 ? "under-review"
          : mapped;
    if (normalizedStatus !== "verified") {
      issues.push({
        code: normalizedStatus === mapped ? "research-claim-non-actionable" : "research-claim-downgraded",
        disposition: normalizedStatus === mapped ? "preserved-non-actionable" : "downgraded",
        path: `claims.${claim.id}.status`,
        message: `${claim.id} remains ${normalizedStatus} and cannot expose instructions.`,
      });
    }
    const normalized: ClaimDefinition = {
      id: entityId(profile.packId, "claim", claim.id),
      kind: "research-assertion",
      statement: claim.statement,
      status: normalizedStatus,
      sourceIds: acceptableSourceIds,
      jurisdiction: centralJurisdiction,
      ...(normalizedStatus === "verified"
        ? {
            verifiedOn: claim.verified_on,
            reviewDueOn: claim.verified_on,
          }
        : {}),
    };
    normalizedClaims.push(normalized);
    normalizedClaimsByOriginalId.set(claim.id, normalized);
    claimProvenance.push({
      originalId: claim.id,
      normalizedId: normalized.id,
      originalStatus: claim.status,
      normalizedStatus,
      originalSourceIds: claim.source_ids,
      admittedSourceIds: acceptableSourceIds,
      subject: claim.subject,
      jurisdiction: claim.jurisdiction,
      applicability: claim.applicability,
      locator: claim.locator,
      freshnessRisk: claim.freshness_risk,
    });
  }

  const journeys: JourneyDefinition[] = [];
  const tasks: TaskDefinition[] = [];

  const addSyntheticClaim = (
    id: string,
    statement: string,
    status: ClaimStatus = "under-review",
  ): string => {
    const normalizedId = entityId(profile.packId, "claim.import-gap", id);
    normalizedClaims.push({
      id: normalizedId,
      kind: "research-assertion",
      statement,
      status,
      sourceIds: [],
      jurisdiction: centralJurisdiction,
    });
    return normalizedId;
  };

  const normalizedProofs = new Map<string, Readonly<{
    wrapperId: string;
    supportingClaimIds: readonly string[];
    description: string;
  }>>();
  for (const proof of research.completion_proofs) {
    const supportingClaims = proof.claim_ids.map((id) => normalizedClaimsByOriginalId.get(id)!);
    const supportingSourceIds = unique(supportingClaims.flatMap((claim) => claim.sourceIds));
    const wrapperStatus: ClaimStatus =
      supportingClaims.length > 0 &&
      supportingClaims.every((claim) => claim.status === "verified") &&
      supportingSourceIds.length > 0
        ? "verified"
        : "under-review";
    const wrapperId = entityId(profile.packId, "claim.completion-proof", proof.id);
    normalizedClaims.push({
      id: wrapperId,
      kind: "completion-proof",
      statement: `${proof.artifact_or_reference} Validation: ${proof.validation_method}`,
      status: wrapperStatus,
      sourceIds: supportingSourceIds,
      jurisdiction: centralJurisdiction,
      ...(wrapperStatus === "verified"
        ? {
            verifiedOn: research.pack_metadata.verification_date,
            reviewDueOn: research.pack_metadata.verification_date,
          }
        : {}),
    });
    if (wrapperStatus !== "verified") {
      issues.push({
        code: "completion-proof-not-admitted",
        disposition: "preserved-non-actionable",
        path: `completion_proofs.${proof.id}`,
        message: `${proof.id} lacks a completely verified official claim closure.`,
      });
    }
    normalizedProofs.set(proof.id, {
      wrapperId,
      supportingClaimIds: supportingClaims.map((claim) => claim.id),
      description: `${proof.name}: ${proof.artifact_or_reference} Validate by: ${proof.validation_method}`,
    });
  }

  for (const task of research.tasks) {
    const normalizedTaskId = entityId(profile.packId, "task", task.id);
    const responsibleActor = actors.get(task.actor_ids[0] ?? "");
    const authority = mapAuthority(responsibleActor);
    const taskClaimIds = task.claim_ids.map((id) => normalizedClaimsByOriginalId.get(id)!.id);
    const requiredClaimIds = [...taskClaimIds];
    if (task.evidence_status !== "Verified") {
      requiredClaimIds.push(addSyntheticClaim(
        `task-status:${task.id}`,
        `${task.fail_closed_note} Research task status: ${task.evidence_status}.`,
        mapStatus(task.evidence_status),
      ));
    }

    const referencedJourneys = task.portal_journey_ids.map((id) => journeysById.get(id)!);
    const journeyClaimIds = unique(
      referencedJourneys.flatMap((journey) =>
        journey.claim_ids.map((id) => normalizedClaimsByOriginalId.get(id)!.id),
      ),
    );
    const officialStart = referencedJourneys.find(
      (journey) => journey.official_url?.startsWith("https://"),
    );
    const expectsPortal = ["official_portal", "hybrid", "regulated_actor"].includes(task.channel);
    if (expectsPortal && !officialStart) {
      requiredClaimIds.push(addSyntheticClaim(
        `official-start:${task.id}`,
        `No admitted HTTPS official start page is available for ${task.title}.`,
      ));
      issues.push({
        code: "official-start-not-admitted",
        disposition: "preserved-non-actionable",
        path: `tasks.${task.id}.portal_journey_ids`,
        message: `${task.id} has no usable HTTPS official start and remains non-actionable.`,
      });
    }

    const proofClaimIds: string[] = [];
    const proofDescriptions: string[] = [];
    for (const proofId of task.completion_proof_ids) {
      const proof = normalizedProofs.get(proofId)!;
      proofClaimIds.push(proof.wrapperId, ...proof.supportingClaimIds);
      proofDescriptions.push(proof.description);
    }
    if (proofClaimIds.length === 0) {
      const gapId = addSyntheticClaim(
        `completion-proof:${task.id}`,
        `The research artifact does not declare a supported completion proof for ${task.title}.`,
      );
      normalizedClaims.push({
        id: entityId(profile.packId, "claim.completion-proof", `missing:${task.id}`),
        kind: "completion-proof",
        statement: `Completion proof for ${task.title} is not admitted.`,
        status: "under-review",
        sourceIds: [],
        jurisdiction: centralJurisdiction,
      });
      proofClaimIds.push(gapId, entityId(profile.packId, "claim.completion-proof", `missing:${task.id}`));
      proofDescriptions.push("Completion proof is not admitted from the current research artifact.");
    }

    const isOutsideScope =
      task.channel === "state_local" ||
      authority.type === "state" ||
      authority.type === "local";
    const journeyId = entityId(profile.packId, "journey", task.id);
    if (!isOutsideScope) {
      const instructions: JourneyStepDefinition[] = [];
      let stepIndex = 0;
      const instructionClaims = taskClaimIds.length > 0
        ? taskClaimIds
        : [addSyntheticClaim(`task-steps:${task.id}`, `Task steps for ${task.title} lack claim closure.`)];
      task.steps.forEach((instruction) => {
        instructions.push({
          id: entityId(profile.packId, "step", `${task.id}:${stepIndex++}`),
          instruction,
          claimIds: instructionClaims,
        });
      });
      for (const portalJourney of referencedJourneys) {
        const claimIds = portalJourney.claim_ids.length > 0
          ? portalJourney.claim_ids.map((id) => normalizedClaimsByOriginalId.get(id)!.id)
          : [addSyntheticClaim(
              `portal-journey:${task.id}:${portalJourney.id}`,
              `${portalJourney.id} has no claim closure.`,
            )];
        const portalInstructions = [
          `Authenticate: ${portalJourney.authentication}`,
          `Navigate: ${portalJourney.navigation}`,
          ...(portalJourney.inputs_uploads.length > 0
            ? [`Provide only when applicable: ${portalJourney.inputs_uploads.join("; ")}`]
            : []),
          `Submission proof: ${portalJourney.submission_proof}`,
          `Track or correct: ${portalJourney.tracking_route} Exception route: ${portalJourney.exception_route}`,
          `Access limitation: ${portalJourney.access_limitation}`,
        ];
        portalInstructions.forEach((instruction) => {
          instructions.push({
            id: entityId(profile.packId, "step", `${task.id}:${stepIndex++}`),
            instruction,
            claimIds,
          });
        });
      }
      if (instructions.length === 0) {
        const gapClaim = addSyntheticClaim(`instructions:${task.id}`, `${task.title} has no admitted ordered instructions.`);
        instructions.push({
          id: entityId(profile.packId, "step", `${task.id}:${stepIndex}`),
          instruction: "Detailed instructions are withheld pending claim-level research.",
          claimIds: [gapClaim],
        });
      }
      journeys.push({
        id: journeyId,
        channel: officialStart
          ? task.channel === "official_portal" ? "portal" : "mixed"
          : "offline",
        ...(officialStart ? { portalName: officialStart.name, officialUrl: officialStart.official_url! } : {}),
        startClaimIds: journeyClaimIds,
        instructions,
        completionProof: {
          description: proofDescriptions.join(" | "),
          claimIds: unique(proofClaimIds),
        },
        helpOrEscalation: `Tracking: ${task.tracking} Rejection: ${task.rejection_handling} Escalation: ${task.escalation}`,
        ...(taskClaimIds.length > 0 ? { helpClaimIds: taskClaimIds } : {}),
      });
    }

    const requiredInputs = task.required_input_ids.map((id) => inputsById.get(id)!.name);
    const stateDependencyId = entityId(profile.packId, "task.state-local", task.id);
    const dependencies = task.prerequisite_task_ids.map((id) => entityId(profile.packId, "task", id));
    if (task.state_local_dependency.applies) dependencies.push(stateDependencyId);

    tasks.push({
      id: normalizedTaskId,
      title: task.title,
      action: task.user_goal,
      reason: task.trigger,
      authority,
      classification: isOutsideScope ? "outside-scope" : "conditional",
      dependencies,
      requiredAnswers: questionFactKeysByTaskId.get(task.id) ?? [],
      requiredInformation: requiredInputs,
      requiredDocuments: [],
      requiredClaimIds: unique(requiredClaimIds),
      ...(!isOutsideScope ? { journeyId } : {}),
      blockers: unique([
        task.fail_closed_note,
        ...(task.evidence_status !== "Verified"
          ? [`Research status ${task.evidence_status}; instructions remain withheld.`]
          : []),
        ...(isOutsideScope ? ["State-specific instructions are not supported in V1."] : []),
      ]),
    });

    if (task.state_local_dependency.applies) {
      tasks.push({
        id: stateDependencyId,
        title: `Resolve state or local dependency for ${task.title}`,
        action: task.state_local_dependency.description,
        reason: `Research status: ${task.state_local_dependency.status}.`,
        authority: { name: "Relevant state or local authority", type: "state" },
        classification: "outside-scope",
        requiredAnswers: questionFactKeysByTaskId.get(task.id) ?? [],
        requiredInformation: [],
        requiredDocuments: [],
        requiredClaimIds: [],
        blockers: [
          "State-specific instructions are not supported in V1.",
          `Research state/local evidence status: ${task.state_local_dependency.status}.`,
        ],
      });
    }
  }

  issues.push(
    {
      code: "free-text-blocking-logic-not-mapped",
      disposition: "not-mapped",
      path: "qualifying_questions[*].blocking_logic",
      message: "Authored typed questions and options are preserved. Free-text blocking logic is not coerced into executable applicability rules; affected tasks remain needs-information until a supported answer is provided.",
    },
    {
      code: "measures-not-mapped",
      disposition: "not-mapped",
      path: "tasks[*].fees_duties|timelines",
      message: "Fee and timeline measures are preserved in the source snapshot but are not exposed until the domain has atomic measure fields.",
    },
    {
      code: "required-document-kind-not-mapped",
      disposition: "not-mapped",
      path: "required_inputs[*]",
      message: "Research inputs do not deterministically distinguish documents from information; all names remain required information and no document content is stored.",
    },
    {
      code: "same-day-review-window",
      disposition: "downgraded",
      path: "claims[*].reviewDueOn",
      message: "Research has no review-due field. Verified claims expire after their verification date rather than receiving an invented validity period.",
    },
  );

  const sourceProvenance: ResearchSourceProvenance[] = research.sources.map((source) => ({
    originalId: source.id,
    normalizedId: entityId(profile.packId, "source", source.id),
    sourceTier: source.source_tier,
    jurisdiction: source.jurisdiction,
    accessStatus: source.access_status,
    freshnessRisk: source.freshness_risk,
    publicationDate: source.publication_date,
    notificationDate: source.notification_date,
    effectiveDate: source.effective_date,
    updatedDate: source.updated_date,
    archiveSupersessionNote: source.archive_supersession_note,
  }));

  const pack: KnowledgePackV1 = {
    schemaVersion: REGISTRY_SCHEMA_VERSION,
    id: profile.packId,
    version: research.schema_version,
    lifecycle: "admitted",
    sources: sourceDefinitions,
    claims: normalizedClaims,
    journeys,
    questions,
    tasks,
    outcomes: [{
      id: profile.outcomeId,
      version: research.schema_version,
      title: research.pack_metadata.title,
      description: research.pack_metadata.user_outcome,
      domains: profile.domains,
      intentPhrases: profile.intentPhrases,
      questionIds: questions.map((question) => question.id),
      taskIds: tasks.map((task) => task.id),
    }],
  };

  return {
    pack,
    report: {
      packId: profile.packId,
      outcomeId: profile.outcomeId,
      sourcePackId: research.pack_metadata.pack_id,
      sourceSchemaVersion: research.schema_version,
      ...(profile.sourceArtifact ? { sourceArtifact: profile.sourceArtifact } : {}),
      ...(profile.sourceSha256 ? { sourceSha256: profile.sourceSha256 } : {}),
      verificationDate: research.pack_metadata.verification_date,
      overallReadiness: research.pack_metadata.overall_readiness,
      issues,
      provenance: { claims: claimProvenance, sources: sourceProvenance },
    },
  };
}
