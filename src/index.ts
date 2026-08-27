export {
  PrivacyViolationError,
  RoadmapNotFoundError,
  UnsafeAiSelectionError,
  createNavigatorApplication,
} from "./application.js";
export type {
  NavigatorApplication,
  NavigatorApplicationOptions,
} from "./application.js";

export {
  CompletionProofRequiredError,
  InvalidTaskTransitionError,
  UnknownOutcomeError,
  buildRoadmap,
  confirmTaskCompletion,
  getAvailableNextActions,
  rebuildRoadmapWithAnswers,
  transitionTask,
} from "./engine.js";

export { deterministicIntentProvider } from "./intent.js";

export {
  ResearchPackValidationError,
  normalizeResearchPack,
  researchAdmissionManifest,
  researchIntegrationReports,
} from "./packs/research/index.js";
export type {
  ResearchClaimProvenance,
  ResearchImportIssue,
  ResearchIntegrationReport,
  ResearchPackImportResult,
  ResearchPackProfile,
  ResearchPackValidationIssue,
  ResearchSourceProvenance,
} from "./packs/research/index.js";

export {
  FileRoadmapRepository,
  InMemoryRoadmapRepository,
  toShareableRoadmap,
} from "./persistence.js";

export {
  RegistryValidationError,
  builtInRegistry,
  createRegistry,
  resolveNaturalLanguageOutcome,
} from "./registry.js";
export type {
  RegistryEntity,
  RegistryValidationIssue,
} from "./registry.js";

export { REGISTRY_SCHEMA_VERSION } from "./domain.js";
export type {
  ApiErrorBody,
  ApiErrorEnvelope,
  ApiSuccessEnvelope,
} from "./lib/api.js";
export type {
  AnswerValue,
  Answers,
  Applicability,
  Authority,
  AuthorityType,
  BuildRoadmapInput,
  BuildRoadmapOptions,
  Claim,
  ClaimDefinition,
  ClaimKind,
  ClaimStatus,
  CompletionConfirmation,
  CompletionProofDefinition,
  ContentRegistry,
  EntryPoint,
  EvidenceSource,
  EvidenceSourceDefinition,
  EvidenceTier,
  ExcludedRoadmapTask,
  IntentProvider,
  IntentProviderRequest,
  IntentProviderResult,
  JourneyDefinition,
  JourneyStepDefinition,
  Jurisdiction,
  JurisdictionLevel,
  KnowledgePackV1,
  OutcomeDefinition,
  QuestionDefinition,
  RegistrySchemaVersion,
  Roadmap,
  RoadmapJourney,
  RoadmapNextAction,
  RoadmapQuestion,
  RoadmapRepository,
  RoadmapTask,
  Rule,
  ShareableRoadmap,
  TaskClassification,
  TaskDefinition,
  TaskProgressStatus,
  TaskTransition,
} from "./domain.js";
