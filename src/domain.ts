export const REGISTRY_SCHEMA_VERSION = "1.0.0" as const;

export type RegistrySchemaVersion = typeof REGISTRY_SCHEMA_VERSION;
export type Applicability = true | false | "unknown";
export type AnswerValue = string | number | boolean | null;
export type Answers = Readonly<Record<string, AnswerValue | undefined>>;

export type EntryPoint =
  | Readonly<{ kind: "natural-language"; text: string }>
  | Readonly<{ kind: "browse"; outcomeId: string }>;

export type AuthorityType =
  | "central"
  | "national-regulator"
  | "state"
  | "local"
  | "court"
  | "private-regulated"
  | "private-operational";

export interface Authority {
  readonly name: string;
  readonly type: AuthorityType;
}

export type JurisdictionLevel = "central" | "state" | "local" | "institution";

export interface Jurisdiction {
  readonly countryCode: "IN";
  readonly level: JurisdictionLevel;
  readonly stateCode?: string;
  readonly localCode?: string;
  readonly institutionId?: string;
}

export type ClaimStatus =
  | "candidate"
  | "under-review"
  | "verified"
  | "unavailable"
  | "conflict"
  | "stale"
  | "superseded";

export type ClaimKind =
  | "legal-obligation"
  | "eligibility"
  | "required-information"
  | "required-document"
  | "fee"
  | "deadline"
  | "processing-time"
  | "validity"
  | "portal-instruction"
  | "completion-proof"
  | "tracking"
  | "help-escalation";

export type EvidenceTier =
  | "law"
  | "operative-instrument"
  | "service-owner"
  | "official-aggregator"
  | "official-clarification"
  | "historical-discovery";

export interface EvidenceSourceDefinition {
  readonly id: string;
  readonly title: string;
  readonly issuer: string;
  readonly url: string;
  readonly official: boolean;
  readonly tier: EvidenceTier;
  readonly jurisdiction: Jurisdiction;
  readonly retrievedOn: string;
  readonly locator?: string;
}

export interface ClaimDefinition {
  readonly id: string;
  readonly kind: ClaimKind;
  readonly statement: string;
  readonly status: ClaimStatus;
  readonly sourceIds: readonly string[];
  readonly jurisdiction: Jurisdiction;
  readonly verifiedOn?: string;
  readonly reviewDueOn?: string;
  readonly appliesWhen?: Rule;
}

export type Rule =
  | Readonly<{
      field: string;
      operator: "equals" | "not-equals";
      value: AnswerValue;
    }>
  | Readonly<{
      field: string;
      operator: "in";
      values: readonly AnswerValue[];
    }>
  | Readonly<{ all: readonly Rule[] }>
  | Readonly<{ any: readonly Rule[] }>
  | Readonly<{ not: Rule }>;

export type TaskClassification =
  | "required"
  | "conditional"
  | "recommended"
  | "optional"
  | "urgent"
  | "needs-information"
  | "not-applicable"
  | "outside-scope";

export type TaskProgressStatus =
  | "needs-information"
  | "not-started"
  | "ready"
  | "blocked"
  | "in-progress"
  | "awaiting-authority"
  | "completed"
  | "not-applicable";

export interface JourneyStepDefinition {
  readonly id: string;
  readonly instruction: string;
  readonly claimIds: readonly string[];
}

export interface CompletionProofDefinition {
  readonly description: string;
  readonly claimIds: readonly string[];
}

export interface JourneyDefinition {
  readonly id: string;
  readonly channel: "portal" | "offline" | "mixed";
  readonly portalName?: string;
  readonly officialUrl?: string;
  readonly startClaimIds: readonly string[];
  readonly instructions: readonly JourneyStepDefinition[];
  readonly completionProof?: CompletionProofDefinition;
  readonly helpOrEscalation?: string;
  readonly helpClaimIds?: readonly string[];
}

export interface TaskDefinition {
  readonly id: string;
  readonly title: string;
  readonly action: string;
  readonly reason: string;
  readonly authority: Authority;
  readonly classification: TaskClassification;
  readonly dependencies?: readonly string[];
  readonly appliesWhen?: Rule;
  readonly requiredAnswers?: readonly string[];
  readonly requiredInformation: readonly string[];
  readonly requiredDocuments: readonly string[];
  readonly requiredClaimIds: readonly string[];
  readonly journeyId?: string;
  readonly blockers?: readonly string[];
}

export interface QuestionDefinition {
  readonly id: string;
  readonly factKey: string;
  readonly prompt: string;
  readonly reason: string;
  readonly askWhen?: Rule;
}

export interface OutcomeDefinition {
  readonly id: string;
  readonly version: string;
  readonly title: string;
  readonly description: string;
  readonly domains: readonly string[];
  readonly intentPhrases: readonly string[];
  readonly questionIds: readonly string[];
  readonly taskIds: readonly string[];
}

export interface KnowledgePackV1 {
  readonly schemaVersion: RegistrySchemaVersion;
  readonly id: string;
  readonly version: string;
  readonly lifecycle: "fixture" | "admitted";
  readonly sources: readonly EvidenceSourceDefinition[];
  readonly claims: readonly ClaimDefinition[];
  readonly journeys: readonly JourneyDefinition[];
  readonly questions: readonly QuestionDefinition[];
  readonly tasks: readonly TaskDefinition[];
  readonly outcomes: readonly OutcomeDefinition[];
}

export interface ContentRegistry {
  readonly schemaVersion: RegistrySchemaVersion;
  readonly packs: readonly KnowledgePackV1[];
  getOutcome(outcomeId: string): OutcomeDefinition | undefined;
  getPackForOutcome(outcomeId: string): KnowledgePackV1 | undefined;
  getTask(packId: string, taskId: string): TaskDefinition | undefined;
  getQuestion(packId: string, questionId: string): QuestionDefinition | undefined;
  getClaim(packId: string, claimId: string): ClaimDefinition | undefined;
  getSource(packId: string, sourceId: string): EvidenceSourceDefinition | undefined;
  getJourney(packId: string, journeyId: string): JourneyDefinition | undefined;
  listOutcomes(domain?: string): readonly OutcomeDefinition[];
}

export interface EvidenceSource extends EvidenceSourceDefinition {}

export interface Claim extends ClaimDefinition {
  readonly applicability: Applicability;
  readonly current: boolean;
  readonly sources: readonly EvidenceSource[];
}

export interface RoadmapQuestion extends QuestionDefinition {
  readonly blocksTaskIds: readonly string[];
}

export interface RoadmapJourney {
  readonly id: string;
  readonly channel: JourneyDefinition["channel"];
  readonly portalName?: string;
  readonly officialUrl?: string;
  readonly instructions: readonly JourneyStepDefinition[];
  readonly helpOrEscalation?: string;
}

export interface RoadmapTask {
  readonly id: string;
  readonly title: string;
  readonly action: string;
  readonly reason: string;
  readonly authority: Authority;
  readonly classification: TaskClassification;
  readonly applicability: Applicability;
  readonly status: TaskProgressStatus;
  readonly actionability: "actionable" | "withheld";
  readonly dependencies: readonly string[];
  readonly missingAnswers: readonly string[];
  readonly requiredInformation: readonly string[];
  readonly requiredDocuments: readonly string[];
  readonly evidence: readonly Claim[];
  readonly journey?: RoadmapJourney;
  readonly completionProof?: CompletionProofDefinition;
  readonly nextAction?: string;
  readonly blockers: readonly string[];
  readonly proofConfirmed: boolean;
}

export interface ExcludedRoadmapTask {
  readonly id: string;
  readonly title: string;
  readonly reason: string;
  readonly classification: "not-applicable";
  readonly applicability: false;
}

export interface RoadmapNextAction {
  readonly taskId: string;
  readonly title: string;
  readonly instruction: string;
}

export interface Roadmap {
  readonly id: string;
  readonly schemaVersion: RegistrySchemaVersion;
  readonly packId: string;
  readonly packVersion: string;
  readonly outcomeId: string;
  readonly outcomeVersion: string;
  readonly outcomeTitle: string;
  readonly jurisdiction: Jurisdiction;
  readonly status: "ready" | "needs-information" | "blocked" | "completed";
  readonly answers: Answers;
  readonly questions: readonly RoadmapQuestion[];
  readonly tasks: readonly RoadmapTask[];
  readonly excludedTasks: readonly ExcludedRoadmapTask[];
  readonly availableNextActions: readonly RoadmapNextAction[];
}

export interface BuildRoadmapInput {
  readonly entry: EntryPoint;
  readonly answers?: Answers;
  readonly jurisdiction?: Jurisdiction;
  readonly roadmapId?: string;
}

export interface BuildRoadmapOptions {
  readonly registry?: ContentRegistry;
  readonly now?: Date;
  readonly idFactory?: () => string;
}

export interface CompletionConfirmation {
  readonly proofConfirmed: boolean;
}

export interface TaskTransition {
  readonly to: Extract<
    TaskProgressStatus,
    "in-progress" | "awaiting-authority" | "completed"
  >;
  readonly proofConfirmed?: boolean;
}

export interface IntentProviderRequest {
  readonly text: string;
  readonly outcomes: readonly Readonly<{
    id: string;
    title: string;
    intentPhrases: readonly string[];
    approvedTaskIds: readonly string[];
    approvedQuestionIds: readonly string[];
  }>[];
}

export interface IntentProviderResult {
  readonly outcomeId?: string;
  readonly selectedTaskIds: readonly string[];
  readonly selectedQuestionIds: readonly string[];
  readonly extractedAnswers: Answers;
}

export interface IntentProvider {
  readonly kind: string;
  interpret(request: IntentProviderRequest): Promise<IntentProviderResult>;
}

export interface RoadmapRepository {
  save(roadmap: Roadmap): Promise<void>;
  load(roadmapId: string): Promise<Roadmap | undefined>;
}

export type ShareableRoadmap = Omit<Roadmap, "answers" | "tasks"> &
  Readonly<{
    tasks: readonly Omit<RoadmapTask, "proofConfirmed">[];
  }>;
