import {
  REGISTRY_SCHEMA_VERSION,
  type KnowledgePackV1,
  type QuestionDefinition,
  type TaskDefinition,
} from "../domain.js";

const questions: readonly QuestionDefinition[] = [
  ["death.question.certificate", "deathCertificateAvailable", "Do you have the death certificate?"],
  ["death.question.relationship", "relationship", "What was your relationship to the deceased person?"],
  ["death.question.nomination", "nominationKnown", "Is a nomination known for the relevant assets?"],
  ["death.question.epfo", "hasEpfo", "Could EPF, EPS or EDLI assets exist?"],
  ["death.question.nps", "hasNps", "Could an NPS account exist?"],
  ["death.question.bank", "hasBankAccounts", "Could bank deposits exist?"],
  ["death.question.securities", "hasSecurities", "Could securities or investor assets exist?"],
].map(([id, factKey, prompt]) => ({
  id: id!,
  factKey: factKey!,
  prompt: prompt!,
  reason: "The answer changes the asset-claim dependency graph.",
}));

const task = (
  value: Omit<
    TaskDefinition,
    "requiredInformation" | "requiredDocuments" | "requiredClaimIds"
  >,
): TaskDefinition => ({
  ...value,
  requiredInformation: [],
  requiredDocuments: [],
  requiredClaimIds: [],
});

const tasks: readonly TaskDefinition[] = [
  task({
    id: "discover-regulated-assets",
    title: "Discover central and regulated financial assets",
    action: "Build the asset-discovery worklist.",
    reason: "Discovery determines which claim branches are relevant.",
    authority: { name: "Central and regulated financial institutions", type: "private-regulated" },
    classification: "required",
    requiredAnswers: ["deathCertificateAvailable", "relationship"],
  }),
  task({
    id: "obtain-state-succession-proof",
    title: "Obtain the applicable state succession or heirship proof",
    action: "Resolve the state-issued proof dependency.",
    reason: "A claim branch without a usable nomination may require state-issued proof.",
    authority: { name: "Relevant state authority", type: "state" },
    classification: "outside-scope",
    dependencies: ["discover-regulated-assets"],
    appliesWhen: { field: "nominationKnown", operator: "equals", value: false },
    requiredAnswers: ["nominationKnown"],
    journeyId: "death.journey.state-proof-placeholder",
    blockers: ["State-specific instructions are not supported in V1."],
  }),
  task({
    id: "claim-epfo-assets",
    title: "Resolve EPF, EPS and EDLI claims",
    action: "Build the applicable EPFO claim branch.",
    reason: "The user indicated that EPFO-linked assets may exist.",
    authority: { name: "Employees' Provident Fund Organisation", type: "central" },
    classification: "conditional",
    dependencies: ["discover-regulated-assets", "obtain-state-succession-proof"],
    appliesWhen: { field: "hasEpfo", operator: "equals", value: true },
    requiredAnswers: ["hasEpfo", "nominationKnown"],
  }),
  task({
    id: "claim-nps-assets",
    title: "Resolve NPS claims",
    action: "Build the applicable NPS claim branch.",
    reason: "The user indicated that an NPS account may exist.",
    authority: { name: "Pension Fund Regulatory and Development Authority", type: "national-regulator" },
    classification: "conditional",
    dependencies: ["discover-regulated-assets", "obtain-state-succession-proof"],
    appliesWhen: { field: "hasNps", operator: "equals", value: true },
    requiredAnswers: ["hasNps", "nominationKnown"],
  }),
  task({
    id: "claim-bank-assets",
    title: "Resolve bank-deposit claims",
    action: "Build the applicable bank-asset claim branch.",
    reason: "The user indicated that bank deposits may exist.",
    authority: { name: "Regulated banks", type: "private-regulated" },
    classification: "conditional",
    dependencies: ["discover-regulated-assets", "obtain-state-succession-proof"],
    appliesWhen: { field: "hasBankAccounts", operator: "equals", value: true },
    requiredAnswers: ["hasBankAccounts", "nominationKnown"],
  }),
  task({
    id: "claim-securities-assets",
    title: "Resolve securities and investor-asset claims",
    action: "Build the applicable securities claim branch.",
    reason: "The user indicated that securities or investor assets may exist.",
    authority: { name: "Regulated market institutions", type: "private-regulated" },
    classification: "conditional",
    dependencies: ["discover-regulated-assets", "obtain-state-succession-proof"],
    appliesWhen: { field: "hasSecurities", operator: "equals", value: true },
    requiredAnswers: ["hasSecurities", "nominationKnown"],
  }),
];

export const postDeathRegulatedAssetsPack: KnowledgePackV1 = {
  schemaVersion: REGISTRY_SCHEMA_VERSION,
  id: "fixture.post-death-regulated-assets",
  version: "1.0.0",
  lifecycle: "fixture",
  sources: [],
  claims: [],
  journeys: [
    {
      id: "death.journey.state-proof-placeholder",
      channel: "offline",
      startClaimIds: [],
      instructions: [],
    },
  ],
  questions,
  tasks,
  outcomes: [
    {
      id: "post-death-regulated-assets",
      version: "1.0.0",
      title: "Discover and claim regulated assets after a death",
      description:
        "Build a dependency-aware roadmap for central and regulated financial assets after a death.",
      domains: ["money-tax-pf-benefits", "family-health-education"],
      intentPhrases: [
        "claim deceased assets",
        "find parent's financial assets",
        "death claim",
        "legal heir assets",
      ],
      questionIds: questions.map((question) => question.id),
      taskIds: tasks.map((item) => item.id),
    },
  ],
};
